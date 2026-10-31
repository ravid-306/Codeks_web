import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserCertificate, UserProgressData } from '../types/curriculum';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  progress: UserProgressData;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  markChapterCompleted: (chapterId: string, score: number, minutesSpent?: number) => Promise<void>;
  addCertificate: (cert: UserCertificate) => Promise<void>;
  resetProgress: () => void;
}

const LOCAL_STORAGE_KEY = 'codeks_user_progress_v1';

const defaultProgress: UserProgressData = {
  userId: 'guest',
  displayName: 'Codeks Explorer',
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studyMinutes: 10,
  completedChapters: [],
  chapterScores: {},
  badges: ['welcome-scout'],
  certificates: [],
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgressData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore corrupted JSON
        }
      }
    }
    return defaultProgress;
  });

  // Calculate Streak
  const computeStreak = (lastDateStr: string, currentStreak: number): { streak: number; today: string } => {
    const today = new Date().toISOString().split('T')[0];
    if (lastDateStr === today) {
      return { streak: Math.max(1, currentStreak), today };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDateStr === yesterday) {
      return { streak: currentStreak + 1, today };
    }

    // Missed days: reset to 1
    return { streak: 1, today };
  };

  // Sync to Firestore if authenticated, or localStorage if guest
  const saveProgressData = async (updated: UserProgressData, currentUser: FirebaseUser | null) => {
    setProgress(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userRef, {
          userId: currentUser.uid,
          displayName: currentUser.displayName || updated.displayName || 'Codeks Learner',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
          streak: updated.streak,
          lastActiveDate: updated.lastActiveDate,
          studyMinutes: updated.studyMinutes,
          completedChapters: updated.completedChapters,
          badges: updated.badges,
          createdAt: updated.updatedAt,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user record in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            const { streak, today } = computeStreak(data.lastActiveDate || '', data.streak || 1);

            const merged: UserProgressData = {
              userId: firebaseUser.uid,
              displayName: firebaseUser.displayName || data.displayName || 'Codeks Learner',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              streak,
              lastActiveDate: today,
              studyMinutes: data.studyMinutes || progress.studyMinutes || 10,
              completedChapters: Array.from(new Set([...(data.completedChapters || []), ...progress.completedChapters])),
              chapterScores: { ...(data.chapterScores || {}), ...progress.chapterScores },
              badges: Array.from(new Set([...(data.badges || []), ...progress.badges])),
              certificates: progress.certificates || [],
              updatedAt: new Date().toISOString(),
            };

            await saveProgressData(merged, firebaseUser);
          } else {
            // First time login - save existing guest progress under user ID
            const { streak, today } = computeStreak(progress.lastActiveDate, progress.streak);
            const newUserDoc: UserProgressData = {
              ...progress,
              userId: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Codeks Learner',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              streak,
              lastActiveDate: today,
              updatedAt: new Date().toISOString(),
            };
            await saveProgressData(newUserDoc, firebaseUser);
          }
        } catch (err) {
          console.warn('Could not load user from Firestore, fallback to local:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const markChapterCompleted = async (chapterId: string, score: number, minutesSpent: number = 10) => {
    const { streak, today } = computeStreak(progress.lastActiveDate, progress.streak);
    const completedSet = new Set(progress.completedChapters);
    completedSet.add(chapterId);

    const newCompleted = Array.from(completedSet);
    const newScores = { ...progress.chapterScores, [chapterId]: Math.max(score, progress.chapterScores[chapterId] || 0) };
    const newMinutes = (progress.studyMinutes || 0) + minutesSpent;

    // Check badges
    const badges = new Set(progress.badges);
    if (newCompleted.length >= 1) badges.add('first-chapter-unlocked');
    if (newCompleted.length >= 5) badges.add('five-chapters-master');
    if (streak >= 3) badges.add('streak-flame-3');
    if (streak >= 7) badges.add('streak-master-7');
    if (newMinutes >= 60) badges.add('one-hour-scholar');

    const updated: UserProgressData = {
      ...progress,
      streak,
      lastActiveDate: today,
      studyMinutes: newMinutes,
      completedChapters: newCompleted,
      chapterScores: newScores,
      badges: Array.from(badges),
      updatedAt: new Date().toISOString(),
    };

    await saveProgressData(updated, user);
  };

  const addCertificate = async (cert: UserCertificate) => {
    const existingCerts = progress.certificates || [];
    if (!existingCerts.some((c) => c.certId === cert.certId)) {
      const updatedCerts = [...existingCerts, cert];
      const badges = new Set(progress.badges);
      badges.add('certified-developer');
      if (cert.isMaster) {
        badges.add('master-polyglot');
      }

      const updated: UserProgressData = {
        ...progress,
        certificates: updatedCerts,
        badges: Array.from(badges),
        updatedAt: new Date().toISOString(),
      };

      await saveProgressData(updated, user);

      // Save publicly verifiable certificate record to Firestore
      if (user) {
        const certDocRef = doc(db, 'certificates', cert.certId);
        try {
          await setDoc(certDocRef, {
            certId: cert.certId,
            userId: user.uid,
            learnerName: cert.learnerName,
            languageId: cert.languageId,
            languageName: cert.languageName,
            issuedAt: cert.issuedAt,
            studyHours: cert.studyHours,
            score: cert.score,
            verificationHash: cert.verificationHash,
            githubRepoUrl: cert.githubRepoUrl || '',
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `certificates/${cert.certId}`);
        }
      }
    }
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        progress,
        signInWithGoogle,
        signOut,
        markChapterCompleted,
        addCertificate,
        resetProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type LanguageCategory = 'launch' | 'second';

export type QuestionType = 'multiple-choice' | 'predict-output' | 'spot-bug' | 'fill-blank' | 'true-false';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string; // or string value
  explanation: string;
  isParameterised?: boolean;
  parameterGenerator?: () => {
    prompt: string;
    codeSnippet?: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface CodeTask {
  id: string;
  title: string;
  instructions: string;
  starterCode: string;
  solutionExample?: string;
  hints: string[];
  testCases: {
    description: string;
    validate: (code: string, output: string) => boolean | { pass: boolean; feedback?: string };
  }[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  isExam?: boolean;
  lesson: {
    overview: string;
    keyPoints: string[];
    codeExample: string;
    codeExplanation: string;
    proTip: string;
  };
  questionBank: Question[];
  codeTask: CodeTask;
}

export interface Language {
  id: string;
  name: string;
  category: LanguageCategory;
  tagline: string;
  badgeColor: string;
  textColor: string;
  accentBg: string;
  iconName: string;
  description: string;
  industryRole: string;
  chaptersCount: number;
  chapters: Chapter[];
}

export interface UserCertificate {
  certId: string;
  userId: string;
  learnerName: string;
  languageId: string;
  languageName: string;
  issuedAt: string;
  studyHours: number;
  score: number;
  verificationHash: string;
  githubRepoUrl?: string;
  isMaster?: boolean;
}

export interface UserProgressData {
  userId: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  streak: number;
  lastActiveDate: string;
  studyMinutes: number;
  completedChapters: string[]; // e.g. "javascript-1"
  chapterScores: Record<string, number>; // "javascript-1": 100
  badges: string[];
  certificates: UserCertificate[];
  updatedAt: string;
}

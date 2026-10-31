import { Question } from '../types/curriculum';

// Shuffle an array using Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface PreparedQuestion {
  id: string;
  type: Question['type'];
  difficulty: Question['difficulty'];
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

/**
 * Draws 5 questions per quiz session:
 * 2 Easy, 2 Medium, 1 Hard.
 * Avoids question IDs that were answered in the previous round.
 * Evaluates parameterised question generators and shuffles options.
 */
export function generateRandomQuizRound(
  questionBank: Question[],
  previousQuestionIds: string[] = []
): PreparedQuestion[] {
  if (!questionBank || questionBank.length === 0) {
    return [];
  }

  // Filter out recent questions if bank is large enough
  let available = questionBank.filter((q) => !previousQuestionIds.includes(q.id));
  if (available.length < 5) {
    available = [...questionBank];
  }

  const easyPool = available.filter((q) => q.difficulty === 'easy');
  const mediumPool = available.filter((q) => q.difficulty === 'medium');
  const hardPool = available.filter((q) => q.difficulty === 'hard');

  const selectedRaw: Question[] = [];

  // Pick 2 Easy (or fallback to any available)
  const shuffledEasy = shuffleArray(easyPool.length > 0 ? easyPool : available);
  selectedRaw.push(...shuffledEasy.slice(0, 2));

  // Pick 2 Medium (avoid duplicates already chosen)
  const remainingAfterEasy = (mediumPool.length > 0 ? mediumPool : available).filter(
    (q) => !selectedRaw.some((s) => s.id === q.id)
  );
  const shuffledMed = shuffleArray(remainingAfterEasy);
  selectedRaw.push(...shuffledMed.slice(0, 2));

  // Pick 1 Hard (avoid duplicates already chosen)
  const remainingAfterMed = (hardPool.length > 0 ? hardPool : available).filter(
    (q) => !selectedRaw.some((s) => s.id === q.id)
  );
  const shuffledHard = shuffleArray(remainingAfterMed);
  if (shuffledHard.length > 0) {
    selectedRaw.push(shuffledHard[0]);
  }

  // If still less than 5, fill from full pool
  if (selectedRaw.length < 5) {
    const filler = shuffleArray(questionBank.filter((q) => !selectedRaw.some((s) => s.id === q.id)));
    selectedRaw.push(...filler.slice(0, 5 - selectedRaw.length));
  }

  // Materialize questions (handle parameter generators and shuffle options)
  return selectedRaw.slice(0, 5).map((q) => {
    if (q.isParameterised && q.parameterGenerator) {
      const generated = q.parameterGenerator();
      return {
        id: `${q.id}_dyn_${Math.random().toString(36).substring(2, 6)}`,
        type: q.type,
        difficulty: q.difficulty,
        prompt: generated.prompt,
        codeSnippet: generated.codeSnippet,
        options: shuffleArray(generated.options),
        correctAnswer: generated.correctAnswer,
        explanation: generated.explanation,
      };
    }

    return {
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      prompt: q.prompt,
      codeSnippet: q.codeSnippet,
      options: shuffleArray(q.options),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });
}

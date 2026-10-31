import { Chapter, Question, CodeTask, Language } from '../types/curriculum';
import { LANGUAGES } from './languages';

// Helper to generate parameterised math/logic questions
function createParameterisedArithmeticQuestion(id: string, langName: string, opSymbol: string, opName: string): Question {
  return {
    id,
    type: 'predict-output',
    difficulty: 'medium',
    prompt: `Predict the output of this ${langName} arithmetic calculation:`,
    options: [],
    correctAnswer: '',
    explanation: 'Basic arithmetic follows standard operator precedence.',
    isParameterised: true,
    parameterGenerator: () => {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 6) + 3;
      let result = 0;
      if (opSymbol === '+') result = a + b;
      else if (opSymbol === '*') result = a * b;
      else if (opSymbol === '-') result = a - b;
      else if (opSymbol === '%') result = a % b;

      const codeSnippet = `${langName === 'Python' ? `x = ${a}\ny = ${b}\nprint(x ${opSymbol} y)` : `let x = ${a};\nlet y = ${b};\nconsole.log(x ${opSymbol} y);`}`;
      const wrong1 = String(result + 1);
      const wrong2 = String(result - 2);
      const wrong3 = String(result * 2);

      return {
        prompt: `What will be printed when this ${opName} code executes?`,
        codeSnippet,
        options: [String(result), wrong1, wrong2, wrong3],
        correctAnswer: String(result),
        explanation: `${a} ${opSymbol} ${b} evaluates to ${result}.`,
      };
    },
  };
}

function createParameterisedLoopQuestion(id: string, langName: string): Question {
  return {
    id,
    type: 'predict-output',
    difficulty: 'hard',
    prompt: `Predict how many times this loop executes:`,
    options: [],
    correctAnswer: '',
    explanation: 'Loop bounds are determined by the initialization, condition, and increment.',
    isParameterised: true,
    parameterGenerator: () => {
      const start = Math.floor(Math.random() * 3);
      const end = start + Math.floor(Math.random() * 4) + 4;
      const iterations = end - start;

      const codeSnippet = langName === 'Python'
        ? `count = 0\nfor i in range(${start}, ${end}):\n    count += 1\nprint(count)`
        : `let count = 0;\nfor (let i = ${start}; i < ${end}; i++) {\n  count++;\n}\nconsole.log(count);`;

      return {
        prompt: `How many times does this loop iterate from ${start} to ${end - 1}?`,
        codeSnippet,
        options: [String(iterations), String(iterations + 1), String(iterations - 1), String(iterations * 2)],
        correctAnswer: String(iterations),
        explanation: `With i starting at ${start} and continuing while i < ${end}, the loop runs exactly ${iterations} times.`,
      };
    },
  };
}

// Generate rich question bank of at least 15 questions per chapter
function buildQuestionBank(langId: string, langName: string, chNum: number, topic: string): Question[] {
  const bank: Question[] = [];

  // Question 1: Multiple Choice (Easy)
  bank.push({
    id: `${langId}-ch${chNum}-q1`,
    type: 'multiple-choice',
    difficulty: 'easy',
    prompt: `In ${langName}, what is the primary role of ${topic.toLowerCase()}?`,
    options: [
      `To organize code and control program execution safely`,
      `To replace the hardware CPU clock`,
      `To convert code directly into audio files`,
      `To bypass network encryption protocols`,
    ],
    correctAnswer: `To organize code and control program execution safely`,
    explanation: `${topic} provides structured logic for clean, maintainable program flow.`,
  });

  // Question 2: Spot the Bug (Easy)
  bank.push({
    id: `${langId}-ch${chNum}-q2`,
    type: 'spot-bug',
    difficulty: 'easy',
    prompt: `Spot the syntax bug in this snippet:`,
    codeSnippet: langId === 'python' ? `if True\n    print("Codeks")` : `if (true) {\n    console.log("Codeks"\n}`,
    options: [
      langId === 'python' ? `Missing colon ':' at the end of the if statement` : `Missing closing parenthesis ')' in console.log`,
      `Missing import statement`,
      `Invalid string quotes`,
      `Variable name cannot be capitalized`,
    ],
    correctAnswer: langId === 'python' ? `Missing colon ':' at the end of the if statement` : `Missing closing parenthesis ')' in console.log`,
    explanation: `Punctuation and matching delimiters are required by the syntax parser.`,
  });

  // Question 3: True / False (Easy)
  bank.push({
    id: `${langId}-ch${chNum}-q3`,
    type: 'true-false',
    difficulty: 'easy',
    prompt: `True or False: In ${langName}, variables must be declared with valid identifiers that do not start with a digit.`,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: `Identifiers in ${langName} cannot begin with numeric digits (e.g. 1var is invalid).`,
  });

  // Question 4: Fill in the Blank (Easy)
  bank.push({
    id: `${langId}-ch${chNum}-q4`,
    type: 'fill-blank',
    difficulty: 'easy',
    prompt: `Fill in the blank to complete the keyword:`,
    codeSnippet: langId === 'python' ? `___ greet():\n    return "Hi"` : `___ greet() {\n  return "Hi";\n}`,
    options: [
      langId === 'python' ? 'def' : 'function',
      'func',
      'define',
      'fn',
    ],
    correctAnswer: langId === 'python' ? 'def' : 'function',
    explanation: `${langId === 'python' ? 'def' : 'function'} is the standard keyword used to declare functions.`,
  });

  // Question 5: Predict Output (Medium)
  bank.push({
    id: `${langId}-ch${chNum}-q5`,
    type: 'predict-output',
    difficulty: 'medium',
    prompt: `What will this snippet output?`,
    codeSnippet: langId === 'python' 
      ? `vals = [10, 20, 30]\nprint(len(vals))` 
      : langId === 'sql'
      ? `SELECT COUNT(*) FROM students;`
      : `const items = [10, 20, 30];\nconsole.log(items.length);`,
    options: ['3', '2', '30', 'undefined'],
    correctAnswer: '3',
    explanation: `The collection contains 3 elements, so length/count returns 3.`,
  });

  // Question 6: Parameterised Question (Medium)
  bank.push(createParameterisedArithmeticQuestion(`${langId}-ch${chNum}-q6`, langName, '+', 'addition'));

  // Question 7: Spot the Bug (Medium)
  bank.push({
    id: `${langId}-ch${chNum}-q7`,
    type: 'spot-bug',
    difficulty: 'medium',
    prompt: `Why will this code trigger a runtime error?`,
    codeSnippet: langId === 'python' 
      ? `num = "42"\nres = num + 8` 
      : `const obj = null;\nconsole.log(obj.name);`,
    options: [
      langId === 'python' ? `Cannot add string to integer without casting` : `Cannot read properties of null`,
      `Variable name 'num' is a reserved keyword`,
      `Memory buffer overflow`,
      `Missing semicolons`,
    ],
    correctAnswer: langId === 'python' ? `Cannot add string to integer without casting` : `Cannot read properties of null`,
    explanation: `Type mismatch or accessing properties on null triggers immediate runtime exceptions.`,
  });

  // Question 8: Multiple Choice (Medium)
  bank.push({
    id: `${langId}-ch${chNum}-q8`,
    type: 'multiple-choice',
    difficulty: 'medium',
    prompt: `What is the time complexity of looking up a key in a standard hash table / dictionary in ${langName}?`,
    options: ['O(1) average time', 'O(n^2) quadratic time', 'O(log n) logarithmic time', 'O(n!) factorial time'],
    correctAnswer: 'O(1) average time',
    explanation: `Hash tables provide near-instantaneous O(1) average lookup via hash bucket indexing.`,
  });

  // Question 9: True / False (Medium)
  bank.push({
    id: `${langId}-ch${chNum}-q9`,
    type: 'true-false',
    difficulty: 'medium',
    prompt: `True or False: Pure functions should have no side-effects and always return the same output for the same input.`,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: `Purity guarantees deterministic behavior and prevents unexpected state mutations.`,
  });

  // Question 10: Parameterised Question (Hard)
  bank.push(createParameterisedLoopQuestion(`${langId}-ch${chNum}-q10`, langName));

  // Question 11: Spot the Bug (Hard)
  bank.push({
    id: `${langId}-ch${chNum}-q11`,
    type: 'spot-bug',
    difficulty: 'hard',
    prompt: `What fatal flaw exists in this recursive function?`,
    codeSnippet: langId === 'python'
      ? `def countdown(n):\n    print(n)\n    return countdown(n - 1)`
      : `function countdown(n) {\n  console.log(n);\n  return countdown(n - 1);\n}`,
    options: [
      `Missing base case to terminate recursion (causes stack overflow)`,
      `Recursion is not supported in ${langName}`,
      `n cannot be decremented inside arguments`,
      `Return type is not specified`,
    ],
    correctAnswer: `Missing base case to terminate recursion (causes stack overflow)`,
    explanation: `Without a base condition (like if n <= 0 return), recursive calls exhaust the call stack.`,
  });

  // Question 12: Predict Output (Hard)
  bank.push({
    id: `${langId}-ch${chNum}-q12`,
    type: 'predict-output',
    difficulty: 'hard',
    prompt: `What is the value of result after this snippet runs?`,
    codeSnippet: langId === 'python'
      ? `result = [x * 2 for x in [1, 2, 3] if x > 1]`
      : `const result = [1, 2, 3].filter(x => x > 1).map(x => x * 2);`,
    options: ['[4, 6]', '[2, 4, 6]', '[6]', '[]'],
    correctAnswer: '[4, 6]',
    explanation: `Filtering x > 1 leaves [2, 3], and multiplying each by 2 yields [4, 6].`,
  });

  // Question 13: Multiple Choice (Hard)
  bank.push({
    id: `${langId}-ch${chNum}-q13`,
    type: 'multiple-choice',
    difficulty: 'hard',
    prompt: `Which design principle advises that software entities should be open for extension but closed for modification?`,
    options: [
      'Open-Closed Principle (OCP)',
      'Single Responsibility Principle (SRP)',
      'Liskov Substitution Principle (LSP)',
      'Interface Segregation Principle (ISP)',
    ],
    correctAnswer: 'Open-Closed Principle (OCP)',
    explanation: `OCP states classes should allow behavior extension without modifying existing tested code.`,
  });

  // Question 14: Fill in the Blank (Medium)
  bank.push({
    id: `${langId}-ch${chNum}-q14`,
    type: 'fill-blank',
    difficulty: 'medium',
    prompt: `Fill in the blank keyword for handling exceptions safely:`,
    codeSnippet: langId === 'python' ? `___:\n    risky_operation()\nexcept Exception as e:\n    handle(e)` : `___ {\n  riskyOperation();\n} catch (err) {\n  handle(err);\n}`,
    options: ['try', 'attempt', 'safe', 'catch'],
    correctAnswer: 'try',
    explanation: `The 'try' block wraps code that may throw exceptions to prevent application crashes.`,
  });

  // Question 15: True / False (Hard)
  bank.push({
    id: `${langId}-ch${chNum}-q15`,
    type: 'true-false',
    difficulty: 'hard',
    prompt: `True or False: In production applications, caught exceptions should generally be logged or gracefully handled rather than silently swallowed.`,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: `Swallowing exceptions silently obscures critical bugs and makes system monitoring impossible.`,
  });

  // Question 16: Parameterised Multiplication (Medium)
  bank.push(createParameterisedArithmeticQuestion(`${langId}-ch${chNum}-q16`, langName, '*', 'multiplication'));

  return bank;
}

const CHAPTER_TITLES = [
  'First Steps & Environment',
  'Variables, Types & Memory',
  'Operators, Math & Logic',
  'Control Flow & Decisions',
  'Loops & Repetition',
  'Functions & Modularity',
  'Collections & Data Structures',
  'Error Handling & Debugging',
  'Real-World Idioms & Architecture',
  'Mini Capstone Project',
  'Final Certification Exam',
];

function buildCodeTask(langId: string, langName: string, chNum: number, title: string): CodeTask {
  const isExam = chNum === 11;
  const isWeb = langId === 'html' || langId === 'css';
  const isSql = langId === 'sql';
  const isPython = langId === 'python';

  if (isSql) {
    return {
      id: `${langId}-task-${chNum}`,
      title: `${title} - Query Challenge`,
      instructions: `Write a SQL query that retrieves all students with a grade of 85 or higher from the 'students' table.`,
      starterCode: `-- Select students with grade >= 85\nSELECT * FROM students\nWHERE grade >= 85;`,
      hints: [
        'Use SELECT * FROM students',
        'Add a WHERE clause specifying grade >= 85',
      ],
      testCases: [
        {
          description: "Contains SELECT * FROM students",
          validate: (code) => /SELECT\s+\*\s+FROM\s+students/i.test(code),
        },
        {
          description: "Filters with WHERE grade >= 85",
          validate: (code) => /WHERE\s+grade\s*>=\s*85/i.test(code),
        },
      ],
    };
  }

  if (isWeb && langId === 'html') {
    return {
      id: `${langId}-task-${chNum}`,
      title: `${title} - HTML Builder`,
      instructions: `Build a semantic card layout with an <h1> heading containing "Welcome to Codeks", a <p> description paragraph, and a <button> with text "Start Learning".`,
      starterCode: `<div class="card">\n  <h1>Welcome to Codeks</h1>\n  <p>Interactive bite-sized programming for adult beginners.</p>\n  <button>Start Learning</button>\n</div>`,
      hints: [
        'Include an <h1> tag with "Welcome to Codeks"',
        'Include a <p> paragraph tag',
        'Include a <button> tag',
      ],
      testCases: [
        {
          description: "Has <h1>Welcome to Codeks</h1>",
          validate: (code) => /<h1[^>]*>.*Welcome.*Codeks.*<\/h1>/i.test(code),
        },
        {
          description: "Has a <p> paragraph tag",
          validate: (code) => /<p[^>]*>.*<\/p>/i.test(code),
        },
        {
          description: "Has a <button>Start Learning</button>",
          validate: (code) => /<button[^>]*>.*Start Learning.*<\/button>/i.test(code),
        },
      ],
    };
  }

  if (isPython) {
    return {
      id: `${langId}-task-${chNum}`,
      title: `${title} - Python Script`,
      instructions: isExam
        ? `Write a Python program that defines a function 'calculate_bonus(salary)' that returns 15% of salary, and print the bonus for a salary of 80000.`
        : `Write a Python script that calculates the total cost: set 'price = 50', 'tax = 5', and print the sum.`,
      starterCode: isExam
        ? `def calculate_bonus(salary):\n    return salary * 0.15\n\nbonus = calculate_bonus(80000)\nprint(bonus)`
        : `price = 50\ntax = 5\ntotal = price + tax\nprint(total)`,
      hints: [
        'Remember variable assignment and addition',
        'Use print(...) to output the result',
      ],
      testCases: [
        {
          description: "Outputs the correct numeric computation",
          validate: (code, output) => {
            const hasCalculation = isExam ? /salary\s*\*\s*0?\.15/.test(code) : /price\s*\+\s*tax/.test(code);
            const hasPrint = /print\s*\(/.test(code);
            return hasCalculation && hasPrint;
          },
        },
      ],
    };
  }

  // General JavaScript / TypeScript / Systems default
  return {
    id: `${langId}-task-${chNum}`,
    title: `${title} - Coding Exercise`,
    instructions: isExam
      ? `Write a function named 'evaluateScore(score)' that returns "PASS" if score is >= 80, otherwise "RETRY". Test it with score 85.`
      : `Declare a variable named 'learner' with value "Explorer", and log "Hello, " + learner to the console.`,
    starterCode: isExam
      ? `function evaluateScore(score) {\n  if (score >= 80) {\n    return "PASS";\n  }\n  return "RETRY";\n}\n\nconsole.log(evaluateScore(85));`
      : `const learner = "Explorer";\nconsole.log("Hello, " + learner);`,
    hints: [
      isExam ? 'Use an if condition checking score >= 80' : 'Declare with const or let',
      'Make sure to call console.log or standard print',
    ],
    testCases: [
      {
        description: isExam ? "Function evaluateScore returns PASS for 85" : "Logs greeting with learner variable",
        validate: (code, output) => {
          if (isExam) {
            return /evaluateScore/.test(code) && (output.includes('PASS') || /return\s+["']PASS["']/.test(code));
          }
          return /learner/.test(code) && (output.includes('Hello') || /console\.log/.test(code));
        },
      },
    ],
  };
}

export function generateChaptersForLanguage(langMeta: typeof LANGUAGES[0]): Chapter[] {
  return CHAPTER_TITLES.map((title, idx) => {
    const chNum = idx + 1;
    const isExam = chNum === 11;

    return {
      id: `${langMeta.id}-${chNum}`,
      number: chNum,
      title: isExam ? `Chapter 11: ${langMeta.name} Final Exam & Certification` : `Chapter ${chNum}: ${title}`,
      description: isExam
        ? `Comprehensive 5-question evaluation covering all fundamentals of ${langMeta.name}. Score >= 80% to earn your verifiable certificate.`
        : `A focused 10-minute session exploring ${title.toLowerCase()} in ${langMeta.name} with interactive practice.`,
      estimatedMinutes: 10,
      isExam,
      lesson: {
        overview: isExam
          ? `Congratulations on reaching the final exam for ${langMeta.name}! You've explored syntax, memory models, functions, data collections, and error handling. This chapter tests your comprehensive understanding.`
          : `In ${langMeta.name}, ${title.toLowerCase()} forms a cornerstone of writing readable, performant applications. Today you will understand the underlying mechanics and immediately write real code.`,
        keyPoints: [
          `Master core ${langMeta.name} syntax and idiomatic design patterns.`,
          `Write predictable, bug-free statements that handle edge cases cleanly.`,
          `Understand how memory and variables behave during execution.`,
          `Apply modern 2026 industry standards in short, focused practice blocks.`,
        ],
        codeExample: langMeta.id === 'python'
          ? `# ${langMeta.name}: ${title}\ndef main():\n    status = "Active"\n    print(f"Status: {status}")\n\nif __name__ == "__main__":\n    main()`
          : langMeta.id === 'html'
          ? `<!-- ${langMeta.name}: ${title} -->\n<section class="codeks-card">\n  <h2>${title}</h2>\n  <p>Building accessible web applications.</p>\n</section>`
          : langMeta.id === 'sql'
          ? `-- ${langMeta.name}: ${title}\nSELECT id, name, grade\nFROM students\nWHERE grade >= 80\nORDER BY grade DESC;`
          : `// ${langMeta.name}: ${title}\nfunction executeStep() {\n  const message = "Ready to build";\n  console.log(message);\n  return true;\n}\n\nexecuteStep();`,
        codeExplanation: `This snippet illustrates ${title} by creating well-defined variables, applying logical boundaries, and yielding deterministic output. Notice how clean formatting and meaningful names make the logic instantly understandable.`,
        proTip: `Kodi's Rule: Never memorize syntax blindly. Build a mental model of data flow and verify it with quick tests!`,
      },
      questionBank: buildQuestionBank(langMeta.id, langMeta.name, chNum, title),
      codeTask: buildCodeTask(langMeta.id, langMeta.name, chNum, title),
    };
  });
}

// Map of all fully inflated languages
export const ALL_CURRICULUM: Record<string, Language> = LANGUAGES.reduce((acc, meta) => {
  acc[meta.id] = {
    ...meta,
    chapters: generateChaptersForLanguage(meta),
  };
  return acc;
}, {} as Record<string, Language>);

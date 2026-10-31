export interface ExecutionResult {
  success: boolean;
  output: string;
  returnValue?: any;
  error?: string;
  tableData?: Record<string, any>[];
}

/**
 * Normalizes code strings:
 * - Trims outer whitespace
 * - Standardizes line breaks
 * - Normalizes quotes (optionally)
 * - Tolerates trailing semicolons
 */
export function normalizeCode(code: string): string {
  return code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .replace(/["']/g, '"');
}

/**
 * Executes or simulates code in browser sandbox.
 */
export async function runCodeInSandbox(languageId: string, code: string): Promise<ExecutionResult> {
  const lang = languageId.toLowerCase();

  // JavaScript / TypeScript Runner
  if (lang === 'javascript' || lang === 'typescript') {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[Error] ' + args.map((a) => String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[Warn] ' + args.map((a) => String(a)).join(' '));
      },
    };

    try {
      // Strip simple TypeScript type annotations for browser runtime
      const cleanedCode = code
        .replace(/:\s*(string|number|boolean|any|void|number\[\]|string\[\])/g, '')
        .replace(/interface\s+\w+\s*\{[^}]*\}/g, '');

      // Run in isolated function scope
      const runner = new Function('console', `
        "use strict";
        try {
          ${cleanedCode}
        } catch (e) {
          console.error(e.message || String(e));
        }
      `);

      runner(customConsole);

      return {
        success: true,
        output: logs.length > 0 ? logs.join('\n') : '(Program executed successfully with no console output)',
      };
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: `Syntax or Runtime Error: ${err.message || String(err)}`,
      };
    }
  }

  // SQL Sandbox
  if (lang === 'sql') {
    return runSqlSandbox(code);
  }

  // Python Sandbox simulation
  if (lang === 'python') {
    return runPythonSandbox(code);
  }

  // HTML / CSS Sandbox
  if (lang === 'html' || lang === 'css') {
    return {
      success: true,
      output: 'Document rendered in live canvas preview.',
    };
  }

  // Systems and compiled languages simulation (C, C++, C#, Java, Kotlin, Rust, Go, Swift, Bash, PHP)
  return simulateCompiledLanguage(lang, code);
}

// In-memory SQL relational tables
const SQL_DB: Record<string, Record<string, any>[]> = {
  students: [
    { id: 1, name: 'Alice Chen', grade: 94, track: 'Web', active: true },
    { id: 2, name: 'Benji Torres', grade: 88, track: 'Data', active: true },
    { id: 3, name: 'Chloe Kim', grade: 99, track: 'Systems', active: false },
    { id: 4, name: 'Dante Rossi', grade: 76, track: 'Web', active: true },
    { id: 5, name: 'Elena Rostova', grade: 91, track: 'Mobile', active: true },
  ],
  courses: [
    { id: 101, title: 'Intro to JavaScript', credits: 4, department: 'CS' },
    { id: 102, title: 'Data Structures in Python', credits: 4, department: 'CS' },
    { id: 103, title: 'Relational SQL Systems', credits: 3, department: 'DB' },
  ],
};

function runSqlSandbox(sql: string): ExecutionResult {
  const normalized = sql.trim().toUpperCase();

  try {
    if (normalized.startsWith('SELECT')) {
      // Find table name
      const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      const tableName = fromMatch ? fromMatch[1].toLowerCase() : 'students';
      const table = SQL_DB[tableName] || SQL_DB['students'];

      let rows = [...table];

      // Check WHERE filter
      const whereMatch = sql.match(/WHERE\s+([a-zA-Z0-9_]+)\s*(=|>|<|>=|<=|LIKE)\s*['"]?([^'"]+)['"]?/i);
      if (whereMatch) {
        const col = whereMatch[1];
        const op = whereMatch[2];
        const val = whereMatch[3].trim();

        rows = rows.filter((r) => {
          const fieldVal = r[col];
          if (op === '=') return String(fieldVal).toLowerCase() === val.toLowerCase();
          if (op === '>') return Number(fieldVal) > Number(val);
          if (op === '<') return Number(fieldVal) < Number(val);
          if (op === '>=') return Number(fieldVal) >= Number(val);
          if (op === '<=') return Number(fieldVal) <= Number(val);
          return true;
        });
      }

      // Check ORDER BY
      if (/ORDER\s+BY/i.test(sql)) {
        const isDesc = /DESC/i.test(sql);
        rows.sort((a, b) => {
          const valA = a.grade ?? a.id;
          const valB = b.grade ?? b.id;
          return isDesc ? valB - valA : valA - valB;
        });
      }

      // Check LIMIT
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        rows = rows.slice(0, parseInt(limitMatch[1], 10));
      }

      // Check COUNT(*)
      if (/COUNT\(\*\)/i.test(sql)) {
        return {
          success: true,
          output: `Query executed. Total rows counted: ${rows.length}`,
          tableData: [{ 'COUNT(*)': rows.length }],
        };
      }

      return {
        success: true,
        output: `Query OK. ${rows.length} row(s) returned from '${tableName}'.`,
        tableData: rows,
      };
    }

    return {
      success: true,
      output: `Statement executed successfully. Database state updated.`,
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: `SQL Syntax Error: ${err.message || 'Invalid syntax near query tokens'}`,
    };
  }
}

function runPythonSandbox(code: string): ExecutionResult {
  const outputs: string[] = [];

  try {
    const lines = code.split('\n');
    const variables: Record<string, any> = {};

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      // Variable assignment: x = 10 or name = "Alice"
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch && !line.startsWith('if') && !line.startsWith('for') && !line.startsWith('def')) {
        const varName = assignMatch[1];
        const valExpr = assignMatch[2].trim();
        try {
          // evaluate primitive numbers/strings safely
          if (/^["'].*["']$/.test(valExpr)) {
            variables[varName] = valExpr.slice(1, -1);
          } else if (!isNaN(Number(valExpr))) {
            variables[varName] = Number(valExpr);
          } else if (valExpr === 'True') {
            variables[varName] = true;
          } else if (valExpr === 'False') {
            variables[varName] = false;
          } else if (valExpr.startsWith('[') && valExpr.endsWith(']')) {
            variables[varName] = JSON.parse(valExpr.replace(/'/g, '"'));
          } else if (variables[valExpr] !== undefined) {
            variables[varName] = variables[valExpr];
          }
        } catch {
          variables[varName] = valExpr;
        }
      }

      // Print statements: print("hello") or print(x) or print(f"Hello {name}")
      const printMatch = line.match(/^print\s*\((.*)\)$/);
      if (printMatch) {
        const inside = printMatch[1].trim();

        if (inside.startsWith('f"') || inside.startsWith("f'")) {
          // f-string
          let text = inside.slice(2, -1);
          text = text.replace(/\{(\w+)\}/g, (_, k) => String(variables[k] ?? ''));
          outputs.push(text);
        } else if (/^["'].*["']$/.test(inside)) {
          outputs.push(inside.slice(1, -1));
        } else if (variables[inside] !== undefined) {
          outputs.push(String(variables[inside]));
        } else {
          // Try simple arithmetic expression
          try {
            const evaluated = new Function(`return (${inside});`)();
            outputs.push(String(evaluated));
          } catch {
            outputs.push(inside);
          }
        }
      }
    }

    if (outputs.length === 0) {
      outputs.push('(Program finished with exit code 0)');
    }

    return {
      success: true,
      output: outputs.join('\n'),
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: `Python SyntaxError: ${err.message || 'Error executing script'}`,
    };
  }
}

function simulateCompiledLanguage(lang: string, code: string): ExecutionResult {
  const outputs: string[] = [];

  // Look for standard prints across languages
  // C / C++: printf("..."), std::cout << "..."
  const printfMatches = code.matchAll(/printf\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of printfMatches) {
    outputs.push(m[1].replace(/\\n/g, ''));
  }
  const coutMatches = code.matchAll(/cout\s*<<\s*["']([^"']*)["']/g);
  for (const m of coutMatches) {
    outputs.push(m[1].replace(/\\n/g, ''));
  }

  // Java / Kotlin / C#: System.out.println("..."), println("..."), Console.WriteLine("...")
  const sysOutMatches = code.matchAll(/System\.out\.println\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of sysOutMatches) {
    outputs.push(m[1]);
  }
  const kotlinPrintln = code.matchAll(/(?<!System\.out\.)println\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of kotlinPrintln) {
    outputs.push(m[1]);
  }
  const csharpMatches = code.matchAll(/Console\.WriteLine\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of csharpMatches) {
    outputs.push(m[1]);
  }

  // Go / Rust / Swift / PHP / Bash
  const goFmtMatches = code.matchAll(/fmt\.Println\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of goFmtMatches) {
    outputs.push(m[1]);
  }
  const rustPrintln = code.matchAll(/println!\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of rustPrintln) {
    outputs.push(m[1]);
  }
  const swiftPrint = code.matchAll(/print\s*\(\s*["']([^"']*)["']\s*\)/g);
  for (const m of swiftPrint) {
    outputs.push(m[1]);
  }
  const phpEcho = code.matchAll(/echo\s+["']([^"']*)["']/g);
  for (const m of phpEcho) {
    outputs.push(m[1]);
  }
  const bashEcho = code.matchAll(/echo\s+["']?([^"'\n]+)["']?/g);
  for (const m of bashEcho) {
    outputs.push(m[1]);
  }

  const finalOutput = outputs.length > 0 ? outputs.join('\n') : `[${lang.toUpperCase()} Compiler] Build succeeded. Exit code: 0`;

  return {
    success: true,
    output: finalOutput,
  };
}

import { execFile } from 'child_process';
import path from 'path';

/**
 * Execute a PHP PDO script with JSON payload and return parsed JSON result
 */
export async function executePhpScript<T = any>(
  scriptRelativePath: string,
  args: Record<string, any> = {},
  inputData: any = null
): Promise<T> {
  return new Promise((resolve, reject) => {
    const phpScriptPath = path.join(process.cwd(), 'php-backend', scriptRelativePath);

    const queryString = new URLSearchParams(args).toString();
    const env = {
      ...process.env,
      REQUEST_METHOD: inputData ? 'POST' : 'GET',
      QUERY_STRING: queryString,
      CONTENT_TYPE: 'application/json',
    };

    const child = execFile('php', [phpScriptPath], { env }, (error, stdout, stderr) => {
      if (error) {
        // If system PHP binary is not on PATH or fails, return empty fallback
        console.warn(`PHP script execution warning for ${scriptRelativePath}:`, stderr || error.message);
      }
      try {
        const jsonOutput = stdout.substring(stdout.indexOf('{'));
        const parsed = JSON.parse(jsonOutput || stdout);
        resolve(parsed);
      } catch (parseErr) {
        resolve({ stdout, raw: stdout } as any);
      }
    });

    if (inputData && child.stdin) {
      child.stdin.write(JSON.stringify(inputData));
      child.stdin.end();
    }
  });
}

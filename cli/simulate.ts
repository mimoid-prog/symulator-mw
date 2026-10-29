import { simulateBuild, SimulationInputError } from '@/lib/simulate-build';

export async function runCli() {
 try {
  let document = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) document += chunk;
  let input: unknown;
  try {
   input = JSON.parse(document);
  } catch {
   throw new SimulationInputError('invalid_json', 'stdin musi zawierać dokładnie jeden poprawny dokument JSON.');
  }
  process.stdout.write(JSON.stringify(simulateBuild(input)) + '\n');
 } catch (error) {
  const controlled = error instanceof SimulationInputError;
  process.stdout.write(JSON.stringify({
   ok: false,
   error: {
    code: controlled ? error.code : 'internal_error',
    message: controlled ? error.message : 'Nie udało się uruchomić symulacji.',
    ...(controlled && error.path ? { path: error.path } : {}),
   },
  }) + '\n');
  if (!controlled) console.error(error);
  process.exitCode = controlled ? 2 : 1;
 }
}

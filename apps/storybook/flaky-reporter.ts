/**
 * Lists the stories that passed only on a retry (WebKit and Firefox retry once in CI): in the log and, on GitHub, in the
 * job summary and as a warning. Flaky means: the test or the component has a timing problem – fix it, do not ignore it.
 */
import { appendFileSync } from 'node:fs';
import type { Reporter, TestCase } from 'vitest/node';

export class FlakyReporter implements Reporter {
  private flaky: string[] = [];

  onTestCaseResult(test: TestCase) {
    if (!test.diagnostic()?.flaky) return;
    // The error of the failed attempt says what was slow – the clue to fix it.
    const error =
      test
        .result()
        .errors?.[0]?.message?.split('\n')
        .find((line) => line.trim()) ?? 'no error message';
    this.flaky.push(`${test.project.name} › ${test.module.moduleId.split('/src/').pop()} › ${test.fullName} – first attempt: ${error.slice(0, 200)}`);
  }

  onTestRunEnd() {
    if (!this.flaky.length) return;
    const list = this.flaky.map((name) => `- ${name}`).join('\n');
    console.warn(`\nFlaky – passed only on the retry:\n${list}\n`);
    for (const name of this.flaky) console.log(`::warning title=Flaky story (passed only on the retry)::${name}`);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Flaky stories\n\nPassed only on the retry – fix the timing:\n\n${list}\n`);
  }
}

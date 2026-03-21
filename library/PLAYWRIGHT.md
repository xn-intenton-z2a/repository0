PLAYWRIGHT

Source: https://playwright.dev/docs/intro

Normalised extract (direct technical content):
- Installation and setup
  - Install test runner: npm install --save-dev @playwright/test
  - Download browsers: npx playwright install
  - Run tests: npx playwright test [--config=playwright.config.ts] [--project=<name>]
- Test runner and fixtures
  - Import: import { test, expect } from '@playwright/test'
  - test signature: test(name: string, fn: (fixtures: { page: Page, context: BrowserContext, browser: Browser, request?: APIRequestContext, testInfo?: TestInfo }) => Promise<void>): void
  - Lifecycle hooks: test.beforeAll(fn), test.afterAll(fn), test.beforeEach(fn), test.afterEach(fn), test.describe(name, fn)
- Core Page and Locator APIs (signatures and returns)
  - page.goto(url: string, options?: { timeout?: number, waitUntil?: 'load'|'domcontentloaded'|'networkidle' }): Promise<Response | null>
  - page.locator(selector: string, options?: { has?: Locator | string }): Locator
  - Locator.click(options?: { button?: 'left'|'right'|'middle', timeout?: number, force?: boolean, modifiers?: string[], position?: { x:number, y:number } }): Promise<void>
  - Locator.fill(value: string, options?: { timeout?: number }): Promise<void>
  - Locator.textContent(): Promise<string | null>
  - Locator.count(): Promise<number>
  - page.waitForLoadState(state?: 'load'|'domcontentloaded'|'networkidle', options?: { timeout?: number }): Promise<void>
- Browser and context (programmatic API)
  - browserType.launch(options?: { headless?: boolean, args?: string[], timeout?: number, slowMo?: number }): Promise<Browser>
  - browser.newContext(options?: { viewport?: { width:number, height:number }, baseURL?: string, extraHTTPHeaders?: Record<string,string>, storageState?: string|object }): Promise<BrowserContext>
  - context.newPage(): Promise<Page>
- Expect matchers (signature forms)
  - expect(value: Locator | string | unknown): Expect
  - Expect.toHaveText(expected: string | RegExp | Array<string|RegExp>, options?: { timeout?: number }): Promise<void>
  - Expect.toHaveCount(expected: number, options?: { timeout?: number }): Promise<void>
  - Expect.toBeVisible(options?: { timeout?: number }): Promise<void>
  - Expect.toHaveURL(expected: string | RegExp, options?: { timeout?: number }): Promise<void>
- Configuration object (playwright.config.ts / js) - keys and effects
  - defineConfig({
      timeout?: number,           // per-test timeout in ms
      retries?: number,           // retry count on CI
      use?: {                     // shared fixture defaults
        baseURL?: string,
        headless?: boolean,
        viewport?: { width:number, height:number },
        actionTimeout?: number,
        trace?: 'on'|'off'|'retain-on-failure'|'on-first-retry',
        video?: 'on'|'off'|'retain-on-failure'
      },
      projects?: Array<{ name: string, use?: object }>,
      reporter?: string | Array<string>
    })
- Best practices and implementation patterns
  - Prefer test runner fixtures: use injected "page" fixture instead of manual browser launch in tests.
  - Use page.locator(selector) over page.$ to get reliable auto-waiting locators.
  - Use expect(locator).toHaveCount(n) to assert list lengths rather than manual evaluation.
  - Use trace: 'on-first-retry' and retries > 0 for flaky tests; enable video for debugging failures.
  - Start local server in test.beforeAll or use baseURL in config and run a separate test server process.
- Troubleshooting steps (step-by-step)
  - If locator not found: verify selector with page.locator("selector").highlight() or open Inspector with PWDEBUG=1.
  - If tests time out: increase timeout in test or in playwright.config.ts (use.actionTimeout and test timeout), await page.waitForLoadState('networkidle') after navigation.
  - To capture failure details: enable trace: 'on-first-retry' and open trace viewer: npx playwright show-trace <trace.zip>
  - For environment differences on CI: set use.storageState to persist auth or use baseURL and launch browsers with consistent args.

Supplementary details (implementation specifics):
- Typical minimal test file content (plain text representation):
  import { test, expect } from '@playwright/test'
  test('example', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const items = await page.locator('ul li')
    await expect(items).toHaveCount(15)
    await expect(page.locator('ul li', { hasText: 'FizzBuzz' })).toBeVisible()
  })
- CLI useful commands and flags:
  - npx playwright test --project=chromium --reporter=list
  - npx playwright show-trace trace.zip
  - PWDEBUG=1 npx playwright test (opens inspector for debugging)

Reference details (API signatures, config options, return types):
- Imports:
  - import { test, expect } from '@playwright/test' (ESM)
- test(name: string, fn: Function): void
- expect(value: any): Expect (matchers return Promise<void>)
- page.goto(url: string, options?: { timeout?: number, waitUntil?: 'load'|'domcontentloaded'|'networkidle' }): Promise<Response | null>
- page.locator(selector: string, options?: { has?: Locator | string }): Locator
- Locator.click(options?): Promise<void>
- Locator.fill(value: string, options?): Promise<void>
- Locator.textContent(): Promise<string | null>
- Locator.count(): Promise<number>
- browserType.launch(options?): Promise<Browser>
- context.newPage(): Promise<Page>
- playwright.config defineConfig keys: timeout:number, retries:number, use:object, projects:Array, reporter:string

Detailed digest (extracted content and metadata):
- Retrieved from: https://playwright.dev/docs/intro
- Retrieval date: 2026-03-21
- Data obtained during crawl: approximately 50.8 KB of HTML (saved to temporary fetch output)
- Extract summary used: installation commands, runner usage, page/locator API surfaces, main expect matchers, common configuration keys and recommended debugging/troubleshooting steps.

Attribution
- Source: Playwright docs (Microsoft) — https://playwright.dev/docs/intro
- Data retrieved on 2026-03-21; content size noted above.

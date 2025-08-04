'use strict'
/**
 * To learn more about Playwright Test visit:
 * https://www.checklyhq.com/docs/browser-checks/playwright-test/
 */
import { expect, test } from '@playwright/test'

function getTargetUrl() {
  // If available, we set the target URL to a preview deployment URL provided by the VERCEL_URL created by Vercel.
  // Otherwise, we use the Production URL.
  // https://vercel.com/docs/environment-variables/system-environment-variables
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  return vercelUrl || process.env.APP_URL || 'http://localhost:3000'
}

// TODO: This is an example healthcheck test that also works with Checkly, please adjust as needed
test('visit page and take screenshot', async ({ page }) => {
  const targetUrl = getTargetUrl()
  // We visit the page. This waits for the "load" event by default.
  const response = await page.goto(targetUrl)
  // If you are using Vercel's Deployment Protection, please check our docs on how to make this work with Checkly
  // https://www.checklyhq.com/docs/cicd/vercel-deployment-protection/
  //
  // Here's an example of some code you might need to add to your test to handle the auth dialog when using GitHub auth.
  //
  // if (!!process.env.VERCEL_URL) {
  //   // Auth dialog is a pop up
  //   const popupPromise = page.waitForEvent('popup');
  //   await page.getByText('Continue with GitHub').click()
  //   const popup = await popupPromise;
  //   await popup.waitForLoadState();
  //   await popup.locator('input[name="login"]').type(process.env.GITHUB_USER)
  //   await popup.locator('input[name="password"]').type(process.env.GITHUB_PASSWORD)
  //   await popup.getByText('Sign in', {exact: true}).click()
  // }
  // Test that the response did not fail
  expect(response?.status(), 'should respond with correct status code').toBeLessThan(400)

  // Test for the app-container element
  const appContainer = page.locator('.app-container')
  await expect(appContainer, 'should have app-container element').toBeVisible()

  // Test for "Username" text on the page
  await expect(page.getByText('PizzaJS Enterprise Template'), 'should contain main hero text').toBeVisible()

  // Take a screenshot
  await page.screenshot({ path: 'tests-e2e/healthcheck.test.screenshot.jpg' })
})
//# sourceMappingURL=check-template.js.map

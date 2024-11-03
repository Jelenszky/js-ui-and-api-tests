const { test, expect } = require('@playwright/test');
const LandingPage = require('../po/LandingPage');
const LoginPage = require('../po/LoginPage');
const HomePage = require('../po/HomePage');
const NewPage = require('../po/NewPage');



test('Check if landing page can be loaded', async ({ page }) => {
    // Instantiate the LandingPage with the current 'page' context
    const landingPage = new LandingPage(page);

    // Use methods from LandingPage class
    await landingPage.goto();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('GitHub · Build and ship software on a single, collaborative platform · GitHub');

    // You can also use other elements defined in your page object
    // For example, check if the GitHub logo is visible
    await expect(landingPage.logo).toBeVisible();
    await expect(landingPage.searchButton).toBeVisible();
    await expect(landingPage.signIn).toBeVisible();
});


test('Check if test user can log in', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
   
    // Use methods from LandingPage class
    await landingPage.goto();
   
    // Click on the 'Sign in' button
    await expect(landingPage.signIn).toBeVisible();
    // Expect login page header to be visible
    await landingPage.clickSignInButton();

    // Log in with test user credentials
    await expect(loginPage.headerText).toBeVisible();
    await loginPage.loginWithTestUserCredentials();
    // Expect home page header to be visible after log in
    await expect(homePage.headerText).toBeVisible();
    // Check visibility of 'Create Menu' button and 'Search Field' on home page
    await expect(homePage.createMenuButton).toBeVisible();
    await expect(homePage.searchField).toBeVisible();
   });

test('Search for repositories where owner is jelenszky', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
   
    // Use methods from LandingPage class
    await landingPage.goto();
   
    // Expect 'Sign in' button to be visible
    await expect(landingPage.signIn).toBeVisible();
    await landingPage.clickSignInButton();

    await expect(loginPage.headerText).toBeVisible();
    await loginPage.loginWithTestUserCredentials();

    await expect(homePage.searchField).toBeVisible();
    await homePage.searchForRepositories('owner:jelenszky');

    const elementText = await page.locator('a#repositories-tab > span.Counter').textContent() || '0';
    await expect(parseInt(elementText)).toBeGreaterThan(0);
   });


   test('Check if test user can create a repository on UI', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const newPage = new NewPage(page);

    // Use methods from LandingPage class
    await landingPage.goto();
   
    // Expect 'Sign in' button to be visible
    await expect(landingPage.signIn).toBeVisible();
    await landingPage.clickSignInButton();

    await expect(loginPage.headerText).toBeVisible();
    await loginPage.loginWithTestUserCredentials();

    await expect(homePage.headerText).toBeVisible();
    await expect(homePage.createMenuButton).toBeVisible();

    await homePage.clickCreateNewRepositoryButton();
    await expect(newPage.headerText).toBeVisible();

    await newPage.inputNewRepositoryName("Test-Repo");
    await expect(newPage.repoNameIsAvalaible).toBeVisible();
    await newPage.clickCreateRepositoryButton();

    await page.waitForURL('https://github.com/TestUser2024Debrecen/Test-Repo');

    await landingPage.goto();
    await homePage.searchForRepositories('owner:TestUser2024Debrecen');
    await page.waitForURL('https://github.com/TestUser2024Debrecen');
    await page.locator('a#repositories-tab > span:has-text("Repositories")').click();
    await expect(await page.locator('a[href*="\\/TestUser2024Debrecen\\/Test-Repo"]')).toBeVisible();
   });
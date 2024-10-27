const {Before, Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LandingPage = require('../../../po/LandingPage');
const LoginPage = require('../../../po/LoginPage');
const HomePage = require('../../../po/HomePage');
const NewPage = require('../../../po/NewPage');
const { chromium } = require('playwright');

let browser;
let page;
let landingPage;
let loginPage;
let homePage;
let newPage;

Before(async function () {
  browser = await chromium.launch();
  const context = await browser.newContext();
  this.page = await context.newPage();
  page = this.page;
});

Given('I am on the landing page', async function () {
  page = this.page;
  landingPage = new LandingPage(page);
  await landingPage.goto();
});

Then('I should see the title {string}', async function (title) {
  await expect(page).toHaveTitle(title);
});

Then('I should see the GitHub logo', async function () {
  await expect(landingPage.logo).toBeVisible();
});

Then('I should see the search button', async function () {
  await expect(landingPage.searchButton).toBeVisible();
});

Then('I should see the sign in button', async function () {
  await expect(landingPage.signIn).toBeVisible();
});

When('I click on the sign in button', async function () {
  await expect(landingPage.signIn).toBeVisible();
  await landingPage.clickSignInButton();
});

Then('I should see the login page', async function () {
  loginPage = new LoginPage(page);
  await expect(loginPage.headerText).toBeVisible();
});

When('I login with test user credentials', async function () {
  await loginPage.loginWithTestUserCredentials();
});

Then('I should see the home page', async function () {
  homePage = new HomePage(page);
  await expect(homePage.headerText).toBeVisible();
});

Then('I should see the create menu button', async function () {
  await expect(homePage.createMenuButton).toBeVisible();
});

Then('I should see the search field', async function () {
  await expect(homePage.searchField).toBeVisible();
});

When('I search for repositories where owner is {string}', async function (owner) {
  this.owner = owner;  
  await homePage.searchForRepositories(`owner:${owner}`);
});

Then('I should see more than 0 repositories', async function () {
  const elementText = await page.locator('a#repositories-tab > span.Counter').textContent() || '0';
  await expect(parseInt(elementText)).toBeGreaterThan(0);
});

When('I click on the create new repository button', async function () {
  await homePage.clickCreateNewRepositoryButton();
});

Then('I should see the new repository page', async function () {
  newPage = new NewPage(page);
  await expect(newPage.headerText).toBeVisible();
});

When('I input new repository name {string}', async function (repoName) {
  await newPage.inputNewRepositoryName(repoName);
  await expect(newPage.repoNameIsAvalaible).toBeVisible();
});

When('I click on the create repository button', async function () {
  await newPage.clickCreateRepositoryButton();
});

Then('I should be redirected to the new repository page', async function () {
  await page.waitForURL('https://github.com/TestUser2024Debrecen/Test-Repo');
});

When('I go back to the landing page', async function () {
  await landingPage.goto();
});

When('I wait for the owner\'s page to load', async function () {
  await page.waitForURL(`https://github.com/${this.owner}`);
});

When('I click on the "Repositories" tab', async function () {
  await page.locator('a#repositories-tab > span:has-text("Repositories")').click();
});

Then('I should see the repository {string}', async function (repoName) {
    await expect(await page.locator(`a[href*="\\/TestUser2024Debrecen\\/${repoName}"]`)).toBeVisible();
  });
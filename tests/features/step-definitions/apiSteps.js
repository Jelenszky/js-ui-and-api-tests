const { Given, When, Then } = require("@cucumber/cucumber");
const {expect } = require('@playwright/test');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const userSchema = require('../../user_details_schema.js');
require('dotenv').config( { path: '../.env' } );
const TOKEN = process.env.TOKEN;

let response;
let responseBody;
let octokit;

Given('I am using GitHub API', function () {
  // No initialization required for using the GitHub API other than knowing the endpoint in this test case
});

When('I fetch users with username containing {string}', async function (username) {
  fetch = (await import('node-fetch')).default;
  response = await fetch(`https://api.github.com/search/users?q=${username}`);
  responseBody = await response.json();
});

Then('I should receive a successful response', function () {
  expect(response.ok).toBeTruthy();
  expect(response.status).toBe(200);
});

Then('the response should have users with {string} in username', function (username) {
  expect(responseBody.total_count).toBeGreaterThan(0);
  const containsExpectedValue = responseBody.items.every(user => {
    return user.login.toLowerCase().includes(username.toLowerCase())
  });

  expect(containsExpectedValue).toBeTruthy();  
});

Given('I have set up the API request for specific user details', async function () {
  fetch = (await import('node-fetch')).default;
});

When('I send the request to fetch information for user {string}', async function (username) {
  response = await fetch(`https://api.github.com/users/${username}`);
  responseBody = await response.json();
});

Then('the response should be successful and the status code should be 200', function () {
  expect(response.ok).toBeTruthy();
  expect(response.status).toBe(200);
});

Then('the response should contain the correct user login {string}', function (expectedLogin) {
  expect(responseBody.login.toLowerCase()).toEqual(expectedLogin);
});

Then('the user details should match the expected schema', function () {
  const ajv = new Ajv();
  addFormats(ajv, ['uri', 'uri-template', 'email', 'date-time']);
  const validate = ajv.compile(userSchema);
  const isValid = validate(responseBody);
  if (!isValid) {
    console.error(validate.errors);
  }
  expect(isValid).toBeTruthy();
});

Given('I have configured the GitHub API for repository information', async function () {
  fetch = (await import('node-fetch')).default;
});

When('I request details for the repository {string}', async function (repository) {
  response = await fetch(`https://api.github.com/repos/${repository}`);
  responseBody = await response.json();
});

Then('I should receive a valid response with status code 200', function () {
  expect(response.ok).toBeTruthy();
  expect(response.status).toBe(200);
});

Then('the response should contain correct repository details', function () {
  expect(responseBody.name).toBe('reinforcement_learning');
  expect(responseBody.owner.login).toBe('Jelenszky');
  expect(responseBody.default_branch).toBe('master');
});

Given('I have set up the GitHub API for repository search', async function () {
  fetch = (await import('node-fetch')).default;
});

When('I search repositories with the topic {string}', async function (topic) {
  response = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}`);
  responseBody = await response.json();
});

Then('I should receive a successful response with status code 200', function () {
  expect(response.ok).toBeTruthy();
  expect(response.status).toBe(200);
});

Then('the search result should contain at least one repository', function () {
  expect(responseBody.total_count).toBeGreaterThan(0);
});

Given('I am authenticated as a GitHub user', async function () {
  const octokitModule = await import('octokit');
  const Octokit = octokitModule.Octokit;
  octokit = new Octokit({
      // Note: Token should ideally be stored securely and accessed through environment variables or a secure vault
      auth: TOKEN
  });
});

When('I create a repository with specified details', async function () {
  response = await octokit.request('POST /user/repos', {
      name: 'Test-Repo',
      description: 'This is your first repo!',
      homepage: 'https://github.com',
      'private': false,
      is_template: true,
      headers: {
          'X-GitHub-Api-Version': '2022-11-28'
      }
  });
});

Then('I should receive a response with status code 201', function () {
  console.log(response);
  expect(response.status).toBe(201);
});

Then('the response should confirm the repository details', function () {
  expect(response.data.name).toEqual('Test-Repo');
});

When('I delete the repository {string} owned by {string}', async function (repo, owner) {
  response = await octokit.request('DELETE /repos/{owner}/{repo}', {
      owner: owner,
      repo: repo,
      headers: {
          'X-GitHub-Api-Version': '2022-11-28'
      }
  });
});

Then('I should receive a response with status code 204', function () {
  console.log(response);
  expect(response.status).toBe(204);
});
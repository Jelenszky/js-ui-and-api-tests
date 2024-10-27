const { test, expect } = require('@playwright/test');
require('dotenv').config();
const TOKEN = process.env.TOKEN;
  
test.describe('Api test example suite', () => {

  test('Get users with a given substring in their username', async ({request }) => {
    const apiResponse = await request.get(`
    https://api.github.com/search/users?q=jelenszky`);
    
    // Check status code
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponse.status()).toBe(200);

    // Convert response body to JSON
    const responseBody = await apiResponse.json();
    console.log(responseBody);
    expect(responseBody.total_count).toBeGreaterThan(0);

    // Expected values
    const expectedValue = {
        "login": "jelenszky",
      };
    // Custom assertion to check if the items of response array contain correct users 
    const containsExpectedValue = responseBody.items.every(user => {
        return user.login.toLowerCase().includes(expectedValue.login.toLowerCase()) 
    });    
    expect(containsExpectedValue).toBeTruthy();
  });

  test('Retrieves detailed information about a specific GitHub user', async ({request}) => {
    const apiResponse = await request.get(`
    https://api.github.com/users/jelenszky`);
    const responseBody = await apiResponse.json();
    
    console.log(responseBody);
    // Check status code    
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponse.status()).toBe(200);

    expect(responseBody.login.toLowerCase()).toEqual('jelenszky');

    //Validate schema of JSON response
    const Ajv = require('ajv');
    const addFormats = require('ajv-formats');
    const userSchema = require('./user_details_schema.js'); 

    const ajv = new Ajv();
    addFormats(ajv, ['uri','uri-template', 'email', 'date-time']);

    // Function to validate the API response against the schema
    const validateApiResponse = (data) => {
    const validate = ajv.compile(userSchema);
    const valid = validate(data);
    if (!valid) {
        console.error(validate.errors);
    }
    return valid;
    };

    const isValid = validateApiResponse(responseBody);
    expect(isValid).toBeTruthy();

  });

  test('Search for repositories on GitHub that match certain criteria', async ({request}) => {
    const apiResponse = await request.get(`
    https://api.github.com/search/repositories?q=topic:playwright`);
    
    // Check status code
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponse.status()).toBe(200);

    // Convert response body to JSON
    const responseBody = await apiResponse.json();
    console.log(responseBody);
    expect(responseBody.total_count).toBeGreaterThan(0);

  });  

  test('Retrieves information about a specific GitHub repository', async ({request}) => {
    const apiResponse = await request.get(`
    https://api.github.com/repos/Jelenszky/reinforcement_learning`);
    const responseBody = await apiResponse.json();
    
    // Check status code    
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponse.status()).toBe(200);
    console.log(responseBody);

    expect(responseBody.name).toBe('reinforcement_learning');
    expect(responseBody.owner.login).toBe('Jelenszky');
    expect(responseBody.default_branch).toBe('master');

  });  

   test('Create a repository for the authenticated user', async () => {
    const octokitModule = await import('octokit');
    const Octokit = octokitModule.Octokit;
    const octokit = new Octokit({
        auth: TOKEN
    });
    const apiResponse = await octokit.request('POST /user/repos', {
        name: 'Test-Repo',
        description: 'This is your first repo!',
        homepage: 'https://github.com',
        'private': false,
        is_template: true,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    console.log(apiResponse);
    // Check status code    
    expect(apiResponse.status).toBe(201);
    expect(apiResponse.data.name).toEqual('Test-Repo');
});  

test('Delete a repository of the authenticated user', async () => {
    const octokitModule = await import('octokit');
    const Octokit = octokitModule.Octokit;
    const octokit = new Octokit({
        auth: TOKEN
    });
    const apiResponse = await octokit.request('DELETE /repos/{owner}/{repo}', {
        owner: 'Jelenszky',
        repo: 'Test-Repo',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    console.log(apiResponse);
    // Check status code    
    expect(apiResponse.status).toBe(204);
});  

});
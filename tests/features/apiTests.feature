Feature: GitHub API Test

  Scenario: Retrieve users with 'jelenszky' in their username
    Given I am using GitHub API
    When I fetch users with username containing "jelenszky"
    Then I should receive a successful response
    And the response should have users with "jelenszky" in username

  Scenario: Get detailed user information from GitHub API
    Given I have set up the API request for specific user details
    When I send the request to fetch information for user "jelenszky"
    Then the response should be successful and the status code should be 200
    And the response should contain the correct user login "jelenszky"
    And the user details should match the expected schema  

  Scenario: Get information about a specific repository from GitHub API
    Given I have configured the GitHub API for repository information
    When I request details for the repository "Jelenszky/reinforcement_learning"
    Then I should receive a valid response with status code 200
    And the response should contain correct repository details   

  Scenario: Search repositories by topic
    Given I have set up the GitHub API for repository search
    When I search repositories with the topic "playwright"
    Then I should receive a successful response with status code 200
    And the search result should contain at least one repository   

  Scenario: Successfully create a new repository
    Given I am authenticated as a GitHub user
    When I create a repository with specified details
    Then I should receive a response with status code 201
    And the response should confirm the repository details   

  Scenario: Successfully delete an existing repository
    Given I am authenticated as a GitHub user
    When I delete the repository "Test-Repo" owned by "Jelenszky"
    Then I should receive a response with status code 204   
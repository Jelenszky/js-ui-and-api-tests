Feature: GitHub UI Test

  Scenario: Check if landing page can be loaded
    Given I am on the landing page
    Then I should see the title "GitHub · Build and ship software on a single, collaborative platform · GitHub"
    And I should see the GitHub logo
    And I should see the search button
    And I should see the sign in button

  Scenario: Check if test user can log in
    Given I am on the landing page
    When I click on the sign in button
    Then I should see the login page
    When I login with test user credentials
    Then I should see the home page
    And I should see the create menu button
    And I should see the search field

  Scenario: Search for repositories where owner is jelenszky
    Given I am on the landing page
    When I click on the sign in button
    Then I should see the login page
    When I login with test user credentials
    Then I should see the home page
    And  I should see the search field
    When I search for repositories where owner is "jelenszky"
    Then I should see more than 0 repositories     

 Scenario: Check if test user can create a repository on UI
    Given I am on the landing page
    When I click on the sign in button
    Then I should see the login page
    When I login with test user credentials
    Then I should see the home page
    And I should see the create menu button
    When I click on the create new repository button
    Then I should see the new repository page
    When I input new repository name "Test-Repo"
    And I click on the create repository button
    Then I should be redirected to the new repository page
    When I go back to the landing page
    And I search for repositories where owner is "TestUser2024Debrecen"
    And I wait for the owner's page to load
    And I click on the "Repositories" tab
    Then I should see the repository "Test-Repo"
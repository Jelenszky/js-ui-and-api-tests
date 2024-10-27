class NewPage {

    constructor(page) {
        this.page = page;
        this.logo = page.locator('.octicon-mark-github');
        this.searchButton = page.locator('div.color-fg-muted > svg.octicon-search');
        this.headerText = page.locator('div.AppHeader-context');
        this.formHeaderText = page.locator('h1:has-text("Create a new repository")');
        this.repositoryNameInput = page.locator('input[data-testid="repository-name-input"]');
        this.createRepositoryButton = page.locator('button > span:has-text("Create repository")');
        this.repoNameIsAvalaible = page.locator('span#RepoNameInput-is-available');
    };

    async inputNewRepositoryName(name){
        await this.repositoryNameInput.fill(name);
    };

    async clickCreateRepositoryButton(){
        await this.createRepositoryButton.click();
    };

};

module.exports = NewPage;
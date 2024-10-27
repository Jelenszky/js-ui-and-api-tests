class HomePage {

    constructor(page) {
        this.page = page;
        this.headerText = page.locator('h2:has-text("Home")');
        this.searchField = page.locator('span#qb-input-query');
        this.queryField = page.locator('input#query-builder-test');
        this.createMenuButton = page.locator('#global-create-menu-anchor');
        this.createNewRepositoryButton = page.locator('a[href*=new] span:has-text("New repository")');
    };

    async searchForRepositories(queryString){
        await this.searchField.click();
        await this.queryField.fill(queryString);
        await this.page.keyboard.press('Enter');
     }

    async clickCreateNewRepositoryButton(){
        await this.createMenuButton.click();
        await this.createNewRepositoryButton.click();
    }

};

module.exports = HomePage;
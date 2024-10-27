class LandingPage {

    constructor(page) {
        this.page = page;
        this.logo = page.locator('.octicon-mark-github');
        this.searchButton = page.locator('div.color-fg-muted > svg.octicon-search');
        this.signIn = page.locator('div.HeaderMenu-link-wrap > a[href*=login]');
    };

    async goto(){
        await this.page.goto('https://github.com/');
    };

    async clickSignInButton(){
        await this.signIn.click();
    };

};

module.exports = LandingPage;
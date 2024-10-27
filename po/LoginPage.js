const fs = require('fs').promises;

class LoginPage {

    constructor(page) {
        this.page = page;
        this.headerText = page.locator('h1:has-text("Sign in to GitHub")');
        this.usernameField = page.locator('#login_field');
        this.passwordField = page.locator('#password');
        this.signIn = page.locator('input.js-sign-in-button');
    };

    async clickSignInButton(){
        await this.page.signIn.click();
    };

    async loginWithTestUserCredentials(){
        const data = await fs.readFile('../tests/testuser.json', 'utf8');
        const user = JSON.parse(data);
    
        await this.usernameField.fill(user.username);
        await this.passwordField.fill(user.password);
        await this.signIn.click();
    }

};

module.exports = LoginPage;
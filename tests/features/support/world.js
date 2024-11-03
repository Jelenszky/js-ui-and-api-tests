let { setWorldConstructor } = require('@cucumber/cucumber');
let { RPWorld } = require('@reportportal/agent-js-cucumber');
setWorldConstructor(RPWorld);
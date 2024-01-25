const config = require ('./config');

global.config = config.configuration;
global.chestrewards = config.chestrewards;
global.quests = config.quests;

// System Configuration
global.system = {
    mainpath: __dirname
}

require('./cores/database/database');
require('./cores/server');

// you can add some code if you want too..
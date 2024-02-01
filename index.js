const config = require ('./config');

// configuration loader 
global.config = config.configuration;
global.chestrewards = config.chestrewards;
global.quests = config.quests;
global.modrate = config.modrate;
global.payloadlimit = config.payloadlimit;

// System Configuration
global.system = {
    mainpath: __dirname
}

require('./cores/database/database');
require('./cores/server');

// you can add some code if you want too..
const config = require ('./config');

// configuration loader 
global.config = config.configuration;
global.chestrewards = config.chestrewards;
global.quests = config.quests;
global.modrate = config.modrate;
global.payloadlimit = config.payloadlimit;
global.database = config.databasepath

// System Configuration
global.system = {
    mainpath: __dirname
}

require('./cores/database/database');
require('./cores/server');
require ('./cores/cron');

// you can add some code if you want too..
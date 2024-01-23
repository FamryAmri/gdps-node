const bcrypt = require ('bcrypt');
const crypto = require ('crypto');
const db = require('./database/database')
const gzip = require ('zlib');
const XOR = require ('./XOR');

const startID = 1000; // start every id 

const accID = startID;
const userID = 5000;
const postID = startID;
const commentID = startID;
const featureID = 100;

module.exports.savesSomefile = (name=false, data="") => {
    const fs = require ("fs");
    const path = require ('path');

    if (!name) return false;

    var savespath = path.join (global.system.mainpath, global.config.datapath);
    var datapath = path.join (savespath, `/${name}.dat`);

    fs.writeFileSync(datapath, data);
    return true;
}

module.exports.readsSomefile = (name=false, data="") => {
    const fs = require('fs');
    const path = require ('path');

    if (!name) return false;

    var savespath = path.join (global.system.mainpath, global.config.datapath);
    var datapath = path.join (savespath, `${name}.dat`);

    if (!fs.existsSync(datapath)) return false;
    
    return fs.readFileSync(datapath);
}
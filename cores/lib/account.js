const tools = require ('./tools');
const db = require ('../database/database');
const user = require ('./user');

const startID = 1000; // start every id 
const accID = startID;

module.exports.accountImport = (id=0, data) => {
    const fs = require ('fs');
    const path = require ('path');

    if (id==0) return false;


    var data = tools.compressGzip(data);

    var savespath = path.join(global.system.mainpath, global.config.datapath);
    var filename = path.join (savespath, `/a/${id}.gz`);

    if (!fs.existsSync(path.join(savespath, '/a'))) fs.mkdirSync(path.join(savespath, '/a'));
    
    fs.writeFileSync(filename, data);
    return true;
}

module.exports.accountExport = (id=0) => {
    const fs = require ('fs');
    const path = require ('path');

    if (id==0) return false;

    var savespath = path.join(global.system.mainpath, global.config.datapath);
    var filename = path.join (savespath, `/a/${id}.gz`);

    var data = fs.readFileSync(filename);

    data = tools.decompressGzip(data);
    return data;
} 

module.exports.verifyaccount = (username, password) => {
    var account = user.userexists(username);
    if (!account) return false;
    var chk = tools.verifypassword(account.password, password);

    return chk;
}

module.exports.verifyaccount2 = (username, gjp2) => {
    var account = user.userexists(username);
    if (!account) return false;

    var cgjp2 = account.secretGJP2 || false;
    if (!cgjp2) return false;

    var chk = tools.verifypassword(cgjp2, gjp2);

    return chk;
}

module.exports.createaccount = (username,password,email) => {
    if (user.userexists(username)) return false;

    var time = Date.now();
    var target = ['username','password','email','secretGJP','secretGJP2', 'createon','saveon'];

    var gjp = tools.secretGJP(password);
    var gjp2 = tools.secretGJP2(password);
    var hash = tools.hashpassword(password);

    var push = [username, hash, email, gjp, gjp2, time, time];

    var count = db.select("accounts").count;
    if (count==0) {
        target.push ("ID");
        push.push (accID);
    }

    var account = db.insert('accounts').target(target);
    account.add(push);
    account.save();
    return true;
}

module.exports.saveonupdate = (id=0) => {
    id = Number(id || 0);
    if (id==0) return false; 

    var update = db.update('accounts').target("ID", id);
    update.set("saveon", Date.now());
    return true;
}

const user = require ('../../cores/lib/user');
const tools = require ("../../cores/lib/account");

var login = (req, res) => {
    console.log(req.body);
    var username = req.body.userName.toLowerCase();
    var password = req.body.password;
    var secret = req.body.secret;

    var account = user.userexists(username);
    if (!account) return res.send("-1");
    if (!tools.verifyaccount(username, req.body.password)) return res.send("-1");
    var userinfo = user.userinfoExists(username);

    if (!userinfo) {
        userinfo = user.createUserScore(username);

        user.createUserInfo(userinfo,account["ID"]);
        user.createUserIcons(userinfo, account["ID"]);
        userinfo = {
            "UID": userinfo
        }
    }

    res.send(`${account["ID"]},${userinfo["UID"]}`);
}

var register = (req,res) => {
    var username = req.body.userName.toLowerCase();
    var email = req.body.email;
    var password = req.body.password;

    if (username.length >= 15) return res.send("-4");
    if (user.userexists(username)) return res.send("-2");
    var chk = tools.createaccount(username, password, email);

    if (chk) return res.send("1");
}

var saves = (req, res) => {
    var username = req.body.userName.toLowerCase();
    var account = user.userexists(username);
    if (!account) return res.send("-1");
    if (tools.verifyaccount(username, account["password"])) return res.send("-1");

    if (!tools.accountImport(account["ID"], req.body.saveData)) return res.send("-1");
    
    tools.saveonupdate(account["ID"]);
    return res.send("1");
}

var loads = (req, res) => {
    var username = req.body.userName.toLowerCase();
    var account = user.userexists(username);
    if (!account) return res.send("-1");
    if (tools.verifyaccount(username, account["password"])) return res.send("-2");

    var saveData = tools.accountExport(account["ID"]);
    if (!saveData) return res.send("-1");

    var result = [saveData,req.body.gameVersion,req.body.binaryVersion,'a','a'];
    var output = result.join(";");
    return res.send(output);
}

module.exports = {
    register, login, saves, loads
}
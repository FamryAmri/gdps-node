const db = require ("../database/database");
const tools = require ('./tools');

const userID = 5000;

module.exports.userexists = (username) => {
    var account = db.select('accounts').find('username',username);
    if (account.length==0) return false;
    return account;
}

module.exports.userScoreExists = (username) => {
    var user = this.userexists(username);

    if (!user) return false;
    var check = db.select('scores').find('ID', user['ID']);

    if (check.length==0) return false;
    return check;
}

module.exports.createUserScore = (username) => {
    var user = this.userScoreExists(username);
    var getuser = this.userexists(username);

    var target = ["ID"];
    var push = [getuser["ID"]]

    var count = db.select('scores').count;
    if (count==0) {
        target.push ("UID");
        push.push (userID);
    }

    if (user) return false;
    var uid = db.insert('scores').target(target)
    uid.add(push);
    return uid.save();
}

module.exports.userinfoExists = (username) => {
    var user = this.userexists(username);

    if (!user) user = {
        "ID": 0
    }
    var check = db.select('userinfo').find('ID', user['ID']);

    if (check.length==0) return false;
    return check;
}

module.exports.usericonsExists = (username) => {
    var user = this.userexists(username);

    if (!user) user = {
        "ID": 0
    }
    var check = db.select('usericons').find('ID', user['ID']);

    if (check.length==0) return false;
    return check;
}

module.exports.createUserInfo = (uid, id=0) => {
    var o = db.insert('userinfo').target(["ID", "UID"]);
    o.add([id, uid]);
    o.save();
    return true;
}

module.exports.createUserIcons = (uid, id=0) => {
    var o = db.insert('usericons').target(["ID", "UID"]);
    o.add([id, uid]);
    o.save();
    return true;
}

module.exports.getNameByID = (id) => {
    var user = db.select("accounts").find("ID", id);
    if (!user || user.length==0) return false;
    return user.username;
}

module.exports.getNameByUID = (uid) => {
    var user = db.select("scores").find("UID", uid);
    if (!user || user.length==0) return false;

    return this.getNameByID(user["ID"]);
}

module.exports.getUidByID = (id) => {
    var user = db.select("scores").find("ID", id);
    if (!user || user.length==0) return false;
    return user["UID"];
}

module.exports.getIdByUID = (uid) => {
    var user = db.select("scores").find("UID", uid);
    if (!user || user.length==0) return false;
    return user["ID"];
}

module.exports.getIDByName = (username) => {
    var user = db.select ("accounts").find("username", username);
    if (!user || user.length==0) return false;
    return user["ID"];
}

module.exports.getUIDByName = (username) => {
    var user = this.getIDByName(username);
    if (!user || user.length==0) return false;
    user = db.select("scores").find("ID", user);
    if (!user || user.length==0) return false;
    return user["UID"];
}

module.exports.updateUserInfo = (data) => {
    var target = [
        "youtube", "x", "twitch",
        "allowMessage", "allowFriendReq",
        "showCommentHistory"
    ];

    var readyupdate = db.update("userinfo").target("UID", data.uID);

    var push = [
        data.yt || '', data.twitter || '', data.twitch || '',
        data.mS || 0, data.frS || 0, data.cS || 0
    ]

    for (let i = 0; i < push.length; i++) {
        readyupdate.set(target[i], push[i]);
    }

    readyupdate.save();
}

module.exports.updateUserIcons = (data) => {
    var target = [
        "iconCube", "iconShip", "iconBall",
        "iconUFO", "iconWave", "iconRobot",
        "iconSpider", "iconSwing", "iconOnGlow",
        "iconPColor", "iconSColor", "iconTColor",
        "iconExplosion", "iconPrimary", "special"
    ]

    var readyupdate = db.update("usericons").target("UID", data.uID);

    var push = [
        data.accIcon || 1, data.accShip || 1, data.accBall || 1,
        data.accBird || 1, data.accDart || 1, data.accRobot || 1,
        data.accSpider || 1, data.accSwing || 1, data.accGlow || 0,
        data.color1 || 0, data.color2 || 3, data.color3 || 0,
        data.accExplosion || 1, data.iconType || 0, data.special || 0
    ]

    for (let i = 0; i < push.length; i++) {
        readyupdate.set(target[i], push[i]);
    }

    readyupdate.save();
}

module.exports.updateUserScores = (data) => {
    var target = [
        "diamond", "moon",
        "Scoins", "Gcoins",
        "stars", "demons"
    ];

    var readyupdate = db.update("scores").target("UID", data.uID);

    var push = [
        data.diamonds || 0, data.moons || 0,
        data.userCoins || 0, data.coins || 0,
        data.stars || 0, data.demons || 0,
    ];

    for (let i = 0; i < push.length; i++) {
        readyupdate.set(target[i], push[i]);
    }

    readyupdate.save();
}

module.exports.updateUsers = (data) => {
    this.updateUserIcons(data);
    this.updateUserScores(data);
    return true;
}

module.exports.getUserIcons = (id) => {
    var uid = this.getUidByID(id);

    var user = db.select("usericons").find("UID", uid);
    return user;
}

module.exports.getUserScores = (id) => {
    var uid = this.getUidByID(id);
    var user = db.select("scores").find("UID", uid);

    return user;
}

module.exports.getUserInfo = (id) => {
    var uid = this.getUidByID(id);
    var user = db.select("userinfo").find("UID", uid);

    return user;
}

module.exports.getUsers = (id) => {
    var info = this.getUserInfo(id);
    var scores = this.getUserScores(id);
    var icons = this.getUserIcons(id);

    return {
        info: info || {},
        scores: scores || {},
        icons: icons || {}
    }
}
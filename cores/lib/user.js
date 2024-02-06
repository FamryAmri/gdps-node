const db = require ("../database/database");
const tools = require ('./tools');

const userID = 5000;

module.exports.userexists = (username) => {
    var state = `ID=${username}`
    if (isNaN(username)) state = `username='${username}'`

    var account = db.select('accounts', {
        state: `WHERE ${state}`
    });
    if (account.count==0) return false;
    return account.all[0];
}

module.exports.userScoreExists = (username) => {
    var user = this.userexists(username);

    if (!user) return false;
    var check = db.select('scores', {
        state: `WHERE ID=${user['ID']}`
    });

    if (check.count==0) return false;
    return check.all[0];
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
    var check = db.select('userinfo',{
        state: `WHERE ID=${user['ID']}`
    });

    if (check.count==0) return false;
    return check.all[0];
}

module.exports.usericonsExists = (username) => {
    var user = this.userexists(username);

    if (!user) user = {
        "ID": 0
    }
    var check = db.select('usericons',{
        state: `WHERE ID=${user['ID']}`
    });

    if (check.count==0) return false;
    return check.all[0];
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
    var user = db.select("accounts", {
        target: ["username"],
        state: `WHERE ID = ${id}`
    });
    if (!user || user.count==0) return 0;
    return user.all[0].username;
}

module.exports.getNameByUID = (uid) => {
    var user = this.getIdByUID(uid);
    if (!user || user.count==0) return 0;

    return this.getNameByID(user);
}

module.exports.getUidByID = (id) => {
    var user = db.select("scores", {
        target: ["UID"],
        state: `WHERE ID = ${id}`
    });
    if (!user || user.count==0) return 0;
    return user.all[0]["UID"];
}

module.exports.getIdByUID = (uid) => {
    var user = db.select("scores", {
        target: ['ID'],
        state: `WHERE UID = ${uid}`
    });
    if (!user || user.count==0) return 0;
    return user.all[0]["ID"];
}

module.exports.getIDByName = (username) => {
    var user = db.select ("accounts", {
        target: ['ID'],
        state: `WHERE username='${username}'`
    });
    if (!user || user.count==0) return 0;
    return user.all[0]["ID"];
}

module.exports.getUIDByName = (username) => {
    var user = this.getIDByName(username);
    if (!user) return false;
    user = db.select("scores", {
        target: ["UID"],
        state: `WHERE ID=${user}`
    });
    if (!user || user.count==0) return 0;
    return user.all[0]["UID"];
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
    
    if (uid==0) return {};
    var user = db.select("usericons", {
        state: `WHERE UID=${uid}`
    });

    return user.all[0];
}

module.exports.getUserScores = (id) => {
    var uid = this.getUidByID(id);

    if (uid==0) return {};
    var user = db.select("scores", {
        state: `WHERE UID=${uid}`
    });

    return user.all[0];
}

module.exports.getUserInfo = (id) => {
    var uid = this.getUidByID(id);

    if (uid==0) return {};
    var user = db.select("userinfo", {
        state: `WHERE UID=${uid}`
    });

    return user.all[0];
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

module.exports.getusersearch = (string, page=0, count=10) => {
    var data = [];
    var players = db.select('accounts', {
        target: ["accounts.ID", "accounts.username"],
        state: `LEFT JOIN scores ON scores.ID = accounts.ID WHERE accounts.username LIKE '%${string}%' AND NOT scores.UID = 0 ORDER BY accounts.ID LIMIT ${count} OFFSET ${page}*${count}`
    });

    var total = db.select('accounts', {
        target: ["count(*)"],
        state: `LEFT JOIN scores ON accounts.ID = scores.ID WHERE username LIKE '%${string}%' AND NOT scores.UID = 0`
    }).count;

    var player = players.all;

    while (data.length < players.count) {
        var users = this.getUsers(player[data.length].ID);
        var push = {}

        push.top = 1;
        push.username = player[data.length].username;
        push.uid = users.info['UID'];
        push.gcoins = users.scores['Gcoins'];
        push.scoins = users.scores['Scoins'];
        push.icon = tools.icons(users.icons);
        push.color1 = users.icons['iconPColor'];
        push.color2 = users.icons['iconSColor'];
        push.color3 = users.icons['iconTColor'];
        push.iconT = users.icons['iconPrimary'];
        push.special = users.icons['special'];
        push.id = users.info['ID'];
        push.stars = users.scores['stars'];
        push.cpoints = users.scores['CPoints'];
        push.demons = users.scores['demons'];
        push.diamonds = users.scores['diamond'],
        push.moons = users.scores['moon'];

        data.push(push);
    }

    return {
        players: data || [],
        total
    }
}
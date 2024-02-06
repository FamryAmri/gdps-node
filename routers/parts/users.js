const tools = require ('../../cores/lib/user');
const social = require ('../../cores/lib/social');
const misc = require ('../../cores/lib/misc');
const acc = require ('../../cores/lib/account');

var updateuser = (req, res) => {
    var data = req.body;

    if (!req.body.accountID) return res.send("-1");
    if (!req.body.userName || !req.body.secret) return res.send("-1");

    var pass = false;

    var id = req.body.accountID || 0;

    if (id==0) return res.send("-1");
    if (req.body.gjp) if (acc.verifygjp(id,req.body.gjp)) pass = true;
    if (req.body.gjp2) if (acc.verifygjp2(id,req.body.gjp2)) pass = true;

    if (!pass) return res.send("-1");
    
    var username = req.body.userName.toLowerCase();
    var secret = req.body.secret;

    data.uID = tools.getUidByID(data.accountID);
    tools.updateUsers(data);

    return res.send(`${data.uID}`);
}

var getuser = (req, res) => {
    var data = req.body;
    let extra = [];
    
    if (!req.body.accountID) return res.send("-1");
    var name = tools.getNameByID(req.body.accountID);
    var uid = tools.getUidByID(req.body.accountID);

    var targetuser = req.body.targetAccountID;

    var users = tools.getUsers(targetuser);

    var allowmessage = users.info["allowMessage"];
    var reqadd = users.info["allowFriendReq"];
    var commentshow = users.info["showCommentHistory"];
    var modbadge = 0;
    
    var role = misc.getUserPerms(targetuser||0,'hasMod');
    if (role!==0) modbadge = misc.getrole(role)['modlevel'];
    
    var friendstate = 0;
    
    if (social.checkblock(req.body.accountID, targetuser)) return res.send("-1");
    
    if (req.body.accountID == targetuser) {
        var msgnew = social.newmsgcount(req.body.accountID);
        var friendreqnew = social.check1ncomeReqCount(req.body.accountID);
        var friends = social.check0utcomeReqCount(req.body.accountID);

        extra = [
            ":38", msgnew, 39, friendreqnew, 40, friends
        ]
    } else {
        
        var checkreq = social.checkreq(req.body.accountID, targetuser);
        var whisper = checkreq.whisper;
        friendstate = checkreq.status;
        var whenReq = checkreq.whenReq;
        
        if (friendstate==3) extra = [
            ":32", checkreq.id, 35, whisper, 37, whenReq
        ]
    }

    if (!name) return res.send("-1");
    var params = [
        1, name, 2, uid, 13, users.scores["Gcoins"],
        17, users.scores["Scoins"], 10, users.icons["iconPColor"], 11, users.icons["iconSColor"],
        51, users.icons["iconTColor"], 3, users.scores["stars"], 46, users.scores['diamonds'],
        52, users.scores['moons'], 4, users.scores["demons"], 8, users.scores["CPoints"], 18, 
        allowmessage, 19, reqadd, 50, commentshow, 20, users.info['youtube'], 21, users.icons['iconCube'], 
        22, users.icons['iconShip'], 23, users.icons['iconBall'], 24, users.icons['iconUFO'], 25, 
        users.icons['iconWave'], 26, users.icons['iconRobot'], 28, users.icons['iconOnGlow'], 43, users.icons['iconSpider'],
        47, users.icons['iconExplosion'], 53, users.icons['iconSwing'], 54, users.icons['iconJet'] || 1,
        30, users.scores['top'], 16, targetuser, 31, friendstate, 44, users.info["x"], 45, users.info['twitch'], 29, 1, 49, modbadge
    ]

    var o1 = params.join(":");
    var o2 = extra.join (":");

    return res.send(`${o1}${o2}`);
}

var updateuserinfo = (req, res) => {
    if (!req.body.accountID) return res.send("-1");
    var data = req.body;

    var pass = false;

    if (data.accountID==0) return res.send("-1");
    if (req.body.gjp) if (acc.verifygjp(id,req.body.gjp)) pass = true;
    if (req.body.gjp2) if (acc.verifygjp2(id,req.body.gjp2)) pass = true;

    if (!pass) return res.send("-1");

    data.uID = tools.getUidByID(data.accountID);
    if (!data.uID) return res.send("-1");

    tools.updateUserInfo(data);
    return res.send("1");
}

var getuserlist = (req, res) => {
    var type = req.body.type || 0;
    var id = req.body.accountID || 0;
    var ready, list = [];

    if (type==0) ready = social.getfriendlist(id);
    else if (type==1) ready = social.getblocklist(id);

    var newfriend = social.check0utcomeReqCount (id);
    if (newfriend > 0) social.check0utcomeReqCount(id,newfriend);

    if (ready.length==0) return res.send("-2");

    for (let i = 0; i < ready.length; i++) {
        var isNew = 0;
        var tmp = [
            1, ready[i].username, 2, ready[i].uid, 9,
            ready[i].icon, 10, ready[i].color1, 11, ready[i].color2,
            14, ready[i].iconT, 15, ready[i].special, 16, ready[i].id, "18:0:41",
            isNew
        ]
        list.push (tmp.join(":"));
    }

    var output = list.join("|");
    return res.send(output);
}

var getusersearch = (req, res) => {
    if (!req.body.str) return res.send("-1");

    var str = req.body.str.toLowerCase();
    var page = req.body.page || 0;

    var list = tools.getusersearch(str,page);

    if (list.total==0 || list.players.length==0) return res.send("-1");

    var opt = [];
    while (opt.length < list.players.length) {
        var o = list.players[opt.length];
        let push = [
            1,o.username,2,o.uid,
            13,o.gcoins,17,o.scoins,9,o.icon,10,o.color1,
            11,o.color2,51,o.color3,14,o.iconT,
            15,o.special,16,o.id,3,o.stars,8,o.cpoints,
            4,o.demons,46,o.diamonds,52,o.moons
        ]
        opt.push(push.join(":"));
    }

    var output = opt.join("|");
    var bonus = `#${list.total}:${page*10}:10`;
    return res.send(output+bonus);
}

module.exports = {
    updateuser, updateuserinfo, getuser,
    getuserlist, getusersearch
}
const tools = require ('../../cores/lib/social');
const usert = require ('../../cores/lib/user');
const tool = require ('../../cores/lib/tools');

var acceptReq = (req, res) => {
    var reqq = req.body.requestID || 0;
    
    var id = req.body.accountID || 0;
    var id2 = req.body.targetAccountID || 0;

    if (id==0||id2==0) return res.send("-1");
    if (req.body.requestID==0 || !tools.existsReqID(reqq)) reqq = tools.getReqID(id, id2);

    tools.acceptReq(id, id2);

    return res.send("1");
}

var addreq = (req, res) => {

    if (!req.body.accountID || !req.body.toAccountID) return res.send("-1");
    var id = req.body.accountID;
    var id2 = req.body.toAccountID;
    
    var infos = usert.getUserInfo(id2);    
    if (infos.allowFriendReq==1 || tools.checkblock(id, id2)) return res.send("-1");

    if (id==0 || id2==0) return res.send("-1");
    
    var {status} = tools.checkreq(id, id2);
    if (status==1 || status==4) return res.send("-1");
    if (status==3) tools.acceptReq(id2, id)
    if (status==0) tools.addReq(id, id2, req.body.comment);

    return res.send("1");
}

var getreq = (req, res) => {
    if (!req.body.accountID) return res.send("-1");

    var id = req.body.accountID;
    var getsent = req.body.getSent || 0;

    var userreqs = tools.getreqlist(id, getsent, req.body.page);
    var resp = [];
    var output = [];

    for (let i = 0; i < userreqs.users.length; i++) {
        var user = userreqs.users;
        var tmp = [
            1, user[i]['username'], 2, user[i]['uid'], 9, user[i]['icon'],
            10, user[i]['color1'], 12, user[i]['color2'], 14, user[i]['iconT'],
            15, user[i]['special'], 16, user[i]['id'], 32, user[i]['request'],
            35, user[i]['comment'], 41, user[i]['isNew'], 37, tool.timelang(user[i]['whenReq'])
        ]
        resp.push(tmp.join(":"));
    }

    output.push (resp.join("|"));
    output.push ([
        `${userreqs.count}:${req.body.page}:10`
    ]);

    return res.send(output.join("#"));
}

var remFriend = (req, res) => {
    var id = req.body.accountID || 0;
    var id2 = req.body.targetAccountID || 0;
  
    if (tools.removeFriendReq(id, id2)) return res.send("1");
    return res.send("-1");
}

var sentmessage = (req, res) => {
    var id = req.body.accountID;
    var id2 = req.body.toAccountID;
    var subject = req.body.subject;
    var message = req.body.body;

    if (id==0||id2==0) return res.send("-1");

    var u2 = usert.getUserInfo(id2);

    var allowMessage = u2.allowMessage;

    if (allowMessage==1||u2.length==0) return res.send("-1"); 
    tools.createMessage(id, id2, subject, message);
    return res.send("1");
}

var getmessage = (req, res) => {
    var id = req.body.accountID || 0;
    var getsent = req.body.getSent || 0;
    var offset = req.body.page || 0;

    if (id==0) return res.send("-1");

    var get = tools.getmessage(id, offset, getsent);
    var msg = get.message;

    if (msg.count < 0) return res.send("-2");

    var msgstr = [];
    for (let i = 0; i < msg.length; i++) {
        var tmp = [
            6, msg[i]['username'], 3, msg[i]['uid'], 2, msg[i]['id'],
            1, msg[i]['msgID'], 4, msg[i]['subject'], 8, msg[i]['isnew'],
            9, getsent, 7, tool.timelang(msg[i]['whenSent'])
        ];
        msgstr.push(tmp.join(":"));
    }

    return res.send(`${msgstr.join("|")}#${msg.count}:${offset}:10`)
}

var readmessage = (req, res) => {
    var msgID = req.body.messageID || 0;
    
    if (msgID==0) return res.send("-1");

    var sender = req.body.isSender || 0;
    var msginfo = tools.readmsg(msgID);
    msgID = msginfo.msgID || 0;

    if (msgID==0) return res.send("-1");

    if (msginfo['isnew']==1) tools.seenmsg(msgID);

    var tmp = [
        6, msginfo['username'], 3, msginfo['uid'], 2, msginfo['id'],
        1, msginfo['msgID'], 4, msginfo['subject'], 8, msginfo['isnew'],
        9, sender, 5, msginfo['message'], 7, tool.timelang(msginfo['whenSent'])
    ];

    return res.send(tmp.join(":"));
}

var removemessage = (req, res) => {
    var id = req.body.accountID || 0;
    var sender = req.body.isSender || 0;
    var messages = req.body.messages || '';
    var msgID = req.body.messageID || 0;

    if (msgID==0||id==0) return res.send("-1");
    if (messages=='') tools.removeMsg(msgID); 

    return res.send("1");
}

var blockuser = (req, res) => {
    if (!req.body.targetAccountID) return res.send("-1");

    var id = req.body.accountID;
    var id2 = req.body.targetAccountID;

    if (tools.checkblock(id, id2)) return res.send("-1");
    tools.blockuser(id, id2);
    tools.clearmsg(id, id2);
    return res.send("1");
}

var unblockuser = (req, res) => {
    if (!req.body.targetAccountID) return res.send("-1");

    var id = req.body.accountID;
    var id2 = req.body.targetAccountID;

    var check = tools.checkblockfirst(id, id2);
    if (!check) return res.send("-1");

    tools.unblockuser(id, id2);
    return res.send("1");
}

var sentcomment = (req, res) => {
    if (!req.body.accountID) return res.send("-1");

    var comment = req.body.comment || '';
    var id = req.body.accountID;
    var levelid = req.body.levelID || 0;
    var percent = req.body.percent || 0;

    tools.createcomment(levelid, id, comment, percent);

    return res.send("1");
}

var getcomment = (req, res) => {
    var levelid = req.body.levelID || 0;
    var uid = req.body.userID || 0;

    var count = req.body.count || 10;
    var page = req.body.page || 0;
    var mode = req.body.mode || 0;

    var binary = req.body.binaryVersion || 32;

    var comment;
    if (levelid!==0) comment = tools.getcommentByLevelID(levelid,count,page,mode);
    else if (id!==0) {
        var id = usert.getIdByUID(uid);
        comment = tools.getcommentByID(id,count,page,mode);
    } else return res.send("-1");

    var cmt = comment.comments;
    var cmts = [];

    while (cmts.length < cmt.length) {
        var oncmt = cmt[cmts.length];
        var tmp = [];
        if (levelid<1) tmp.push (1,oncmt['levelid']);
        tmp.push (2,oncmt['comment'],3,oncmt['uid'],4,oncmt['likes'],'5~0~7',oncmt['spam'],9,tool.timelang(oncmt['createon']),6,oncmt['commentid'],10,oncmt['percent']);
        
        var colortxt = "255,255,255";
        var modlevel = 0;
        tmp.push (11,modlevel,12,`${colortxt}:1`, oncmt['username'], "7~1~9",oncmt['icon'],10,oncmt['color1'],11,oncmt['color2'],14,oncmt['iconType'],15,oncmt['special'],16,oncmt['id']);

        cmts.push(tmp.join("~"));
    }

    if (binary < 32) return res.send("-1");
    var output = cmts.join("|");

    return res.send(`${output}#${comment.total}#${page}#${comment.limit}`)
}

module.exports = {
    acceptReq, addreq, getreq, remFriend, getmessage, sentmessage, readmessage, removemessage,
    blockuser, unblockuser, sentcomment, getcomment
}
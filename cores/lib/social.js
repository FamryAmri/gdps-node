const db = require ("../database/database");
const tools = require ("./tools");
const user = require ('./user');

module.exports.removeMsg = (id) => {
    db.delete('messages',{
        state: `WHERE msgID = ${id}`
    }).run();
    return true;
}

module.exports.createMessage = (id=0, id2=0, subject='', message='') => {
    var create = db.insert('messages').target(['oneID', 'twoID', 'subject', 'message', 'whenSent']);

    create.add([
        id, id2, subject, message, Date.now()
    ]);

    create.save();
    return true;
}

module.exports.getmessage = (id=0, offset=0, getsent=0) => {
    getsent = Number(getsent);
    var msgs = [];

    var tname = ['twoID', 'oneID'];
    var intname = ['oneID', 'twoID'];

    if (id==0) return [];
    
    var msg = db.select("messages", {
        target: ['msgID'],
        state: `WHERE ${tname[getsent]} = ${id} ORDER BY msgID DESC LIMIT 10 OFFSET ${offset}*10`
    });

    var count = db.select("messages", {
        state: `WHERE ${tname[getsent]} = ${id}`
    });


    if (msg.count > 0) for (let o = 0; o < msg.count; o++) {
        var tmp = this.readmsg(msg.all[o]['msgID']);
        var msgid = tmp.msgID || 0;
        if (msgid!==0) msgs.push (tmp);
    }

    return {
        message: msgs,
        count: count.count || 0
    }
}

module.exports.readmsg = (id=0) => {
    if (id==0) return {};
    var msg = db.select("messages", {
        state: `WHERE msgID = ${id}`
    });

    if (msg.count==0) return {};

    var i = msg.all[0];

    var isnew = i['seen'];

    var output = {
        toUsername: user.getNameByID(i['twoID']),
        toid: i['twoID'],
        touid: user.getUidByID(i['twoID']),
        username: user.getNameByID(i['oneID']),
        uid: user.getUidByID(i['oneID']),
        id: i['oneID'],
        msgID: i['msgID'],
        subject: i['subject'],
        message: i['message'],
        isnew,  whenSent: i['whenSent']
    }
    return output;
}

module.exports.friendscount = (id) => {
    var cnt = 0;
    var params = {}
    params.state = `WHERE oneID = ${id} OR twoID = ${id}`;
    var chk1 = db.select("friends").filter ("accept", 1);

    if (chk1 > 0) cnt+=chk1.length;
    return cnt;
}

module.exports.check0utcomeReqCount = (id, update=0) => {
    var chk1 = db.select("friends",{
        state: `WHERE oneID = ${id} AND new1 = 1`
    });

    
    if (Number(update) > 0) for (let i = 0; i < chk1.count; i++) {
        var set = db.update('friends').target('reqID', chk1.all[i]['reqID']);
        set.set('new1', 0);
        set.save();
    }

    return chk1.count;
}

module.exports.check1ncomeReqCount = (id, update=0) => {
    var chk1 = db.select("friends",{
        state: `WHERE twoID = ${id} AND new2 = 1`
    });

    if (Number(update) > 0) for (let i = 0; i < chk1.count; i++) {
        var set = db.update('friends').target('reqID', chk1.all[i]['reqID']);
        set.set('new2', 0);
        set.save();
    }

    return chk1.count;
}

module.exports.getblocklist = (id=0) => {
    if (id==0) return false;
    
    var user = db.select("blocks", {
        state: `WHERE oneID = ${id} AND twoID = ${id}`
    });

    var list = [];

    if (user.count==0) return [];

    for (let i = 0; i < user.count; i++) {
        var o = user.all[i]
        var sid = o['oneID'];
        if (sid==id) sid = o['twoID'];

        var u = user.getUsers(sid);

        var tmp = {
            username: user.getNameByID(sid),
            uid: u.scores['UID'],
            icon: tools.icons(u.icons),
            iconT: u.icons['iconPrimary'],
            special: u.icons['special'],
            color1: u.icons['iconPColor'],
            color2: u.icons['iconSColor'],
            color3: u.icons['iconTColor'],
            id: sid
        }
        list.push(tmp);
    }

    return list;
}

module.exports.getReqID = (id, id2) => {
    var req = db.select('friends', {
        target: ['reqID'],
        state: `WHERE (oneID=${id} AND twoID=${id2}) OR (oneID=${id2} AND twoID=${id})`
    });

    if (req.count==0) return 0;
    return req.all[0]['reqID'] || 0;
}

module.exports.existsReqID = (id) => {
    var req = db.select('friends', {
        state: `WHERE reqID = ${id}`
    });

    if (req.count==0) return false;
    return true;
}

module.exports.getfriendlist = (id=0, getid=0) => {
    if (id==0) return [];
    
    var users = db.select("friends", {
        target: ["oneID", "twoID"],
        state: `WHERE (oneID=${id} AND accept=1) OR (twoID=${id} AND accept=1)`
    });

    var l = users.all;
    var list = [];
    if (l.length==0) return list;

    for (let i = 0; i < l.length; i++) {
        var o = l[i];
        var sid = o['oneID'];
        if (sid==id) sid = o['twoID'];

        if (getid==0) {
            var u = user.getUsers(sid);

            var tmp = {
                username: user.getNameByID(sid),
                uid: u.scores['UID'],
                icon: tools.icons(u.icons),
                iconT: u.icons['iconPrimary'],
                special: u.icons['special'],
                color1: u.icons['iconPColor'],
                color2: u.icons['iconSColor'],
                color3: u.icons['iconTColor'],
                id: sid
            }
        } else var tmp = sid;
        list.push(tmp);
    }

    return list;
}

module.exports.getreqlist = (id, getsent=0, offset=0) => {
    getsent = Number(getsent);

    var params = {}
    params.state = `WHERE twoID = ${id} AND accept = 0`
    if (getsent==1) params.state = `WHERE oneID = ${id} AND accept = 0`

    var count = db.select('friends', params).count;
    params.state += ` LIMIT 10 OFFSET ${offset}*10`
    var reqlist = db.select("friends", params);
    var p = reqlist.all;

    var result = [];

    var i = reqlist.count;
    for (let o = 0; o < i; o++) {
        var tmp = {};
        
        var request = p[o]['twoID'];
        var getreq = 'oneID';
        if (getsent==1) {
            request = p[o]['oneID']; 
            getreq = 'twoID';
        }
        
        var users = user.getUsers(p[o][getreq]);
        
        var isNew = 0;
        tmp.username = user.getNameByUID(users.scores['UID']);
        tmp.uid = users.info['UID'];
        tmp.icon = tools.icons(users.icons);
        tmp.color1 = users.icons['iconPColor'];
        tmp.color2 = users.icons['iconSColor'];
        tmp.color3 = users.icons['iconTColor'];
        tmp.iconT = users.icons['iconPrimary'];
        tmp.special = users.icons['special'];
        tmp.id = users.scores['ID'];
        tmp.request = request;
        tmp.comment = p[o]['whisper'];
        tmp.isNew = isNew;

        tmp.whenReq = p[o]['whenReq'];

        result.push(tmp);
    }
    return {
        users: result,
        count: count
    }
}

module.exports.checkreq = (id, id2) => {
    var params = {
        state: `WHERE oneID = ${id} AND twoID = ${id2}`
    }

    var id = 0;

    var status = 4;
    var whisper = btoa('.');
    var whenReq = '1582.01.01.00.00'

    var chk1 = db.select("friends",params);
    if (chk1.count==0) {
        status = 3;
        params.state = `WHERE oneID = ${id2} AND twoID = ${id}`
        chk1 = db.select("friends", params);
        if (chk1.count==0) status = 0;
    }

    if (status > 0) {
        whisper = chk1.all[0]['whisper'];
        id = chk1.all[0]['reqID'];
        whenReq = chk1.all[0]['whenReq'];
        var isAccept = chk1.filter('accept', 1);
        if (isAccept.length!==0) status = 1; 
    }

    return {
        id, status, whisper, whenReq
    }
}

module.exports.addReq = (id, id2, whisper='') => {
    var req = db.insert('friends').target(['oneID', 'twoID', 'whisper', 'whenReq']);
    req.add([id, id2, whisper, Date.now()]);
    req.save();
    return true;
}

module.exports.removeFriendReq = (id, id2) => {
    var check = this.getReqID(id, id2);
    if (check==0) return false;

    db.delete('friends', {
        state: `WHERE reqID = ${check}`
    }).run();

    return true;
}

module.exports.acceptReq = (id, id2) => {
    var reqID = this.getReqID(id,id2);
    if (reqID==0) return false;

    var accept = db.update('friends').target('reqID', reqID);

    accept.set ("whisper", '');
    accept.set("accept", 1);
    accept.set("new1", 1);
    accept.set("new2", 0);

    accept.save();

    return true;
}

module.exports.checkblockfirst = (id, id2) => {
    var check = db.select("blocks", {
        state: `WHERE oneID=${id} AND twoID=${id2}`
    });

    if (check.count==0) return false;
    return true;
}

module.exports.checkblock = (id, id2) => {
    var check = db.select("blocks", {
        state: `WHERE (oneID=${id} AND twoID=${id2}) OR (oneID=${id2} AND twoID=${id})`
    });

    if (check.count==0) return false;
    return true; 
}

module.exports.newmsgcount = (id) => {
    var check = db.select("messages", {
        state: `WHERE twoID = ${id} AND seen = 0`
    });

    return check.count;
}

module.exports.clearmsg = (id, id2) => {
    db.delete ('messages', {
        state: `WHERE (oneID=${id} AND twoID=${id2}) OR (oneID=${id2} AND twoID=${id})`
    }).run();

    return true;
}

module.exports.seenmsg = (id=0) => {
    if (id==0) return false;

    var set = db.update('messages').target('msgID', id);
    set.set('seen', 1);
    set.save();

    return true;
}

module.exports.blockuser = (id, id2) => {
    var block = db.insert ('blocks').target(["oneID", "twoID", 'whenBlock']);
    block.add([id, id2, Date.now()]);
    block.save();
    return true;
}

module.exports.unblockuser = (id, id2) => {
    var unblock = db.delete('blocks', {
        state: `WHERE oneID = ${id} AND twoID = ${id2}`
    }).run();
    return true;
}

module.exports.createcomment = (lid, id, comment, percent=0, spam=0) => {
    var cmt = db.insert('levelcomments').target(['levelID', 'ID', 'comment', 'percent', 'spam', 'createon']);

    cmt.add([lid, id, comment, percent, spam, Date.now()]);
    cmt.save();

    return true;
}

module.exports.deletecomment = (lid, id) => {
    db.delete('levelcomments', {
        state: `WHERE ID=${id} AND levelID=${lid} LIMIT 1`
    }).run();

    return true;
}

module.exports.getcommentByLevelID = (id, count=10, offset=0, mode=0) => {
    var order = "commentID";
    if (mode > 0) order = "likes";

    var comment = db.select('levelcomments', {
        state: `WHERE levelID=${id} ORDER BY ${order} LIMIT ${count} OFFSET ${offset}*${count}`
    });

    var limit = comment.count;
    var total = 0;
    var comments = [];

    if (comment.count!==0) {
        var dostate = db.select('levelcomments',{
            target: ['count(*)'],
            state: `WHERE levelID=${id}`
        });

        total = dostate.count;

        while (comments.length < comment.count) {
            var o = comment.all[comments.length];
            var u = user.getUserIcons(o['ID']);

            var tmp = {};
            tmp.username = user.getNameByID(o['ID']);
            tmp.id = o['ID'], tmp.levelid = o['levelID'];
            tmp.comment = o['comment'], tmp.uid = user.getUidByID(o['ID']);
            tmp.commentid = o['commentID'], tmp.percent = o['percent'];
            tmp.icon = tools.icons(u), tmp.color1 = u['iconPColor'];
            tmp.color2 = u['iconSColor'], tmp.color3 = u['iconTColor'];
            tmp.iconType = u['iconPrimary'], tmp.special = u['special'];
            tmp.likes = o['likes'], tmp.spam = o['spam'], tmp.createon = o['createon'];

            comments.push(tmp);
        }
    }

    return {
        total,
        comments,
        limit
    }
}

module.exports.getcommentByID = (id, count=10, offset=0, mode=0) => {
    var order = "commentID";
    if (mode > 0) order = "likes";

    var comment = db.select('levelcomments', {
        state: `WHERE ID=${id} ORDER BY ${order} LIMIT ${count} OFFSET ${offset}*${count}`
    });

    var limit = comment.count;
    var total = 0;
    var comments = [];

    if (comment.count!==0) {
        var dostate = db.select('levelcomments',{
            target: ['count(*)'],
            state: `WHERE ID=${id}`
        });

        total = dostate.count;

        while (comments.length < comment.count) {
            var o = comment.all[comments.length];
            var u = user.getUserIcons(o['ID']);

            var tmp = {};
            tmp.username = user.getNameByID(o['ID']);
            tmp.id = o['ID'], tmp.levelid = o['levelID'];
            tmp.comment = o['comment'], tmp.uid = user.getUidByID(o['ID']);
            tmp.commentid = o['commentID'], tmp.percent = o['percent'];
            tmp.icon = tools.icons(u), tmp.color1 = u['iconPColor'];
            tmp.color2 = u['iconSColor'], tmp.color3 = u['iconTColor'];
            tmp.iconType = u['iconPrimary'], tmp.special = u['special'];
            tmp.likes = o['likes'], tmp.spam = o['spam'], tmp.createon = o['createon'];

            comments.push(tmp);
        }
    }

    return {
        total,
        comments,
        limit
    }
}
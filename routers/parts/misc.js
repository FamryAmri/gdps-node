const misc = require ('../../cores/lib/misc');
const tools = require ('../../cores/lib/tools');

var getuserscore = (req, res) => {
    var join = [];
    if (!req.body.count || req.body.count==0) return res.send("-1");
    if (!req.body.accountID) return res.send("-1");

    var type = "top";
    if (req.body.type) type = req.body.type;;

    var ldb = misc.leaderboard(type, Number(req.body.accountID), req.body.count);
    if (ldb.length==0) return res.send("-1");

    for (let i = 0; i < ldb.length; i++) {
        var o = ldb[i];
        let push = [
            1,o.username,2,o.uid,
            13,o.gcoins,17,o.scoins,
            6,o.top,9,o.icon,10,o.color1,
            11,o.color2,51,o.color3,14,o.iconT,
            15,o.special,16,o.id,3,o.stars,8,o.cpoints,
            4,o.demons,7,o.id,46,o.diamonds,52,o.moons
        ]
        join.push(push.join(":"));
    }
    var output = join.join("|");
    return res.send(output);
}

var getsong = (req, res) => {
    var songid = req.body.songID || 0;
    if (songid==0) return res.send("-1");

    var songinfo = misc.getSongs(songid);
    songid = songinfo.songid || 0;
    if (songid==0) return res.send("-1");

    var url = encodeURIComponent(songinfo.download);
    var size = tools.size(songinfo.size).split(" ")[0];

    var strsong = [
        1, songid, 2, songinfo.name, 3, songinfo.authorid, 4, songinfo.authorname, 5, size, "6~|~~|~10", url, 7, "8~|~0"
    ]

    return res.send(strsong.join("~|~"));
}

var getchest = (req, res) => {
    var id = req.body.accountID || 0;
    var type = req.body.rewardType || 0;
    var uid = req.body.uuid || 0;
    var udid = req.body.udid || 0;

    if (id==0 || uid==0 || udid==0 || !req.body.chk) return res.send("-1");

    var chk = req.body.chk;
    chk = tools.xorChest(chk.slice(5),true);

    var reward = misc.chestRewards(id,type);

    if (reward.length==0) return res.send("-1");
    
    var chest = [];
    for (let o = 0; o < 2; o++) chest.push(`${reward[o]['orbs']},${reward[o]['diamonds']},${reward[o]['shard']},${reward[o]['keys']}`);

    var output = [
        1, uid, chk, udid, id, reward[0]['timeleft'], chest[0], reward[0]['open'], reward[1]['timeleft'], chest[1], reward[1]['open'],type
    ];

    var string = tools.xorChest(output.join(":"));
    var hash = tools.chesthash(string);

    return res.send(`FamRy${string}|${hash}`);
}

var getquest = (req, res) => {
    var uid = req.body.uuid || 0;
    var udid = req.body.udid || 0;
    var id = req.body.accountID || 0;

    if (uid==0 || udid==0 || id==0 || !req.body.chk) return res.send("-1");
    
    var chk = req.body.chk.slice(5);
    chk = tools.xorQuest(chk,true);

    var quests = misc.quests();
    if (quests.list.length==0) return res.send("-1");
    
    var quest = [];
    while (quest.length < 3) {
        var tmp = quests.list[quest.length];
        var value = [tmp['questID'],tmp['type'],tmp['amount'],tmp['rewards'],tmp['name']].join(",");
        quest.push(value);
    }

    var output = ['FamRy',uid,chk,udid,id,quests.timeleft,quest[0],quest[1],quest[2]].join(":");
    output = tools.xorQuest(output);

    var hash = tools.questhash(output);

    return res.send(`FamRy${output}|${hash}`);
}

var getmod = (req, res) => {
    if (!req.body.accountID) return res.send("-1");

    var id = req.body.accountID;

    var getrole = misc.getUserPerms(id, "hasMod");
    if (getrole==0) return res.send("-1");

    var getmod = misc.getrole(getrole);
    if (getmod['modlevel']==0) return res.send("-1");
    return res.send(getmod['modlevel'].toString());
}

var like = (req, res) => {
    if (!req.body.accountID) return res.send("-1");

    var id = req.body.accountID;
    var like = req.body.like || 1;
    var type = req.body.type || 1;
    var itemID = req.body.itemID || 1;
 
    var liking = misc.likeSome(id,type,itemID,like);
    
    if (!liking) return res.send("-1");
    return res.send("1");
}

module.exports = {
    getuserscore, getsong, getchest, getquest, getmod, like
}
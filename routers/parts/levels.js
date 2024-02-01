const tools = require ('../../cores/lib/level');
const tool = require ('../../cores/lib/tools');
const user = require ('../../cores/lib/user');
const misc = require ('../../cores/lib/misc');

const uploads = (req, res) => {
    if (!req.body.levelString || req.body.levelString=="") return res.send("-1");

    var newid = "0";
    if (req.body.levelID=="0") newid = tools.createLevel(req.body);
    else newid = tools.updateLevel(req.body);

    return res.send(newid.toString());
}

const getlevels = (req, res) => {
    var gameVersion = req.body.gameVersion || '21';
    if (gameVersion=='22') if (req.body.diff) req.body.diff = req.body.diff[0];

    var levelmulstr = [];
    var level = tools.levelsearch(req.body);
    
    var pages = [level.total, level.offset*10, 10];
    var levelstr = [];
    var userstr = [];
    var songstr = [];

    var allstr = [];

    for (let n = 0; n < level.levels.length; n++) {
        var lvl = level.levels[n];

        var uid = lvl['UID'] || 0;
        var id = lvl['accountID'] || 0;
        var likes = lvl['dislikes'] - lvl['likes'];

        levelmulstr.push ({
            "ID": lvl["ID"],
            "stars": lvl["stars"],
            "Gcoins": lvl['Gcoins']
        })

        var epic = lvl['epic'] || 0;

        if (gameVersion==22) {
            if (lvl['legend']==1) epic=2;
            if (lvl['mythic']==1) epic=3;
        }

        var inside = [
            1, lvl["ID"], 2, lvl["name"], 5, lvl["version"],
            6, uid, 8, 10, 9, lvl["diff"], 10, lvl['downloads'],
            12, lvl['track'], 13, lvl['gVersion'], 14, likes,
            17, lvl['demon'], 43, lvl['demonDiff'], 25, lvl['autoDiff'] || 0,
            18, lvl['stars'], 19, lvl['featured'] || 0, 42, epic,
            45, lvl['objects'], 3, lvl['desc'], 15, lvl['length'],  30, lvl['orignal'],
            31, lvl['dualplayer'], 37, lvl['coins'], 38, lvl['Gcoins'], 39, lvl['starsReq'],
            46, 1, 47, 2, 40, lvl['ldm'], 35, lvl['song']
        ]

        inside = inside.join(":");

        var insusr = [
            uid, lvl['owner'], id
        ]

        if (lvl['song']!==0) {
            var inssong = [
                1, lvl['song'], 2, lvl["songname"], 3, lvl["authorid"], 
                4, lvl['author'], 5, lvl['size'], 6,,10,encodeURIComponent(lvl['link']), 7,, 8, 1
            ]
            
            var findinssong = songstr.find(o=>o==inssong.join("~|~")) || [];
            if (!findinssong || findinssong.length==0) songstr.push (inssong.join("~|~"));
        }


        var findinsusr = userstr.find(o=>o==insusr.join(":")) || [];
        if (!findinsusr || findinsusr.length==0) userstr.push (insusr.join(":"));

        levelstr.push (inside);
    }

    allstr.push(levelstr.join("|"));
    allstr.push (userstr.join("|"));

    if (Number(req.body.gameVersion) > 18) allstr.push (songstr.join("~:~"))
    allstr.push (pages.join(":"));

    var hased = "";

    for (let x = 0; x < levelmulstr.length; x++) {
        var id = levelmulstr[x]['ID'].toString();
        hased+=id[0] + id[id.length-1] + levelmulstr[x]['stars'] + levelmulstr[x]['Gcoins'];
    }

    allstr.push (tool.levelhash(levelmulstr));

    var result = allstr.join ("#");
    return res.send(result);
}


var download = (req, res) => {
    if (!req.body.levelID || req.body.levelID=="0") return res.send("-1");

    var featureID = 0;
    var levelID = req.body.levelID; 
    var type = 0;

    var event = 0;
    if (levelID=="-1") event = tools.dailyLevel(1).split(","), type = 1;
    else if (levelID=="-2") event = tools.dailyLevel(2).split(","), type = 2;
    else if (levelID=="-3") event = tools.dailyLevel(3).split(","), type = 3;

    if (event!==0) {
        levelID = event[0];
        featureID = event[1];
    }

    if (levelID==0) return res.send("-1");
    if (!tools.existsLevel(levelID)) return res.send("-1");
    
    var level = tools.getlevelinfo (levelID);

    var uid = user.getUIDByName(level['owner']);
    var download = tools.updateDownloadStat(levelID);
    var likes = level["dislikes"] + level['likes'];

    var leveldata = tools.readLevels(levelID).toString();
    leveldata = leveldata.replace(/\//g, '_');
    leveldata = leveldata.replace(/\+/g, '-');

    var desc = atob(level['desc']);
    desc = btoa(Buffer.from(desc.toString(), "utf-8"));

    var password = level['password'].toString();

    var gameVersion = req.body.gameVersion || 21;
    var binaryVersion = req.body.binaryVersion || 30;
    if (isNaN(gameVersion)) gameVersion = gameVersion[0];

    if (Number(gameVersion) > 18) {
        if (password.length!==0) password = tool.xorPass(password);
    } else desc = atob(desc);

    var readyoutput = [];

    var levelname = Buffer.from(level['name'].toString(), "utf-8");

    var createon = tool.timelang(level['createon']);
    var updateon = tool.timelang(level['updateon']);

    var epic = level['epic'] || 0;

    if (req.body.gameVersion && req.body.gameVersion==22) {
        if (level['legend']==1) epic=2;
        if (level['mythic']==1) epic=3;
    }

    var readydownload = [
        1, level["ID"], 2, levelname, 3, desc, 4, leveldata,
        5, level['version'], 6, uid, "8:10:9", level['diff'], 10, download, "11:1:12", level['track'],
        13, level['gVersion'], 14, likes, 17, level['demon'], 43, level['demonDiff'], 25, level['autoDiff'],
        18, level['stars'], 19, level['featured'] || 0, 42, epic, 45, level['objects'],
        15, level['length'], 30, level['original'], 31, level['dualplayer'], 28, createon, 29,
        updateon, 35, level['song'], 36, level['extras'], 37, level['coins'], 38, level['Gcoins'],
        39, level['starsReq'], 46, level['wt'], 47, level['wt2'], 48, level['settings'], 40, level['ldm'],
        27, password
    ]

    if (type==2) featureID+=100001;
    if (event!==0) readydownload.push(41,featureID);

    if (req.body.extras) readydownload.push (26, level['levelinfo']);
    var levelhash = tool.levelhash1(leveldata);

    var strings = [
        uid, level["stars"], level['demon'], level['ID'], level['Gcoins'] || 0, level['featured'] || 0, level['password'], featureID  
    ]

    string = tool.levelhash2(strings.join(","));
    readyoutput.push(readydownload.join(":"), levelhash, string);
    if (event!==0) readyoutput.push(`${user.getUIDByName(level['owner'])}:${level['owner']}:${user.getIDByName(level['owner'])}`);
    else if (binaryVersion==30) readyoutput.push(strings.join(","));
    
    var output = readyoutput.join("#");

    return res.send(output);
}

var deletelevel = (req, res) => {
    if (!req.body.levelID) return res.send("-1");

    var id = req.body.levelID;

    tools.deleteLevel(id);
    return res.send("1");
}

var ratingLevel = (req, res) => {
    if (!req.body.accountID) return res.send("-1");

    var id = req.body.accountID;
    var levelid = req.body.levelID || 0;
    var stars = req.body.stars || 0;
    var feature = req.body.feature || 0;    

    tools.rateLevel(id,levelid,stars,feature);
    return res.send("1");
}

var rateDemonLevel = (req, res) => {
    if (!req.body.accountID) return res.send("-1");
    
    var id = req.body.accountID;
    var levelid = req.body.levelID || 0;
    var demon = req.body.rating || 3;

    tools.rateDemon(id,levelid,demon);
    return res.send("1");
}

var getDaily = (req, res) => {
    var type = req.body.type || req.body.weekly || 0; type=Number(type)+1;
    var current = tools.dailyLevel(type).split(",");
    var idchg = 100001;

    eid = current[1];
    if (type==2) eid+=idchg;
    return res.send(`${eid}|${current[2]}`); 
}

var getGauntlets = (req, res) => {
    var gauntlet = [];
    var somestring = "";

    var gauntlets = tools.gauntlets();
    if (gauntlets.length==0) return res.send("-1");

    while (gauntlet.length < gauntlets.length) {
        var i = gauntlet.length;

        var lvl = gauntlets[i]['levels'].join(",");
        var tmp = [1,gauntlets[i]['ID'],3,lvl].join(":");
        gauntlet.push(tmp);
        somestring = `${gauntlets[i]['ID']+lvl}`;
    }

    output = [gauntlet.join("|"),tool.levelhash2(somestring)].join("#");
    return res.send(output);
}

var getpacks = (req, res) => {
    var onpacks = [];
    var page = req.body.page || 0;

    var packs = tools.levelpacks(page);
    if (packs.length==0) return res.send("-1");
    var hash = tool.levelpackhash(packs);

    while (onpacks.length < packs.length) {
        var i = onpacks.length;
        var l = packs[i];

        var color = l['color'];
        if (color=='none') color = l['rgb'];

        onpacks.push([1,l['ID'],2,l['name'],3,l['levels'].join(","),4,l['stars'],5,l['coins'],6,l['diff'],7,l['rgb'],8,color].join(":"))
    }
    
    var output = [onpacks.join("|"),`${packs.length}:${page*10}:10`,hash].join("#");
    return res.send(output);
}

module.exports = {
    uploads, getlevels, download, deletelevel, ratingLevel,
    rateDemonLevel, getDaily, getGauntlets, getpacks
}
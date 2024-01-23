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
    console.log(req.body);

    var levelmulstr = [];
    var level = tools.levelsearch(req.body);
    
    var pages = [level.total, level.offset*10, 10];
    var levelstr = [];
    var userstr = [];
    var songstr = [];

    var allstr = [];

    for (let n = 0; n < level.levels.length; n++) {
        var lvl = level.levels[n];

        var uid = user.getUIDByName(lvl["owner"]) || 0;
        var id = user.getIDByName(lvl['owner']) || 0;
        var likes = lvl['dislikes'] - lvl['likes'];
        var stardemon = 0;
        var starauto = 0;
        var starcoins = 0;

        levelmulstr.push ({
            "ID": lvl["ID"],
            "stars": lvl["stars"],
            "Gcoins": starcoins
        })

        var inside = [
            1, lvl["ID"], 2, lvl["name"], 5, lvl["version"],
            6, uid, 8, 10, 9, lvl["diff"], 10, lvl['downloads'],
            12, lvl['track'], 13, lvl['gVersion'], 14, likes,
            17, lvl['demon'], 43, lvl['demonDiff'], 25, lvl['autoDiff'] || 0,
            18, lvl['stars'], 19, lvl['featured'] || 0, 42, lvl['epic'] || 0,
            45, lvl['objects'], 3, lvl['desc'], 15, lvl['length'],  30, lvl['orignal'],
            31, lvl['dualplayer'], 37, lvl['coins'], 38, starcoins, 39, lvl['starsReq'],
            46, 1, 47, 2, 40, lvl['ldm'], 35, lvl['song']
        ]

        inside = inside.join(":");

        var insusr = [
            uid, lvl['owner'], id
        ]

        var getsong = misc.getSongs(lvl['song']);
        if (getsong) {
            var size = tool.size(getsong['size']).split(" ")[0];
            var inssong = [
                1, lvl['songid'], 2, getsong["name"], 3, getsong["authorid"], 
                4, getsong['author'], 5, size, 6,,10,encodeURIComponent(getsong['link']), 7,, 8, 1
            ]
            
            var findinssong = songstr.find(o=>o===inssong.join("~|~")) || [];
            if (!findinssong || findinssong.length==0) songstr.push (inssong.join("~|~"));
        }

        var findinsusr = userstr.find(o=>o==insusr.join(":")) || [];
        if (!findinsusr || findinsusr.length==0) userstr.push (insusr.join(":"));

        levelstr.push (inside);
    }

    allstr.push(levelstr.join("|"));
    allstr.push (userstr);

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
    console.log(req.body);
    if (!req.body.levelID || req.body.levelID=="0") return res.send("-1");
    if (!tools.existsLevel(req.body.levelID)) return res.send("-1");

    var level = tools.getlevelinfo (req.body.levelID);

    var uid = user.getUIDByName(level['owner']);
    var download = tools.updateDownloadStat(req.body.levelID);
    var likes = level["dislikes"] + level['likes'];

    var leveldata = tools.readLevels(req.body.levelID).toString();
    leveldata = leveldata.replace(/\//g, '_');
    leveldata = leveldata.replace(/\+/g, '-');

    var desc = atob(level['desc']);
    desc = btoa(Buffer.from(desc.toString(), "utf-8"));

    var featureID = 0;

    var password = level['password'].toString();

    if (Number(req.body.gameVersion) > 18) {
        if (password.length > 1) password = tool.xorPass(password);
    } else desc = atob(desc);

    var readyoutput = [];

    var levelname = Buffer.from(level['name'].toString(), "utf-8");

    var readydownload = [
        1, level["ID"], 2, levelname, 3, desc, 4, leveldata,
        5, level['version'], 6, uid, "8:10:9", level['diff'], 10, download, "11:1:12", level['track'],
        13, level['gVersion'], 14, likes, 17, level['demon'], 43, level['demonDiff'], 25, level['autoDiff'],
        18, level['stars'], 19, level['featured'] || 0, 42, level['epic'] || 0, 45, level['objects'],
        15, level['length'], 30, level['original'], 31, level['dualplayer'], 28, level['createon'], 29,
        level['updateon'], 35, level['song'], 36, level['extras'], 37, level['coins'], 38, level['GCoins'] || 0,
        39, level['starsReq'], 46, level['wt'], 47, level['wt2'], 48, level['settings'], 40, level['ldm'],
        27, password.replace(/=/g, '')
    ]

    if (req.body.extras) readydownload.push (26, level['levelinfo']);
    var levelhash = tool.levelhash1(leveldata);

    var strings = [
        uid, level["stars"], level['demon'], level['ID'], level['Gcoins'] || 0, level['featured'] || 0, level['password'], featureID  
    ]

    strings = tool.levelhash2(strings.join(","));
    readyoutput.push(readydownload.join(":"), levelhash, strings);
    var output = readyoutput.join("#");

    res.send(output);
}

var deletelevel = (req, res) => {
    if (!req.body.levelID) return res.send("-1");

    var id = req.body.levelID;

    tools.deleteLevel(id);
    return res.send("1");
}

module.exports = {
    uploads, getlevels, download, deletelevel
}
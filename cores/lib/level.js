const tools = require ("./tools");
const db = require ('../database/database');
const user = require ('./user');
const social = require ('./social');

const levelID = 1000;

module.exports.saveLevels = (data, levelid=0) => {
    const fs = require ("fs");
    const path = require ('path');

    if (levelid==0) return false;

    var savespath = path.join(global.system.mainpath, global.config.datapath);
    var datapath = path.join (savespath, `/l/${levelid}.gz`);

    if (!fs.existsSync(path.join(savespath, '/l'))) fs.mkdirSync(path.join(savespath, '/l'));

    var compress = tools.compressGzip(data.replace(/=/g, ''));

    fs.writeFileSync (datapath, compress);
    return true;
}

module.exports.readLevels = (levelid=0) => {
    const fs = require('fs');
    const path = require('path');

    if (levelid==0) return false;

    var savespath = path.join(global.system.mainpath, global.config.datapath);
    var datapath = path.join (savespath, `/l/${levelid}.gz`);

    if (!fs.existsSync(datapath)) datapath = path.join (savespath, `/${levelid}.gz`);
    if (!fs.existsSync(datapath)) return false;

    var data = fs.readFileSync(datapath);

    var decompress = tools.decompressGzip (data);
    return decompress;
}

module.exports.existsLevel = (levelid=0) => {
    levelid=Number(levelid);
    if (levelid==0) return false;
    
    var level = db.select("level").filter("ID", levelid);
    if (!level || level.length==0) return false;
    return level[0];
}

module.exports.createLevel = (data) => {    
    if (!data.levelString) return "-1";
    var target = [
        "name", "owner", "desc", "gVersion", "bVersion",
        "version", "length","password", "starsReq", "coins", "objects", "song",
        "track", "original", "dualplayer", "createon", "updateon", "ldm", "wt", "wt2", "unlisted",
        "autoDiff", "levelinfo", "unlisted2", "settings", "extras"
    ];

    
    var time = tools.datetime();

    var defextra = [];
    for (let i = 1; i <= 55; i++) {
        defextra.push("0");
    }

    data.levelName = Buffer.from(data.levelName.toString(), "utf-8");
    data.levelDesc = atob(data.levelDesc);
    data.levelDesc = Buffer.from(data.levelDesc.toString(), "utf-8");
    data.levelDesc = btoa(data.levelDesc);

    defextra = defextra.join("_");
    
    var push = [
        data.levelName || 'level', data.userName || 'unknown', data.levelDesc || '', data.gameVersion || 21, data.binaryVersion || 34,
        data.levelVersion || 1, data.levelLength || 0, data.password || 0, data.requestedStars || 1, 
        data.coins || 0, data.objects || 1, data.songID || 0, data.audioTrack || 0, data.original || 0, 
        data.twoPlayer || 0, time, time, data.ldm || 0, data.wt || 0, data.wt2 || 0, data.unlisted1 || data.unlisted || 0,
        data.auto || 0, data.levelInfo || '', data.unlisted2 || 0, data.settingsString || '', data.extraString || defextra
    ];

    var count = db.select('level').count;
    if (count==0) {
        target.push ("ID");
        push.push(levelID);
    }
    
    var readyinsert = db.insert('level').target(target);
    readyinsert.add(push);
    var newid = readyinsert.save();
    
    this.saveLevels(data.levelString, newid)
    return newid;
}


module.exports.updateLevel = (data) => {
    if (data.levelID=="0") return "-1";
    if (!data.levelString) return "-1";
    var target = [
        "desc", "gVersion", "bVersion",
        "version", "length","password", "starsReq", "coins", "objects", "song",
        "track", "original", "dualplayer", "updateon", "ldm", "wt", "wt2", "unlisted",
        "autoDiff", "levelinfo", "unlisted2", "settings", "extras"
    ];

    var readyupdate = db.update('level').target("ID", data.levelID);

    var time = tools.datetime();

    var defextra = [];
    for (let i = 1; i <= 55; i++) {
        defextra.push(0);
    }

    defextra = defextra.join("_");

    var push = [
        data.levelDesc || '', data.gameVersion || 21, data.binaryVersion || 34,
        data.levelVersion || 1, data.levelLength || 0, data.password || 0, data.requestedStars || 0, 
        data.coins || 0, data.objects || 1, data.songID || 0, data.audioTrack || 0, data.original || 0, 
        data.twoPlayer || 0, time, data.ldm || 0, data.wt || 0, data.wt2 || 0, data.unlisted1 || data.unlisted || 0,
        data.auto || 0, data.levelInfo || '', data.unlisted2 || 0, data.settingsString || '', data.extraString || defextra
    ];

    for (let i = 0; i < target.length; i++) {
        readyupdate.set(target[i], push[i]);
    }
    
    this.saveLevels(data.levelString, data.levelID)
    return data.levelID;
}

module.exports.updateDownloadStat = (id) => {
    var download = 1;
    var level = this.getlevelinfo(id);
    var every = [];

    download += Number(level["downloads"] || 0);
    var up = db.update('level').target("ID", id);

    up.set("downloads", download);
    up.save();
    return download;
}

module.exports.getlevelinfo = (id) => {
    if (id==0) return false;

    var level = this.existsLevel(id);

    return level || [];
}

module.exports.trendingalgo = (data=[]) => {
    var time = this.sparedatetime();
    for (let i = 0; i < data.length; i++) {
        var gettime 
    }
}

module.exports.levelsearch = (params) => {
    var prms = {
        target: ["*"],
        state: ""
    }

    var count = 0;
    var search = params.str || '';
    var type = params.type || 0;
    var diff = params.diff || "-";

    var lenFilter = "";
    var diffFilter = "";
    var order = "ORDER BY likes DESC"
    var state = [];

    var options = {
        stars: params.star || 0,
        epic: params.epic || 0,
        featured: params.featured || 0,
        undone: params.uncompleted || 0,
        done: params.onlyCompleted || 0,
        coins: params.coins || 0,
        dualPlayer: params.twoPlayer || 0,
        nostars: params.noStar || 0,
        original: params.original || 0,
        song: params.song || 0,
        customsong: params.customSong || 0
    }

    if (type==0 || type==12) {
        if (search!=="") {
            if (!isNaN(search)) state.push(`ID = ${search}`)
            else state.push(`name LIKE '%${search}%'`)
        }
    } else if (type==1) order = "ORDER BY downloads DESC";
    else if (type==11 || (options.stars==1 && options.nostars==0)) state.push(`stars > 0`)
    else if (type==6 || type==17 || options.featured==1) state.push("featured > 0")
    else if (type==16 || options.epic==1) state.push("epic > 0");
    else if (type==13) {
        var getids = social.getfriendlist(params.accountID);
        getids.push (params.accountID);

        var getname = [];
        for (let o = 0; o < getids.length; o++) {
            getname.push(`'${user.getNameByID(getids[o])}'`);
        }

        state.push(`owner IN (${getname.join(",")})`);
    } else if (type==7) state.push("objects > 9999");

    if (options.coins==1) state.push("coins > 0")
    if (options.nostars==1 && options.stars==0) state.push("stars < 1")

    if (diff=="-1") state.push(`diff = 0 AND demon = 0 AND autoDiff = 0`);
    else if (diff=="-3") state.push(`diff = 0 AND demon = 0 AND autoDiff = 1`);
    else if (diff=="-2") {
        state.push(`diff = 0 AND demon = 1 AND autoDiff = 0`);

        if (params.demonFilter) {
            var df = params.demonFilter || 0;
            var demonFilter = tools.demonDiffID(df);
            state.push(`demonDiff = ${demonFilter}`);
        }
    } else if (diff!=="-") {
        state.push(`demon = 0 AND autoDiff = 0`);
        if (diff.includes(",")) {
            var sdf = diff.split(",");
            var df = [];
            for (let o = 0; o < sdf.length; o++) {
                df.push (tools.diffID(sdf[o]));
            }
            df = df.join(",");
            state.push(`diff IN (${df})`)
        } else {
            state.push(`diff = ${tools.diffID(diff)}`)
        }
    }

    if (params.len!=="-") {
        var len = params.len;
        if (len.includes(",")) state.push(`length IN (${len})`);
        else state.push (`length = ${len}`);
    }

    if (state.length > 0) prms.state = `WHERE ${state.join(" AND ")}`;

    console.log(prms.state);
    
    count = db.select('level', {
        target: ['count(*)'],
        state: prms.state
    }).count;
    
    prms.state +=` ${order} LIMIT 10 OFFSET ${params.page}*10`;
    var level = db.select('level', prms);
    var levels = level.all;

    return {
        levels,
        total: count,
        offset: params.page
    }
}

module.exports.deleteLevel = (id) => {
    db.delete('level', {
        state: `WHERE ID = ${id}`
    }).run();

    tools.createCache(`${id}.gz`, `l/${id}.gz`)

    return true;
}
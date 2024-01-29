const tools = require ("./tools");
const db = require ('../database/database');
const user = require ('./user');
const social = require ('./social');
const { getUserPerms, getrole } = require("./misc");

const levelID = 1000;

module.exports.saveLevels = (data, levelid=0) => {
    const fs = require ("fs");
    const path = require ('path');

    if (levelid==0) return false;

    var savespath = path.join(global.system.mainpath, global.config.datapath);
    var datapath = path.join (savespath, `/l/${levelid}.gz`);

    if (!fs.existsSync(path.join(savespath, '/l'))) fs.mkdirSync(path.join(savespath, '/l'));

    var compress = tools.compressGzip(data);

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
    
    var level = db.select("level", {
        state: `WHERE ID=${levelid}`
    });

    if (level.count==0) return false;
    return level.all[0];
}

module.exports.createLevel = (data) => {    
    if (!data.levelString) return "-1";
    var target = [
        "name", "owner", "desc", "gVersion", "bVersion",
        "version", "length","password", "starsReq", "coins", "objects", "song",
        "track", "original", "dualplayer", "createon", "updateon", "ldm", "wt", "wt2", "unlisted",
        "autoReq", "levelinfo", "unlisted2", "settings", "extras"
    ];
    
    var time = Date.now();
    
    var push = [
        data.levelName || 'level', data.userName || 'unknown', data.levelDesc || '', data.gameVersion || 21, data.binaryVersion || 34,
        data.levelVersion || 1, data.levelLength || 0, data.password || 0, data.requestedStars || 1, 
        data.coins || 0, data.objects || 1, data.songID || 0, data.audioTrack || 0, data.original || 0, 
        data.twoPlayer || 0, time, time, data.ldm || 0, data.wt || 0, data.wt2 || 0, data.unlisted1 || data.unlisted || 0,
        data.auto || 0, data.levelInfo || '', data.unlisted2 || 0, data.settingsString || '', data.extraString || ''
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
        "autoReq", "levelinfo", "unlisted2", "settings", "extras"
    ];

    var readyupdate = db.update('level').target("ID", data.levelID);

    var time = Date.now();

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

// this should be makes confused
module.exports.levelsearch = (params) => {
    var prms = {
        target: ["*"],
        state: ""
    }

    var count = 0;
    var page = params.page || 0;
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
    else if (type==5) {
        state.push (`owner = '${user.getNameByID(params.accountID)}'`);
        order = `ORDER BY ID DESC`;
    } else if (type==11 || (options.stars==1 && options.nostars==0)) state.push(`stars > 0`)
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

    if (params.len) if (params.len!=="-") {
        var len = params.len;
        if (len.includes(",")) state.push(`length IN (${len})`);
        else state.push (`length = ${len}`);
    }

    if (state.length > 0) prms.state = `WHERE ${state.join(" AND ")}`;
    
    count = db.select('level', {
        target: ['count(*)'],
        state: prms.state
    }).count;
    
    prms.state +=` ${order} LIMIT 10 OFFSET ${page}*10`;

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

module.exports.promoteLevelStar = (id=0, stars=0) => {
    if (id==0) return false;
    if (!this.existsLevel(id)) return false;

    var rate = db.update('level').target('ID', id);
    rate.set('stars', stars);
    rate.save();

    return true;
}

module.exports.promoteLevel = (id=0, pro={}) => {
    if (id==0) return false;
    if (!this.existsLevel(id)) return false;

    var rate = db.update('level').target('ID',id);

    if (pro.stars || pro.stars!==0) {
        var diff = 0, auto = 0, demon = 0, demonDiff = 0;
        if (pro.stars > 9) {
            diff = 0;
            demon = 1;
            if (pro.demonDiff) demonDiff = pro.demonDiff;  
        } else if (pro.stars > 1) {
            diff = tools.diffByStars(pro.stars);
        } else if (pro.stars > 0) {
            diff = 0;
            auto = 1;
        }

        rate.set('stars', pro.stars);
        rate.set('diff', diff);
        rate.set('demon', demon);
        rate.set('autoDiff', auto);
        rate.set('demonDiff', demonDiff);
    }

    if (pro.feature || pro.legend || pro.epic || pro.mythic) {
        var feature = 0, epic = 0, legend = 0, mythic = 0;
    
        if (pro.mythic || pro.mythic > 0) mythic = 1;
        else if (pro.legend || pro.legend > 0) legend = 1;
        else if (pro.epic || pro.epic > 0) epic = 1;
        else if (pro.feature || pro.feature > 0) feature = 1;
        
        rate.set ('featured', feature);
        rate.set ('epic', epic);
        if (pro.verifycoins) rate.set('Gcoins', pro.verifycoins);
        // rate.set ('legend', legend);
        // rate.set ('mythic', mythic);
    }

    rate.save();
    return true;
}

module.exports.rateLevel = (id=0, lvlid=0, starRate=1, feature=0) => {
    var role = getUserPerms(id, 'hasMod');
    var modlevel = 0;

    if (role) modlevel = getrole(role)['modlevel'];

    var modrate = 1;
    var guestrate = 0;
    if (global.mods) {
        modrate = global.mods.modrate;
        guestrate = global.mods.guestrate;
    }

    if (modlevel > 0) this.promoteLevel(lvlid, {
        stars: starRate,
        feature: feature,
        verifycoins: 1
    });

    var record = db.insert('ratedLevel').target(['whoID','levelID','hasMod','starRate','featureRate','whenRated']);
    record.add([id,lvlid,modlevel,starRate,feature,Date.now()]);
    record.save();

    return true;
}

module.exports.rateDemon = (id=0, lvlid=0, demonRate=0) => {
    var role = getUserPerms(id, 'hasMod');
    var modlevel = 0;

    if (role) modlevel = getrole(role)['modlevel'];

    var modrate = 1;
    var guestrate = 0;
    if (global.mods) {
        modrate = global.mods.modrate;
        guestrate = global.mods.guestrate;
    }

    if (modlevel > 0) this.promoteLevel(lvlid, {
        stars: 10,
        demon: 1,
        demonDiff: tools.demonDiffID(demonRate)
    });

    var record = db.insert('ratedLevel').target(['whoID','levelID','hasMod','demonRate','whenRated']);
    record.add([id,lvlid,modlevel,demonRate,Date.now()]);
    record.save();

    return true;
}

module.exports.addEventLevel = (id=0, type=1) => {
    var target = ['levelID','type','whenSet'];
    var data = [id,type,Date.now()];
    
    var insert = db.insert('eventlevel').target(target);
    insert.add(data);
    insert.save();

    return true;
}

module.exports.currentEventLevel = (type=1) => {
    var current = db.select('eventlevel', {
        target: ['levelID','EID'],
        state: `WHERE type=${type} AND status=1 ORDER BY EID ASC LIMIT 1`
    });
    
    if (current.count==0) return '0,0';
    return current.all[0]['levelID'] + "," + current.all[0]['EID'];
}

module.exports.getevent = (eid=0) => {
    if (eid==0) return false;
    var event = db.select('eventlevel', { state: `WHERE EID=${eid}`});
    if (event.count==0) return false;

    return event.all[0];
}
        
module.exports.dailyLevel = (type=1) => {
    var day = 7;

    console.log(type);

    var typename = 'daily';
    if (type==2) typename = 'weekly';
    else if (type==3) typename = 'event';

    var timehold = tools.timeholder(typename);
    var tmr = timehold.time;

    if (timehold.time==0) {
        var ontime = new Date();
        day-=(ontime.getDay()+1);
        
        tmr = ontime.setHours(24,0,0,0);
        var date = ontime.getDate();
        if (type==2) tmr = ontime.setDate(date+day);

        var current = this.currentEventLevel(type).split(',');
        timehold = tools.timeholder(typename,tmr,current[1]);
    } else {
        var eid = timehold.value;
        var getevent = this.getevent(eid);
        var current = [getevent['levelID'] || 0,eid];
    }
    

    var left = tmr - Date.now();
    left/=1000;

    current.push (Math.floor(left));
    
    if (current[1]!==0) if (left < 0) {
        var up = db.update('eventlevel').target("EID", current[1]);
        up.set('status', 0);
        up.save();
        current = this.currentEventLevel(type).split(",");

        var ontime = new Date();
        var newday = 7 - (ontime.getDay()+1);
        
        tmr = ontime.setHours(24,0,0,0);
        var newdate = ontime.getDate();
        if (type==2) tmr = ontime.setDate(newdate+newday);
        
        tools.timeholder(typename,tmr,current[1]);

        left = tmr - Date.now();
        current.push(left);
    }

    return current.join(",");
}
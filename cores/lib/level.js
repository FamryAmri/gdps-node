const tools = require ("./tools");
const db = require ('../database/database');
const user = require ('./user');
const social = require ('./social');
const { getUserPerms, getrole } = require("./misc");
const search = require ('./search/level');

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

    var push = [
        data.levelDesc || '', data.gameVersion || 21, data.binaryVersion || 34,
        data.levelVersion || 1, data.levelLength || 0, data.password || 0, data.requestedStars || 0, 
        data.coins || 0, data.objects || 1, data.songID || 0, data.audioTrack || 0, data.original || 0, 
        data.twoPlayer || 0, time, data.ldm || 0, data.wt || 0, data.wt2 || 0, data.unlisted1 || data.unlisted || 0,
        data.auto || 0, data.levelInfo || '', data.unlisted2 || 0, data.settingsString || '', data.extraString || ''
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

module.exports.levelsearch = (params) => {
    var level = [];
    var count = 0;
    var offset = params.page || 0;
    var search = params.str || '';
    var type = params.type || 0;

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
        legend: params.legendary || 0,
        mythic: params.mythic || 0,
        customsong: params.customSong || 0,
        ldm: params.ldm || 0
    }
    
    var diff = params.diff || "-";
    var len = params.len || "-";

    // types (efficient)
    if (type==21) var {level,count} = this.search.eventlevel(type=1,offset);
    else if (type==22) var {level,count} = this.search.eventlevel(type=2,offset);
    else if (type==6 || type==17) var {level,count} = this.search.featuredlist(offset);
    else if (type==16) var {level,count} = this.search.hotlist(offset);
    else if (type==27) var {level,count} = this.search.sentlevel(offset);
    else if (type==5) var {level,count} = this.search.yourlevel(params.accountID, offset);
    else if (type==11) var {level,count} = this.search.awardlevel(offset);
    else {
        var order = 'order by level.ID desc'
        var state = [];

        // other types
        if (type==0 || type==15) {
            order = 'order by level.likes desc'
            if (search) {
                if (!isNaN(search)) state.push (`level.ID = ${search}`);
                else state.push (`level.name LIKE '%${search}%'`);
            }
        } else if (type==7) {
            state.push ('objects > 9999');
        } else if (type==13) {
            var friends = this.search.friendslevel(params.accountID);
            state.push (`accounts.ID (${friends.users.join(",")})`);
        } else if (type==3) {  
            const time = new Date();
            var trendtime = time.setHours(0,0,0,0);

            state.push (`level.createon > ${trendtime}`,'level.downloads > 999', 'level.likes > 999');
        } else if (type==1) order = 'order by level.downloads desc'
        else if (type==2) order = 'order by level.likes desc'

        // optional search
        var optional = [];
        if (options.featured > 0) optional.push('NOT level.featured = 0');
        if (options.epic > 0) optional.push ('NOT level.epic = 0');
        if (options.legend > 0) optional.push ('NOT level.legend = 0');
        if (options.mythic > 0) optional.push ('NOT level.mythic = 0');
        if (options.nostars > 0) optional.push ('level.stars = 0');
        if (options.dualPlayer > 0) state.push ('NOT level.dualplayer = 0');
        if (options.original > 0) state.push ('level.original = ""');
        if (options.song > 0 && options.song < 23) state.push (`track = ${options.song-1}`);
        if (options.customsong > 0) optional.push (`song = ${options.song}`);
        if (options.coins > 0) optional.push ('NOT coins = 0', 'NOT Gcoins = 0');
        if (options.ldm > 0) optional.push ('NOT ldm = 0');

        if (optional.length > 0) state.push(`(${optional.join(" OR ")})`);

        // difficulty
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

        // length
        if (params.len) if (params.len!=="-") {
            var len = params.len;
            if (len.includes(",")) state.push(`length IN (${len})`);
            else state.push (`length = ${len}`);
        }

        // limitation list
        var onlimit = ` LIMIT 10 OFFSET ${offset}*10`

        // allstate
        var allstate = "";
        if (state.length > 0) allstate = ` WHERE ${state.join(" AND ")}`

        // in querying on database
        var level = db.select('level', {
            target: ['level.*', 'accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname','songs.author','songs.authorID','songs.size','songs.link'],
            state: `LEFT JOIN accounts ON level.owner = accounts.username LEFT JOIN scores ON scores.ID = accounts.ID LEFT JOIN songs ON songs.ID = level.song${allstate} ${order}${onlimit}`
        }).all;

        var count = db.select('level', {
            target: ['count(level.ID)'],
            state: `LEFT JOIN accounts ON level.owner = accounts.username LEFT JOIN scores ON scores.ID = accounts.ID LEFT JOIN songs ON songs.ID = level.song ${allstate}`
        }).count;
    }

    return {
        levels: level,
        total: count,
        offset
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
    
        if (pro.mythic && pro.mythic > 0) mythic = 1;
        else if (pro.legend && pro.legend > 0) legend = 1;
        else if (pro.epic && pro.epic > 0) epic = 1;
        else if (pro.feature && pro.feature > 0) feature = 1;

        rate.set ('featured', feature);
        rate.set ('epic', epic);
        if (pro.verifycoins) rate.set('Gcoins', pro.verifycoins);
        rate.set ('legend', legend);
        rate.set ('mythic', mythic);
    }

    rate.save();
    return true;
}

module.exports.rateLevel = (id=0, lvlid=0, starRate=1, feature=0, suggest=true) => {
    var modlevel = 0;
    
    if (suggest) {
        var role = getUserPerms(id, 'hasMod');
        if (role) modlevel = getrole(role)['modlevel'];
    }

    var modrate = 1;
    var guestrate = 0;
    if (global.mods) {
        modrate = global.mods.modrate;
        guestrate = global.mods.guestrate;
    }

    var rate = {
        stars: starRate,
        verifycoins: 1
    }

    if (feature==4) rate.mythic = 1;
    else if (feature==3) rate.legend = 1;
    else if (feature==2) rate.epic = 1;
    else rate.feature = feature; 

    if (modlevel > 0) this.promoteLevel(lvlid, rate);

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
    
    if (left < 0) {
        var up = db.update('eventlevel').target("EID", current[1]);
        up.set('status', 0);
        if (current[1]!==0) up.save();
        current = this.currentEventLevel(type).split(",");
        
        var ontime = new Date();
        var newday = 7 - (ontime.getDay()+1);
        
        tmr = ontime.setHours(24,0,0,0);
        var newdate = ontime.getDate();
        if (type==2) tmr = ontime.setDate(newdate+newday);
        
        tools.timeholder(typename,tmr,current[1]);

        left = tmr - Date.now();
    }
    
    left/=1000;
    current.push (Math.floor(left));

    return current.join(",");
}

module.exports.createGauntlet = (levels=[]) => {
    if (levels.length==0) return false;

    var insert = db.insert('gauntlets').target(['levels','createon']);
    insert.add([levels.join(","),Date.now()]);
    insert.save();
    return true;
}

module.exports.gauntlets = () => {
    var gauntlet = db.select('gauntlets',{
        state: `ORDER BY ID ASC`
    });

    var output = [];
    var count = 0;

    if (gauntlet.count==0) return output;

    while (count < gauntlet.count) {
        var id = gauntlet.all[count]['ID'];
        var levels = gauntlet.all[count]['levels'].split(",");

        count+=1;

        if (levels.length==5 || levels[4]!==0) {
            output.push ({
                ID: id,
                levels
            })
        }
    }   

    return output;
}

module.exports.createLevelPack = (levelpack={}) => {
    if (!levelpack.levels) return false;
    var {levels,diff,stars,color,rgb} = levelpack;

    if (!levelpack.color) color = 'none';
    if (!levelpack.rgb) rgb = '255,255,255';
    if (levels.length==0) return false;

    var insert = db.insert('levelpacks').target(['levels', 'stars', 'diff', 'color2', 'rgb', 'createon']);
    insert.add([levels.join(","),stars,diff || 1,color,rgb,Date.now()]);
    insert.save();
    return true;
}


module.exports.levelpacks = (page) => {
    var levelpack = db.select('levelpacks', {
        state: `order by ID asc limit 10 offset ${page}*10`
    });

    var levelpacks = [];
    var l = levelpack.all;

    while (levelpacks.length < levelpack.count) {
        var i = levelpacks.length;
        var lv = l[i]['levels'].split(",") || [];

        levelpacks.push ({
            ID: l[i]['ID'] + 100 || 0,
            name: l[i]['name'] || 'Unknown',
            stars: l[i]['stars'] || 0,
            coins: l[i]['coins'],
            levels: lv,
            diff: l[i]['diff'],
            rgb: l[i]['rgb'],
            color: l[i]['color2'] || 'none',
            createon: l[i]['createon'] || Date.now()
        })
    }

    return levelpacks;
}

module.exports.search = search;
const db = require ('../database/database');
const user = require ('./user');
const social = require ('./social');
const tools = require ('./tools');
const XOR = require ('../XOR');
const xor = new XOR();

module.exports.leaderboard = (type='relative', id=accID, count=100) => {
    count = Number (count);
    var params = {}
    var data = [];

    if (type=='top') params.state = `ORDER BY stars DESC LIMIT ${count}`;
    if (type=='creators') params.state = `ORDER BY CPoints LIMIT ${count}`;
    if (type=='relative') params.state = `WHERE ID = ${id}`;

    var score = [];
    if (type!=='friends') score = db.select('scores', params).all;
    else {
        var flist = social.getfriendlist(id);

        score.push ({
            ID: id
        })

        if (flist.length!==0) for (let i = 0; i < flist.length; i++) {
            score.push ({
                ID: flist[i]['id']
            })
        }
    }

    if (score.length <= count) count = score.length; 
    if (score.length==0) return [];
    for (let i = 0; i < count; i++) {
        var users = user.getUsers(score[i].ID);
        var push = {}


        push.top = i+1;
        push.username = user.getNameByUID(users.info['UID']);
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

    if (type=='friends') {
        data = data.sort((a,b)=>{
            return b['stars'] - a['stars'];
        })
    }

    return data;
}

module.exports.createrole = (name='role', perms='hasMod', modlevel=1, color='255,255,255') => {
    var createrole = db.insert('roles').target(['name','permissions','modlevel', 'colors']);
    createrole.add([name,perms,modlevel,color]);
    createrole.save();
    return true;
}

module.exports.deleterole = (id=0) => {
    if (id==0) return false;
    db.delete('roles', {
        state: `WHERE ID=${id}`
    }).run();

    return true;
}

module.exports.getrole = (id=0) => {
    if (id==0) return false;
    var roleinfo = db.select('roles', {
        target: ['name','permissions','modlevel','colors'],
        state: `WHERE ID=${id}`
    });

    if (roleinfo.count==0) return false;
    var role = roleinfo.all[0];
    role.permissions = role.permissions.split(",");

    return role;
}

module.exports.getRolesFromAcc = (id=0) => {
    if (id==0) return [];
    var roleassign = db.select('roleassign', {
        target: ['roleID'],
        state: `WHERE accountID=${id}`
    });

    if (roleassign.count==0) return [];
    var output = [];

    while (output.length < roleassign.count) output.push(roleassign.all[output.length]['roleID']);
    return output;
}

module.exports.hasroleperms = (id=0,perms) => {
    var roleinfo = this.getrole(id);
    if (!roleinfo) return false;
    
    var perms = roleinfo.permissions.filter(o=>o==perms);
    if (perms.length!==0) return true;
    return false;
}

module.exports.getUserPerms = (id=0,perms='hasMod') => {
    if (id==0) return false;

    var role = this.getRolesFromAcc(id);
    if (role.length==0) return 0;

    var o = 0;
    var onrole = 0;
    while (o < role.length) {
        if (this.hasroleperms(role[o],perms)) onrole=role[o];
        o+=1;        
    }

    return onrole;
}

module.exports.createSong = (name,author,authorID,size,link,id=0) => {
    var ready = ['name','author','authorID','size','link'];
    var value = [name,author,authorID,size,link]

    if (id!==0) {
        ready.push('ID');
        value.push(id);
    }

    var insert = db.insert('songs').target(ready);
    insert.add(value);
    return insert.save();
}

module.exports.getSongs = (id=0) => {
    if (id==0) return {};
    var song = db.select("songs", {
        state: `WHERE ID = ${id}`
    });

    if (song.count==0) return {};
    var s = song.all[0];

    var songinfo = {
        songid: s['ID'],
        name: s['name'],
        authorname: s['author'],
        authorid: s['authorID'],
        size: s['size'],
        download: s['link']
    }
    return songinfo;
}

module.exports.chestRewards = (id=0, open=0) => {
    if (id==0) return [];
    var prepare = db.select('chestcount', {
        state: `WHERE ID=${id}`
    });

    var current = Date.now();
    var check = {}

    if (prepare.count==0) {
        var newchest = db.insert('chestcount').target(['ID','bigTime', 'miniTime']);
        newchest.add([id,current,current]);
        newchest.save();

        prepare.all = [{
            bigTime: current,
            miniTime: current
        }]
    }

    check = prepare.all[0];
    var miniTime = check.miniTime - current;
    var bigTime = check.bigTime - current;

    if (miniTime < 1) miniTime = 0;
    if (bigTime < 1) bigTime = 0;

    var bigOpen = check.bigOpen || 0;
    var miniOpen = check.miniOpen || 0;
    
    var rewards = global.chestrewards;
    
    var miniSetTime = rewards.mini.setTime;
    var bigSetTime = rewards.big.setTime;

    if (open==1) {
        miniOpen+=1;
        if (miniTime > 1) return [];
        var newtime = current + miniSetTime;

        var update = db.update('chestcount').target('ID', id);
        update.set('miniOpen', miniOpen);
        update.set('miniTime', newtime);
        update.save();

        miniTime = newtime - current;
    } else if (open==2) {
        bigOpen+=1;
        if (bigTime > 1) return [];
        var newtime = current + bigSetTime;

        var update = db.update('chestcount').target('ID', id);
        update.set('bigOpen', bigOpen);
        update.set('bigTime', newtime);
        update.save();

        bigTime = newtime - current;
    }

    var miniDm = rewards.mini.diamond;
    var miniOrb = rewards.mini.orb;
    var miniKey = rewards.mini.key;

    var miniShard = rewards.mini.shard;
    var mset = Math.floor(Math.random() * miniShard.length);

    var bigDm = rewards.big.diamond;
    var bigOrb = rewards.big.orb;
    var bigKey = rewards.big.key;

    var bigShard = rewards.big.shard;
    var bset = Math.floor(Math.random() * bigShard.length);

    return [
        {
            diamonds: tools.rand(miniDm.min, miniDm.max),
            orbs: tools.rand(miniOrb.min, miniOrb.max),
            keys: tools.rand(miniKey.min, miniKey.max),
            shard: miniShard[mset] || 1,
            open: miniOpen,
            timeleft: Math.floor(miniTime/1000)
        },
        {
            diamonds: tools.rand(bigDm.min, bigDm.max),
            orbs: tools.rand(bigOrb.min, bigOrb.max),
            keys: tools.rand(bigKey.min, bigKey.max),
            shard: bigShard[bset] || 1,
            open: bigOpen,
            timeleft: Math.floor(bigTime/1000)
        }
    ]
}

module.exports.quests = () => {
    var date = new Date();
    var tmr = date.setHours(24,0,0,0);

    var timeleft = tmr - Date.now();
    timeleft = Math.floor(timeleft/1000);

    var gdbefore = new Date('August 12, 2013'); // date release of geometry dash
    var gdrelease = gdbefore.setHours(24);

    var quest = global.quests;
    
    var makeiD = Date.now() - gdrelease;
    makeiD = Math.floor(makeiD/10000);
    var iD = [];

    while (iD.length < 3) {
        var questID = makeiD+iD.length;
        var randQ = Math.floor (Math.random() * quest.length);

        iD.push({
            questID: questID,
            type: quest[randQ]['type'],
            name: quest[randQ]['name'],
            amount: quest[randQ]['amount'],
            rewards: quest[randQ]['rewards']
        })
    }

    return {
        timeleft: timeleft,
        list: iD || []
    }
}
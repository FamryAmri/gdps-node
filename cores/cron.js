const times = 120;

function upcp (cp,who=0) {
    const db = require ('./database/database');
    var getcp = db.select('scores',{
        target: ['CPoints AS CP'],
        state: `WHERE ID=${who}`
    });

    if (cp==getcp.all[0]['CP']) return false;
    var up = db.update('scores').target('ID',who);
    up.set('CPoints', cp);
    up.save();
    return true;
}

function alluser (offset=0,limit=10) {
    const db = require ('./database/database');
    var getusers = db.select('scores',{
        target: ['scores.ID', 'accounts.username'],
        state: `LEFT JOIN accounts ON scores.ID = accounts.ID LIMIT ${limit} OFFSET ${offset}*${limit}`
    });

    return getusers.all;
}

function calculateCP (who) {
    const db = require ('./database/database');
    var getlevel = db.select('level', {
        target: ['featured','epic','legend','mythic'],
        state: `WHERE owner = '${who}' AND (NOT featured = 0 OR NOT epic = 0 OR NOT legend = 0 OR NOT mythic = 0)`
    });
    
    var t = 0;
    if (getlevel.count==0) return t;
    var f = getlevel.all;

    f.forEach (l => {
        if (l.featured==1) t+=1;
        else if (l.epic==1) t+=2;
        else if (l.legend==1) t+=3;
        else if (l.mythic==1) t+=4;
    });

    return t;
}

function topleadUP (offset=0,limit=10) {
    const db = require ('./database/database');
    var top = db.select('scores', {
        target: ['ID'],
        state: `ORDER BY stars DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    });

    var topc = (offset*limit) + 1;
    var users = top.all;
    users.forEach(user=>{
        var up = db.update('scores').target('ID',user['ID']);
        up.set('top',topc);
        up.save();

        topc+=1;
    });

    if (top.count!==limit) return false;
    return true;
}

function sumavgs (arr=[]) {
    var t = 0;
    for (let i = 0; i < arr.length; i++) t+=arr[i];
    return Math.floor(t/arr.length);
}

var c = 0, nc = false;
var t = 0, tc = false;

var pings = {
    t: [],
    c: []
}

function cronrun () {
    var r = 0;
    var a = 0;

    if (!nc) {
        a = Date.now();
        var users = alluser(c);
        users.forEach(user => {
            var cp = calculateCP(user.username);
            if (cp!==0) upcp(cp,user['ID']);
        });

        pings.c.push(Date.now()-a);

        if (users.length!==10) c=0, nc=true;
        else c+=1;
        r+=1;
    }

    if (!tc) {
        a = Date.now();
        var top = topleadUP(t);

        pings.t.push(Date.now()-a);

        if (top) t+=1;
        else t=0, tc=true;
        r+=1;
    }

    if (r < 1) {
        var tm = new Date();

        var h = tm.getHours().toString().padStart(2, '0');
        var m = tm.getMinutes().toString().padStart(2, '0');
        var s = tm.getSeconds().toString().padStart(2, '0');

        clearInterval(cron);
        var tp = sumavgs(pings.t) || 1;
        var cp = sumavgs(pings.c) || 1;
        
        console.log(`[${h}:${m}:${s}]:`, `CRON done | t=${tp}ms c=${cp}ms`)
        nc=false, tc=false;
        pings.t = [], pings.c = [];

        setTimeout(()=>{
            cron = setInterval(cronrun, 10000);
        }, times*1000);
    }
}

var cron = setInterval(cronrun, 10000);
const db = require ('../../cores/database/database');
const tools = require ('../../cores/lib/tools');
const ffmpeg = require ('fluent-ffmpeg');
const ytdl = require ('ytdl-core');

function checklogin (req, res) {
    var user = req.session.user;
    var check = db.select ('accounts', {
        target: ['password'],
        state: `WHERE username = '${user}' AND admin = 1`
    });

    if (check.count==0) return res.send("Error: Permission Denied! <a href='/admin/logout'>Login</a>");
    else {
        var verify = tools.verifypassword(check.all[0]['password'],req.session.pass);
        if (!verify) return res.send("Error: Unauthorized! <a href='/admin/logout'>Login</a>");
        else return false;
    }
}

function forcelogin (req) {
    req.session.user = "famry";
    req.session.pass = "123456";
}

var index = (req, res) => {
    forcelogin(req);
    if (checklogin(req, res)) return;

    var time = new Date ();
    var day =7 - (time.getDay()+1);

    time.setHours(0,0,0,0);
    var week = time.setDate(time.getDate()-day);

    var level = db.select ("level", {
        target: ["count(ID)"]
    });

    var acc = db.select ("accounts", {
        target: ['count(ID)']
    });

    var lw = db.select ('level', {
        target: ['count(ID)'],
        state: `WHERE createon > ${week}`
    });

    var aw = db.select ('accounts', {
        target: ['count(ID)'],
        state: `WHERE createon > ${week}`
    })

    res.render('index', {
        status: {
            level: level.count,
            accounts: acc.count,
            levelweek: lw.count,
            accweek: aw.count,
        },
        users: req.session.user || "user?",
        logout: true
    });
}

// roles
var delrole = (req, res) => {
    if (checklogin(req, res)) return;

    var id = req.query.delete;
    db.delete('roles', {
        state: `WHERE ID = ${id}`
    }).run();

    return res.redirect('/admin/roles');
}

var roles = (req, res) => {
    var page = req.query.p || 1;
    page = (page - 1)*5;
    
    if (req.query.delete > 0) delrole (req, res); 
    if (req.query.add==1) return res.render('roles/post', {
        users: req.session.user || "user?",
        logout: true
    });
    
    var roles = db.select("roles", {
        state: `LIMIT 5 OFFSET ${page}`
    });
    

    var total = db.select ('roles', { target: ['count(ID)']}).count;

    res.render('roles/main', {
        page: req.query.p, total,
        roles: roles.all,
        users: req.session.user || "user?",
        logout: true
    });
}

var postrole = (req, res) => {
    if (checklogin(req, res)) return;

    var colors = tools.hextoRGB(req.body.colors);
    var permissions = req.body.perms;

    if (permissions[0].length < 1) permissions = permissions.join(",");

    var insert = db.insert ('roles').target(['name','permissions','modlevel','colors']);
    insert.add([req.body.name,permissions,req.body.level,colors]);
    insert.save();

    return roles(req,res);
}

// assign roles
var signrole = (req, res) => {
    var page = req.query.p || 1;

    if (req.query.add==1) {
        var error = req.query.er || false;
        var roles = db.select ('roles', {
            target: ['name', 'ID'],
        }).all;

        return res.render ('signroles/post', {
            error, role: req.query.role || false,
            roles, user: req.query.user || false,
            users: req.session.user || "user?",
            logout: true
        })
    } else if (req.query.delete!=="") {
        var user = req.query.delete;

        var check = db.select ('accounts', {
            target: ['ID'],
            state: `WHERE username = '${user}'`
        });

        if (check.count!==0) db.delete('roleassign', {
            state: `WHERE accountID = ${check.all[0]['ID']}`
        }).run();
    }

    var assign = db.select ('roleassign', {
        target: ['accounts.username AS name','roleassign.roleID AS roleID'],
        state: `LEFT JOIN accounts ON roleassign.accountID = accounts.ID LIMIT 5 OFFSET ${page-1}*5`
    });

    var total = db.select ('roleassign', {
        target: ['count(roleID)'],
        state: `LEFT JOIN accounts ON roleassign.accountID = accounts.ID`
    }).count;

    res.render ('signroles/main', {
        sign: assign.all,
        page: page, total,
        users: req.session.user || "user?",
        logout: true
    });
}

var signrolepost = (req, res) => {
    if (checklogin(req, res)) return;

    var user = req.body.username;
    var role = req.body.role;
    var err = 0;

    var check = db.select ('accounts', {
        target: ['ID'],
        state: `WHERE username = '${user}'`
    });

    if (check.count==0) err+=1;
    if (role==0) err+=2;

    if (err > 0) return res.redirect('?add=1&er='+err);
    var id = check.all[0]['ID'];

    check = db.select ('roleassign', {
        state: `WHERE accountID = '${id}'`
    }).count;

    var r;
    if (check==0) {
        r = db.insert ('roleassign').target(['accountID','roleID'])
        r.add ([id,role]);
    } else {
        r = db.update ('roleassign').target('accountID',id);
        r.set ('roleID',role);
    }

    r.save();

    return signrole(req,res);
}

// songs
var songs = (req, res) => {
    var page = req.query.p || 1;

    if (req.query.add==1) return res.render ('songs/post',{
        users: req.session.user || "user?",
        logout: true
    })

    var songs = db.select('songs', {
        target: ['ID', 'author', 'name', 'size', 'link'],
        state: `ORDER BY ID ASC LIMIT 5 OFFSET ${page-1}*5`
    })

    var total = db.select ('songs', {
        target: ['count(ID)']
    }).count || 0;

    return res.render ('songs/main', {
        songs: songs.all, page, total,
        users: req.session.user || "user?",
        logout: true
    })
}

var songpost = (req, res) => {
    return res.send("-1");
}

var checkvalid = (req, res) => {
    
}

// login
var login = (req, res) => {
    return res.render ('login', {
        users: "user?",
        logout: false,
        er: req.query.er || 0
    })
}

var loginpost = (req, res) => {
    var user = req.body.username || false;

    if (user) {
        var check = db.select ('accounts', {
            target: ['password'],
            state: `WHERE username = '${user}' AND admin = 1`
        });

        if (check.count==0) return res.redirect ('?er=2')
        else {
            var verify = tools.verifypassword(check.all[0]['password'],req.body.password);
            if (!verify) return res.redirect ('?er=1')
            else {
                req.session.user = user;
                req.session.pass = req.body.password;
                return res.redirect('/admin');
            }
        }
    }
    return res.send("-1");
}

// logout
var logout = (req, res) => {
    req.session.destroy();
    return res.redirect ('/admin/login')
}

var test = (req, res) => {
    res.render ('test');
}

module.exports = {
    login, loginpost, logout,
    index, test, 
    roles, postrole, signrole, signrolepost,
    songs
}
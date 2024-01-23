const db = require ('../database/database');
const user = require ('./user');
const social = require ('./social');
const tools = require ('./tools');

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
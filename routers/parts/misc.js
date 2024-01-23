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

module.exports = {
    getuserscore, getsong
}
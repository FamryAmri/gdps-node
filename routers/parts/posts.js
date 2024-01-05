const postTools = require ('../../cores/lib/posts');
const tools = require ('../../cores/lib/user');
const tool = require ('../../cores/lib/tools');
const acc = require ('../../cores/lib/account');

// but this doesnt
var getpost = (req, res) => {
    if (!req.body.accountID) return res.send("#0:0:0");
    var gameVersion = req.body.gameVersion || '21';

    var target = req.body.accountID;
    if (gameVersion=='22') target = target[1];
    var offset = req.body.page || 0;
    var uid = tools.getUidByID (target);
    var { posts, total } = postTools.getposts(target, offset);
    if (total==0) return res.send("#0:0:0");

    var onpost = [];

    for (let o = 0; o < posts.length; o++) {
        var post = posts[o];

        var tmp = [
            2, post.message, 3, uid, 4, post.likes, "5~0~7~0~9",
            tool.timelang(post.whenPost), 6, post.postid
        ]
        onpost.push (tmp.join("~"));
    }

    var output = `${onpost.join("|")}#${total}:${offset}:10`
    return res.send(output);
}

var deletepost = (req, res) => {
    var postid = req.body.commentID || 0;
    var id = req.body.accountID || 0;

    if (!postid) return res.send("-1");

    var pass = false;

    if (id==0) return res.send("-1");
    if (req.body.gjp) if (acc.verifygjp(id,req.body.gjp)) pass = true;
    if (req.body.gjp2) if (acc.verifygjp2(id,req.body.gjp2)) pass = true;

    if (!pass) return res.send("-1");

    postTools.deletepost(postid);
    return res.send("1");
}

var createpost = (req, res) => {
    var name = req.body.userName || false;
    var message = req.body.comment || false;

    if (!name) return res.send("-1");
    if (!message) return res.send("-1");
    
    var id = tools.getIDByName(name.toLowerCase());

    var pass = false;

    if (id==0) return res.send("-1");
    if (req.body.gjp) if (acc.verifygjp(id,req.body.gjp)) pass = true;
    if (req.body.gjp2) if (acc.verifygjp2(id,req.body.gjp2)) pass = true;

    if (!pass) return res.send("-1");

    postTools.createpost(id, message);
    return res.send("1");
}

module.exports = {
    getpost, createpost, deletepost
}
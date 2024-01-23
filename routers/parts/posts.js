const postTools = require ('../../cores/lib/posts');
const tools = require ('../../cores/lib/user');

var getpost = (req, res) => {
    if (!req.body.accountID) return res.send("#0:0:0");
    
    var offset = req.body.page || 0;
    var uid = tools.getUidByID (req.body.accountID);
    var { posts, total } = postTools.getposts(req.body.accountID, offset);
    if (total==0) return res.send("#0:0:0");

    var onpost = [];

    for (let o = 0; o < posts.length; o++) {
        var post = posts[o];

        var tmp = [
            2, post.message, 3, uid, 4, post.likes, "5~0~7~0~9",
            post.whenPost, 6, post.postid
        ]
        onpost.push (tmp.join("~"));
    }

    var output = `${onpost.join("|")}#${total}:${offset}:10`
    return res.send(output);
}

var deletepost = (req, res) => {
    var postid = req.body.commentID || 0;

    if (!postid) return res.send("1");

    postTools.deletepost(postid);
    return res.send("1");
}

var createpost = (req, res) => {
    var name = req.body.userName || false;
    var message = req.body.comment || false;

    if (!name) return res.send("-1");
    if (!message) return res.send("-1");
    
    var id = tools.getIDByName(name.toLowerCase());

    postTools.createpost(id, message);
    return res.send("1");
}

var likepost = (req, res) => {
    console.log(req.body);
    return res.send("-1");
}

module.exports = {
    getpost, createpost, deletepost
}
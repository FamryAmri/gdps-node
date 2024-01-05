var db = require ('../database/database'); 
var sql = require('better-sqlite3')(db.sqlfile);

module.exports.getposts = (id=0, offset=0) => {
    var posts = db.select('userpost', {
        target: ["*"],
        state: `WHERE ID = ${id} LIMIT 10 OFFSET ${offset}*10`
    });

    var total = db.select('userpost', {
        target: ["count(*)"],
        state: `WHERE ID = ${id}`
    });

    var allposts = [];

    if (total.count > 0) {
        var arr = {};
        for (let o = 0; o < posts.all.length; o++) {
            var post = posts.all[o];

            arr.likes = post['likes'] || 0;
            arr.message = post['postmessage'];
            arr.whenPost = post['whenPost'];
            arr.postid = post['postID'] || 0;

            allposts.push(arr);
        }
    }

    return {
        posts: allposts,
        total: total
    }
}

module.exports.createpost = (id, message) => {
    var inpost = db.insert('userpost').target(["ID", "postmessage", "whenPost"]);

    inpost.add([id, message, Date.now()]);
    inpost.save();

    return true;
}

module.exports.deletepost = (id) => {
    db.delete('userpost', {
        state: `WHERE postID = ${id}`
    }).run();

    return true;
}

module.exports.postlikes = (id) => {
    sql.prepare(`UPDATE userpost SET likes = likes + 1 WHERE postID = ${id}`).run();
    return true;
}

module.exports.postdislikes = (id) => {
    sql.prepare(`UPDATE userpost SET dislikes = dislikes + 1 WHERE postID = ${id}`).run();
    return true;
}
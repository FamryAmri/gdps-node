const db = require ('../../database/database');

// type 21 & 22
module.exports.eventlevel = (type=1, offset=0, limit=10) => {
    var leftjoin = "LEFT JOIN level ON eventlevel.levelID = level.ID LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN songs ON songs.ID = level.song LEFT JOIN scores ON scores.ID = accounts.ID"
    var event = db.select('eventlevel', {
        target: ["level.*", 'accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname', 'songs.author', 'songs.authorid', 'songs.link', 'songs.size'],
        state: `${leftjoin} WHERE eventlevel.type=${type} AND status=0 ORDER BY eventlevel.EID DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('eventlevel', {
        target: ["count(*)"],
        state: `WHERE status=0 AND type=${type}`
    }).count;

    return {
        level: event, count
    }
}

// type 27
module.exports.sentlevel = (offset=0,limit=10) => {
    var leftjoin = "LEFT JOIN level ON ratedLevel.levelID = level.ID LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN songs ON songs.ID = level.song LEFT JOIN scores ON scores.ID = accounts.ID"
    var level = db.select('ratedLevel', {
        target: ['distinct levelID, level.*','accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname', 'songs.author', 'songs.authorid', 'songs.link', 'songs.size'],
        state: `${leftjoin} WHERE level.stars = 0 ORDER BY ratedLevel.ID DESC,level.createon LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('ratedLevel', {
        target: ['count(distinct levelID)'],
        state: `LEFT JOIN level ON ratedLevel.levelID = level.ID WHERE level.stars = 0`
    }).count;

    return {
        level, count
    }
}

// type 11
module.exports.awardlevel = (offset=0,limit=10) => {
    var leftjoin = "LEFT JOIN level ON ratedLevel.levelID = level.ID LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN songs ON songs.ID = level.song LEFT JOIN scores ON scores.ID = accounts.ID";
    var level = db.select('ratedLevel', {
        target: ['distinct levelID, level.*', 'accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname', 'songs.author', 'songs.authorid', 'songs.link', 'songs.size'],
        state: `${leftjoin} WHERE NOT level.stars = 0 ORDER BY ratedLevel.ID DESC,level.createon LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('ratedLevel', {
        target: ['count(distinct levelID)'],
        state: `LEFT JOIN level ON ratedLevel.levelID = level.ID WHERE NOT level.stars = 0`
    }).count;

    return {
        level, count
    }
}

// type 6 & 17
module.exports.featuredlist = (offset=0,limit=10) => {
    var leftjoin = "LEFT JOIN ratedLevel ON ratedLevel.levelID = level.ID LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN songs ON songs.ID = level.song LEFT JOIN scores ON scores.ID = accounts.ID";
    var level = db.select('level', {
        target: ['distinct ratedLevel.levelID', 'level.*', 'accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname', 'songs.author', 'songs.authorid', 'songs.link', 'songs.size'],
        state: `${leftjoin} WHERE NOT featured = 0 OR NOT epic = 0 OR NOT legend = 0 OR NOT mythic = 0 ORDER BY ratedLevel.ID DESC,level.createon DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('level',{
        target: ['count(distinct ratedLevel.levelID)'],
        state: `LEFT JOIN ratedLevel ON ratedLevel.levelID = level.ID WHERE NOT featured = 0 OR NOT epic = 0 OR NOT legend = 0 OR NOT mythic = 0`
    }).count;

    return {
        level,count
    }
}

// type 3
module.exports.trendinglist = (offset=0,limit=10) => {
    const time = new Date();
    var trendtime = time.setHours(0,0,0,0);

    var level = db.select('level', {
        state: `WHERE createon > ${trendtime} AND downloads > 1000 AND likes > 1000 ORDER BY downloads DESC, likes DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('level',{
        target: ['count(*)'],
        state: `WHERE createon > ${trendtime} AND downloads > 1000 AND likes > 1000`
    }).count;

    return {level,count}
}

// type 16
module.exports.hotlist = (offset=0,limit=10) => {
    var leftjoin = "LEFT JOIN ratedLevel ON ratedLevel.levelID = level.ID LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN songs ON songs.ID = level.song LEFT JOIN scores ON scores.ID = accounts.ID";
    var level = db.select('level', {
        target: ['distinct ratedLevel.levelID', 'level.*','accounts.ID AS accountID', 'scores.UID', 'songs.name AS songname', 'songs.author', 'songs.authorid', 'songs.link', 'songs.size'],
        state: `${leftjoin} WHERE NOT epic = 0 OR NOT legend = 0 OR NOT mythic = 0 ORDER BY ratedLevel.ID DESC,level.createon DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('level',{
        target: ['count(distinct ratedLevel.levelID)'],
        state: `LEFT JOIN ratedLevel ON ratedLevel.levelID = level.ID WHERE NOT epic = 0 OR NOT legend = 0 OR NOT mythic = 0`
    }).count;

    return {
        level,count
    }
}

// type 5
module.exports.yourlevel = (id, offset=0, limit=10) => {
    var leftjoin = `LEFT JOIN accounts ON accounts.username = level.owner LEFT JOIN scores ON scores.ID = accounts.ID LEFT JOIN songs ON songs.ID = level.song`
    var level = db.select ('level',{
        target: ['accounts.ID AS accountID','level.*','scores.UID','songs.name AS songname','songs.author','songs.link','songs.authorID'],
        state: `${leftjoin} WHERE accounts.ID = ${id} ORDER BY ID DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).all;

    var count = db.select('level', {
        target: ['count(*)'],
        state: `${leftjoin} WHERE accounts.ID = ${id} ORDER BY level.ID DESC LIMIT ${limit} OFFSET ${offset}*${limit}`
    }).count

    return {level,count}
}

// type 13
module.exports.friendslevel = (id) => {
    var users = [];
    var count = 0;

    var union = db.select('friends', {
        target: ['oneID AS ID'],
        isUnion: true,
        state: `WHERE accept = 1 AND (oneID = ${id} OR twoID = ${id})`
    });

    var friend = db.select('friends', {
        union, target: ['twoID AS ID'],
        state: `WHERE accept = 1 AND (oneID = ${id} OR twoID = ${id})`
    });

    if (friend.count!==0) {
        count = friend.count;
        while (users.length < count) {
            var i = users.length;
            users.push (friend.all[i]['ID']);
        }
    }

    return {users,count}
}
const tablesSQLITE = [
    {
        name: "accounts",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "username",
                type: "TEXT",
                params: "NOT NULL"
            },
            {
                name: "email",
                type: "TEXT",
                params: "NOT NULL"
            },
            {
                name: "password",
                type: "TEXT",
                params: "NOT NULL"
            },
            {
                name: "secretGJP",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "secretGJP2",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "admin",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "saveon",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "level",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "name",
                type: "TEXT",
                params: "DEFAULT 'level'"
            },
            {
                name: "owner",
                type: "TEXT",
                params: "DEFAULT 'Owner'"
            },
            {
                name: "desc",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "gVersion",
                type: "INTEGER",
                params: "DEFAULT 20"
            },
            {
                name: "bVersion",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "version",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "length",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "downloads",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "likes",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "password",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "stars",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "autoDiff",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {   
                name: "demon",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "demonDiff",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "diff",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "autoReq",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "starsReq",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            
            {
                name: "coins",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "Gcoins",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "featured",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "epic",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "legend",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "mythic",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "objects",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "ldm",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "song",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "track",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "original",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "dualplayer",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "updateon",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "settings",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "unlisted",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "unlisted2",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "wt",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "wt2",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "extras",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "levelinfo",
                type: "TEXT",
                params: "DEFAULT ''"
            }
        ]
    },
    {
        name: "likes",
        intable: [
            {
                name: "likeID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "like",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "type",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "itemID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "updateon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "gauntlets",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "levels",
                type: "TEXT",
                params: "DEFAULT '0,0,0,0,0'"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "levelpacks",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "name",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "levels",
                type: "TEXT",
                params: "DEFAULT '0,0,0,0,0,0'"
            },
            {
                name: "stars",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "coins",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "diff",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "color2",
                type: "TEXT",
                params: "DEFAULT 'none'"
            },
            {
                name: "rgb",
                type: "TEXT",
                params: "DEFAULT '255,255,255'"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "eventlevel",
        intable: [
            {
                name: 'EID',
                type: 'INTEGER',
                params: 'PRIMARY KEY AUTOINCREMENT'
            },
            {
                name: 'levelID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'type',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'status',
                type: 'INTEGER',
                params: 'DEFAULT 1'
            },
            {
                name: 'whenSet',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            }
        ]

    },
    {
        name: 'scorelevel',
        intable: [
            {
                name: 'sID',
                type: 'INTEGER',
                params: 'PRIMARY KEY AUTOINCREMENT'
            },
            {
                name: 'levelID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'score',
                type: 'TEXT',
                params: 'DEFAULT "0:0"'
            },
        ]
    },
    {
        name: 'levelCompleted',
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: 'levelID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'status',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            }
        ]
    },
    {
        name: 'chestcount',
        intable: [
            {
                name: 'ID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'miniTime',
                type: 'INTEGER',
                params: 'DEFAULT 1000',
            },
            {
                name: 'bigTime',
                type: 'INTEGER',
                params: 'DEFAULT 1000'
            },
            {
                name: 'miniOpen',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'bigOpen',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            }
        ]
    },
    {
        name: 'roleassign',
        intable: [
            {
                name: 'accountID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            },
            {
                name: 'roleID',
                type: 'INTEGER',
                params: 'DEFAULT 0'
            }
        ]
    },
    {
        name: "roles",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT",
            },
            {
                name: "name",
                type: "TEXT",
                params: "DEFAULT 'rolename'"
            },
            {
                name: "permissions",
                type: "TEXT",
                params: "NOT NULL"
            },
            {
                name: "modlevel",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "colors",
                type: "TEXT",
                params: "NOT NULL"
            }
        ]
    },
    {
        name: "ban",
        intable: [
            {
                name: "target",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "type",
                type: "TEXT",
                params: "DEFAULT 'block'"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "scores",
        intable: [
            {
                name: "UID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT",
            },
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "diamond",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "moon",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "Scoins",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "Gcoins",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "stars",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "demons",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "CPoints",
                type: "INTEGER",
                params: "DEFAULT 0",
            }
        ]
    },
    {
        name: "usericons",
        intable: [
            {
                name: "UID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "iconCube",
                type: "INTEGER",
                params: "DEFAULT 1",
            },
            {
                name: "iconShip",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconBall",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconUFO",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconWave",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconRobot",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconSpider",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconSwing",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "iconOnGlow",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "iconPColor",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "iconSColor",
                type: "INTEGER",
                params: "DEFAULT 3"
            },
            {
                name: "iconTColor",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "iconExplosion",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "iconPrimary",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "special",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "userinfo",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "UID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "youtube",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "x",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "twitch",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "allowMessage",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "allowFriendReq",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "showCommentHistory",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "messages",
        intable: [
            {
                name: "msgID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "subject",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "message",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "oneID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "twoID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "seen",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "whenSent",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "userpost",
        intable: [
            {
                name: "postID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT",
            },
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "postmessage",
                type: "TEXT",
                params: "DEFAULT '--blank--'"
            },
            {
                name: "likes",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "whenPost",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "levelcomments",
        intable: [
            {   
                name: "commentID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "levelID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "ID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "likes",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "comment",
                type: "TEXT",
                params: "DEFAULT ''"
            },
            {
                name: "percent",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "spam",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "songs",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "name",
                type: "TEXT",
                params: "DEFAULT 'Unknown'"
            },
            {
                name: "author",
                type: "TEXT",
                params: "DEFAULT 'Unknown'"
            },
            {
                name: "authorID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "size",
                type: "TEXT",
                params: "DEFAULT '0.0'"
            },
            {
                name: "link",
                type: "TEXT",
                params: "DEFAULT 'https://audio.ngfiles.com/0/1_newgrounds_consin.mp3'"
            }
        ]
    },
    {
        name: "ratedLevel",
        intable: [
            {
                name: "ID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT",
            },
            {
                name: "whoID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "levelID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "hasMod",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "starRate",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "demonRate",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "featureRate",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "whenRated",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "follows",
        intable: [
            {
                name: "UID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "toUID",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "friends",
        intable: [
            {
                name: "reqID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "oneID",
                params: "DEFAULT 0",
                type: "INTEGER",
            },
            {
                name: "twoID",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "whisper",
                type: "TEXT",
                params: "DEFAULT 'Hello'"
            },
            {
                name: "accept",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "new1",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "new2",
                type: "INTEGER",
                params: "DEFAULT 1"
            },
            {
                name: "whenReq",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "blocks",
        intable: [
            {
                name: "blockID",
                type: "INTEGER",
                params: "PRIMARY KEY AUTOINCREMENT"
            },
            {
                name: "oneID",
                type: "INTEGER",
                params: "DEFAULT 0"
            },
            {
                name: "twoID",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "whenBlock",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "timeholder",
        intable: [
            {
                name: "name",
                type: "TEXT",
                params: "DEFAULT 'daily'"
            },
            {
                name: 'value',
                type: "TEXT",
                params: "DEFAULT '0'"
            },
            {
                name: "time",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    },
    {
        name: "developers",
        intable: [
            {
                name: "target",
                type: "INTEGER",
                params: "DEFAULT 0",
            },
            {
                name: "keys",
                type: "TEXT",
                params: "NOT NULL",
            },
            {
                name: "createon",
                type: "INTEGER",
                params: "DEFAULT 0"
            }
        ]
    }
]

module.exports = tablesSQLITE;
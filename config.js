var configuration = {
    port: 8000,
    datapath: "/data",
}

var chestrewards = {
    mini: {
        diamond: {
            max: 15,
            min: 5
        },
        orb: {
            min: 200,
            max: 600
        },
        key: {
            min: 0,
            max: 2
        },
        shard: [1,2,3,4,5,6],
        setTime: 120000 // 1 s = 60000 ms    
    },
    big: {
        diamond: {
            min: 50,
            max: 100,
        },
        orb: {
            min: 2000,
            max: 6000
        },
        key: {
            min: 1,
            max: 10
        },
        shard: [1,2,3,4,5,6],
        setTime: 60 * 60000
    }
}

var quests = [
    {
        type: 3,
        name: "Star Collector",
        amount: 10,
        rewards: 15
    },
    {
        type: 2,
        name: "Coin Finder",
        amount: 6,
        rewards: 10
    },
    {
        type: 1,
        name: "Orb Master",
        amount: 1000,
        rewards: 20
    }
]

var mods = {
    modrate: 1,
    guestrate: 10
}

module.exports = {
    configuration,
    chestrewards,
    quests, mods
}
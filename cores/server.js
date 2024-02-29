const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const path = require ('path');
const exps = require ('express-session');

const limit = global.payloadlimit;

app.use(bodyParser.json({ limit }));
app.use(bodyParser.urlencoded({ limit, extended: true }));

app.engine ('.ejs', require ('ejs').__express);
app.set('view engine', 'ejs');

app.use(exps({
    secret: "xFcaSvG",
    resave: false,
    saveUninitialized: true
}));

app.use('/songs', express.static(path.join(global.system.mainpath, "/data/s")));

app.use('/admin',require ('../routers/admin'));

var dbname = global.databasepath;

for (let i = 0; i < dbname.length; i++) {
    app.use(`/${dbname[i]}/accounts/database/accounts`, require ('../routers/accounts'));
    app.use(`/${dbname[i]}/accounts`, require ('../routers/accounts'));
    app.use(`/${dbname[i]}`, require ("../routers/database"));
}

app.get("/", (req, res)=>{
    res.send("OK");
});

app.use((req, res) => {
    res.status(404).send("-1");
});

var t = new Date();
var h = t.getHours().toString().padStart(2, '0');
var m = t.getMinutes().toString().padStart(2, '0');
var s = t.getSeconds().toString().padStart(2, '0');

app.listen(global.config.port, console.log(`[${h}:${m}:${s}]:`,`Server started on port ${global.config.port}`));
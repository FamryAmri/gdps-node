const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const path = require ('path');

const limit = global.payloadlimit;

app.use(bodyParser.json({ limit }));
app.get("/favicon.ico", (req, res)=> res.sendFile(path.join(global.system.mainpath, "/favicon.ico")));
app.use(bodyParser.urlencoded({ limit, extended: true }));

app.use('/songs', express.static(path.join(global.system.mainpath, "/data/s")));

var dbname = ['database','databases'];

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

app.listen(global.config.port, console.log(`Server started: ${global.config.port}`));
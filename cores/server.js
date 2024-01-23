const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const path = require ('path');

app.use(bodyParser.json());
app.get("/favicon.ico", (req, res)=> res.sendFile(path.join(global.system.mainpath, "/favicon.ico")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/songs', express.static(path.join(global.system.mainpath, "/data/s")));

app.use("/database/accounts/database/accounts", require ('../routers/accounts'));
app.use("/database/accounts", require ('../routers/accounts'));
app.use("/database", require ("../routers/database"));

app.get("/", (req, res)=>{
    res.send("OK");
});

app.use((req, res) => {
    res.status(404).send("-1");
});

app.listen(global.config.port, console.log(`Server started: ${global.config.port}`));
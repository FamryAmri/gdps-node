const { Router } = require('express');
const app = Router();

const o = require ('./parts/accounts');

app.post("/loginGJAccount.php", o.login);
app.post("/registerGJAccount.php", o.register);
app.post("/backupGJAccount:v.php", o.saves);
app.post("/syncGJAccount:v.php",o.loads);

module.exports = app;
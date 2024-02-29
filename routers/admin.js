const { Router } = require ('express');
const app = Router();
const admin = require ('./parts/admin');

app.get ('/login', admin.login);
app.post ('/login', admin.loginpost)
app.get ('/logout', admin.logout);

app.get ('/', admin.index);
app.get ('/status', admin.index);
app.get ('/test', admin.test);

app.get ('/roles', admin.roles);
app.post ('/roles', admin.postrole);
app.get ('/roleassign', admin.signrole);
app.post ('/roleassign', admin.signrolepost);

app.get ('/songs', admin.songs);

module.exports = app;
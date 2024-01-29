const { Router } = require('express');
const app = Router();

const user = require ('./parts/users');
const levels = require ('./parts/levels');
const social = require ('./parts/social');
const posts = require ('./parts/posts');
const misc = require ('./parts/misc');

app.post("/getGJUsers:v.php", user.getusersearch);
app.post ("/getGJUserList:v.php", user.getuserlist);
app.post("/getGJUserInfo:v.php", user.getuser);
app.post("/updateGJUserScore:v.php", user.updateuser);
app.post("/updateGJAccSettings:v.php", user.updateuserinfo);

app.post("/getGJScores:v.php", misc.getuserscore)

app.post("/getGJAccountComments:v.php", posts.getpost);
app.post('/uploadGJAccComment:v.php', posts.createpost);
app.post('/deleteGJAccComment:v.php', posts.deletepost);

app.post("/uploadGJLevel:v.php", levels.uploads);
app.post("/getGJLevels:v.php", levels.getlevels);
app.post("/downloadGJLevel:v.php", levels.download);
app.post('/deleteGJLevelUser:v.php', levels.deletelevel);
app.post("/suggestGJStars:v.php", levels.ratingLevel);
app.post("/rateGJDemon:v.php", levels.rateDemonLevel);

app.post('/getGJDailyLevel.php', levels.getDaily);

app.post("/acceptGJFriendRequest:v.php", social.acceptReq);
app.post ("/uploadFriendRequest:v.php", social.addreq);
app.post ("/deleteGJFriendRequests:v.php", social.remFriend);
app.post ("/getGJFriendRequests:v.php", social.getreq);
app.post ("/removeGJFriend:v.php", social.remFriend);

app.post ("/blockGJUser:v.php", social.blockuser);
app.post ("/unblockGJUser:v.php", social.unblockuser);

app.post ("/getGJMessages:v.php", social.getmessage);
app.post("/uploadGJMessage:v.php", social.sentmessage);
app.post("/downloadGJMessage:v.php", social.readmessage);
app.post("/deleteGJMessages:v.php", social.removemessage);

app.post("/uploadGJComment:v.php", social.sentcomment);
app.post("/getGJComments:v.php", social.getcomment);
app.post("/getGJCommentHistory.php", social.getcomment);

app.post("/requestUserAccess.php", misc.getmod);
app.post ('/getGJRewards.php', misc.getchest);
app.post ('/getGJChallenges.php', misc.getquest);
app.post ("/getGJSongInfo.php", misc.getsong);
app.all("/getAccountURL.php", (req, res)=>{
    var fullurl = `${req.protocol}://${req.hostname}`

    res.send(fullurl);
})

module.exports = app;
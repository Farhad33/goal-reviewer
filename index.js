var cookieSession = require('cookie-session');
var express = require('express');
var qs = require('querystring');
var app = express();
var request = require('request');
var CLIENT_ID = process.env.CLIENT_ID
var CLIENT_SECRET = process.env.CLIENT_SECRET
var REDIRECT_URI = process.env.REDIRECT_URI
var token = null

var oauth2 = require('simple-oauth2')({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});

// var token = req.session.access_token;
app.set('trust proxy', 1)

var port = (process.env.PORT || 5000);

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: REDIRECT_URI,
  scope: 'repo',
  state: '3(#0/!~'
});

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function (req, res) {
//   if (!req.session.access_token){
//     res.send('<h1>Hello</h1><a href="/auth">Log in with Github</a>');
//     return;
//   }else{
//     res.sendfile('public/index.html')
//   }

// });

app.get('/', function (req, res) {
  if (!req.session.access_token){
    res.send('<h1>Hello</h1><a href="/auth">Log in with Github</a>');
  }else{
  token = req.session.access_token
  res.send('<h1>welcome back</h1><a href="/logout">Logout</a>');

  // use the token req.session.access_token to get the users github profil info
  var user_endpoint = "https://api.github.com/user?access_token="
  var issues_endpoint = "https://api.github.com/repos/GuildCrafts/web-development-js/issues?access_token="

  console.log('TOKEN: ' + token)

  request({
    method: 'GET',
    url: user_endpoint + token,
    headers: {'user-agent': 'node.js'}
  }, function(error, userInfoResponse){
    // res.setHeader('Content-Type', 'application/json');
    // res.send(userInfoResponse.body);
   })
}
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
  res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/oauth_callback', function (req, res) {
  oauth2.authCode.getToken({
    code: req.query.code,
    redirect_uri: REDIRECT_URI
  }, function(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    var response = oauth2.accessToken.create(result);
    var access_token = qs.parse(response.token).access_token
    req.session.access_token = access_token
    res.redirect('/')
  });
});

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
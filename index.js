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


var SECRET_OAUTH_STATE = '3(#0/!~'
// Authorization uri definition
var authorizationURI = oauth2.authCode.authorizeURL({
  redirect_uri: REDIRECT_URI,
  scope: 'repo user admin:org',
  state: SECRET_OAUTH_STATE,
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
  res.redirect(authorizationURI);
});

app.get('/logout', function (req, res) {
  req.session = null;
  res.redirect('/');
});

// Callback service parsing the authorization token and asking for the access token
app.get('/oauth_callback', function (req, res) {
  if (req.query.state !== SECRET_OAUTH_STATE){
    throw new Error('HACKERS!!!')
  }
  oauth2.authCode.getToken({
    code: req.query.code,
    redirect_uri: REDIRECT_URI
  }, function(error, result) {
    if (error) { 
      console.log('Access Token Error', error.message); 
      throw error;
    }
    var response = oauth2.accessToken.create(result);
    var access_token = qs.parse(response.token).access_token
    req.session.access_token = access_token
    res.redirect('/')
  });
});

app.get('/api/profile', function(req, res){
  if (!req.session.access_token){
    res.json({
      error: 'not logged in',
      notLoggedIn: true,
      authorizationURI: authorizationURI,
    })
    return
  }
  getProfile(req.session.access_token, function(error, profile){
    if (error) {
      res.json({error: error})
    }else{
      res.json(profile);
    }
  });
})


app.get('/api/goals', function(req, res){
  // if (!req.session.access_token) return renderAccessDenied(res)
  getGoals(req.session.access_token, function(error, goals){
    if (error) {
      res.json({error: error})
    }else{
      res.json(goals);
    }
  });
})

function getProfile(access_token, callback){
  let url = 'https://api.github.com/user'
  url += '?'+qs.stringify({
    access_token: access_token
  })
  request({
    method: 'get',
    url: url,
    headers: {'user-agent': 'node.js'}
  }, function(error, response){
    // console.log(response)
    callback(error, JSON.parse(response.body))
  })
}

function getGoals(access_token, callback){
  let url = 'https://api.github.com/repos/GuildCrafts/web-development-js/issues'
  url += '?'+qs.stringify({
    access_token: access_token
  })
  request({
    method: 'get',
    url: url,
    headers: {'user-agent': 'node.js'}
  }, function(error, response){
    console.log(access_token)
    callback(error, JSON.parse(response.body))
  })
}

  // var issues_endpoint = "https://api.github.com/repos/GuildCrafts/web-development-js/issues?access_token="

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
  res.sendFile(__dirname+"/public/index.html")
});

app.listen(port, function() {
  console.log('Node app is running on port', port);
});


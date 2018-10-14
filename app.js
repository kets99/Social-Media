var express = require('express');
var path = require('path');
var app = express();
var exphbs = require('express-handlebars');
var handler = require('./routes/handler');
//const multer = require('multer');
const mime = require('mime');
var session=require('express-session');
var passport = require('passport');
var passportlocal = require('passport-local');
var LocalStrategy   = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);



app.use(express.static(path.join(__dirname,"public")));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

var options = {
    host: 'localhost',
  user: "root",
  password: "newpassword",
  database :"social",
    };
 
var sessionStore = new MySQLStore(options);
 
app.use(session({
   // key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use('/',handler);


 
app.set('view engine', 'handlebars');
app.engine('handlebars',exphbs());

app.listen(3000,()=>{
    console.log('listening');
});


module.exports = app;

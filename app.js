var express = require('express');
var path = require('path');
var app = express();
var exphbs = require('express-handlebars');
var handler = require('./routes/handler');
const multer = require('multer');
const mime = require('mime');



// view engine setup
app.set('view engine', 'handlebars');
app.engine('handlebars',exphbs());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',handler);

app.listen(3000,()=>{
    console.log('listening');
});

module.exports = app;

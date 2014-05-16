
/**
 * Module dependencies.
 */

var express = require('express');
var iMinds = require('./routes/iMinds');
var http = require('http');
var path = require('path');


var app = express();

var context = '/LARAe';

// all environments
app.set('port', process.env.PORT || 3666);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('LARA ftw'));
app.use(express.session());

app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use("/LARAe/static/",express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get(path.join(context,'/iMinds/'), iMinds.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

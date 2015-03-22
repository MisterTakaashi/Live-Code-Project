var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var fs   = require('fs')
var session = require('cookie-session')
var sha256 = require('js-sha256')

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express()

app.use(session({ secret: 's3cr3tind3chiffrabl3' }))

.use(express.static(__dirname + '/static'))



app.listen(8080)

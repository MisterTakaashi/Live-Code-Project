var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var fs   = require('fs')
var session = require('cookie-session')
var sha256 = require('js-sha256')
var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'livecode',
  password : '',
  database : 'livecode'
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express()

app.use(session({ secret: 's3cr3tind3chiffrabl3' }))

.use(express.static(__dirname + '/static'))

.get('/', function(req, res){
    res.render('index.ejs', { session: req.session })
    /*connection.query('SELECT 1 + 1 AS solution', function(err, rows) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    })*/
})

.get('/login', function(req, res){
    if (typeof(req.session.pseudo) != undefined) {
        res.redirect('/')
    }else{
        res.render('login.ejs', { session: req.session })
    }
})

.post('/login', urlencodedParser, function(req, res){
    var email = mysql.escape(req.body.email)
    var password = mysql.escape(sha256(req.body.password))
    var rememberme = req.body.remember

    connection.query('SELECT * FROM users WHERE USR_CH_EMAIL = ' + email + ' AND USR_CH_PASS = ' + password, function(err, rows){
        if(rows.length != 0){
            // Mise en place des cookies de session
            req.session.id = rows[0].USR_N_ID
            req.session.pseudo = rows[0].USR_CH_PSEUDO
            req.session.email = rows[0].USR_CH_EMAIL

            res.redirect('/')
        }else{
            console.log('Authentification ratée pour: ' + email);
            res.redirect('/login#connectionfailed')
        }
    })

    //console.log("Email: " + email + " Mot de passe: " + password + " Remember me: " + rememberme)
})

.get('/:pseudo', function(req, res){
    res.render('user.ejs', { session: req.session })
})

app.listen(8080)

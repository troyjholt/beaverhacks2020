/* Import the module in category_cross_out.js */
const {category_cross_out} = require('./public/category_cross_out.js')

/* Setup the connection to PostgreSQL */
const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "localhost",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

/* Include and start express. */
let express = require('express');
let app = express();

/* Path module for directing to the Public assets folder.*/
const path = require('path');

/* Set the path for loading assets like CSS and images.*/
app.use(express.static(path.join(__dirname, '/public')));

/* Start express-handlebars. Set the main layout. */
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});

/* Set express-handlebars as the template engine. At runtime, the template
 * engine will replace variables in the template file with values and transform
 * the template into a web-page for the client.*/

app.engine('handlebars', handlebars.engine);  // Connect express-handlebars to express.
app.set('view engine', 'handlebars'); // Set express-handlebars to manage the views.
app.set('port', process.argv[2]); // Set input from the console to manage the port.

/* Set up the HTTP request.*/
let request = require('request');

/*This code sets up the middleware used to parse POST requests
 * sent via the body. It can accept posts that are URL-Encoded
 * or JSON formatted.*/

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* This code sets up a random number generator. */
var rand = require('random-seed').create();


/* This GET request handles loading the front page. */
app.get('/', function (req, res, next) {
    let context = {};
    res.render('front', context);
});

/* Calls category_cross_out function which imports category_cross_out.js as a module.*/
category_cross_out(pool, app, rand)

/* This GET request handles loading the shape-match page. */
app.get('/shape_match', function (req, res, next) {
    let context = {};
    res.render('shape_match', context);
});


/* This GET request handles loading the guess-the-word page. */
app.get('/guess_the_word', function (req, res, next) {
    let context = {};

    res.render('guess_the_word', context);
});

/* This GET request handles loading the help page. */
app.get('/help', function (req, res, next) {
    let context = {};
    context.form = 1;
    res.render('help', context);
});

/* This POST request handles checking the answer of the previous round and loading the next round.*/
app.post('/help', function (request, response, next) {
    let context = {};
    context.form = 0;
    context.sender = request.body.sender;
    context.senderEmail = request.body.senderEmail;
    context.message = request.body.message;

    /* This code connects to the database and retrieves 3 items from a category and 1 item from a different category.*/
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client.', err.stack)
        }

        client.query('INSERT INTO contact (name, email, comments) VALUES ($1, $2, $3);', [context.sender, context.senderEmail, context.message], (err, result) => {
            /* Skips to the 500 page is an error is returned.*/
            if (err) {
                next(err);
                return console.error('Error executing query', err.stack);
            }
            res.render('help', context);
        });
    });
});


/* Create a 500 page. */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/* Create a 404 page. */
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});


/* Listen for someone to access the script on the specified port. */
let port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Express started on https://gentle-shore-56851.herokuapp.com/  (server-side port ' + port + '); press Ctrl-C to terminate.');
});




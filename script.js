// /* Include and start express. */
let express = require('express');
let app = express();

/* Path module for directing to the Public assets folder.*/
const path = require('path');

/* Set the path for loading assets like CSS and images.*/
app.use(express.static(path.join(__dirname, '/public')));
//
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
app.get('/', function (req, res) {
    let context = {};
    res.render('front', context);
});

/* This GET request handles loading the category-cross-out game. */
app.get('/category_cross_out', function (req, res) {

    /* Create the random number generator.*/
    var rand = require('random-seed').create();
    let context = {};

    /* Score tracker.*/
    let scoreStatus = {rounds: 1, wins: 0, tries: 3};

    let itemArrays=[
        ["dog", "cat", "chicken", "horse"],
        ["banana", "apple", "strawberry", "orange"],
        ["fall", "winter", "spring", "summer"],
        ["pants", "shirt", "belt", "socks"],
        ["happy", "sad", "angry", "nervous"],
        ["Alaska", "Florida", "Washington", "Oregon"]
    ];

    let categoryNames=["animals", "fruit", "seasons", "clothing", "emotions", "states"];

    /* Selects two lists at random that use one element from one list and three from the other.*/
    /* Tracks the unique element.*/

    let category_number=rand(categoryNames.length);
    let wrong_category_number=rand(categoryNames.length);
    let wrong_category_item=rand(itemArrays[0].length);
    let newList=itemArrays[category_number]
    newList[wrong_category_item]=itemArrays[wrong_category_number][wrong_category_item];

    context.list;
    context.wrongItem=wrong_category_item;

    res.render('category_cross_out', context);
});


/* This GET request handles loading the contact page. */
app.get('/contact', function (req, res) {
    let context = {};
    res.render('contact', context);
});

/* This GET request handles loading the help page. */
app.get('/help', function (req, res) {
    let context = {};
    res.render('help', context);
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




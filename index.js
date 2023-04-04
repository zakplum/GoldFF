// Import the modules we need
var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')

// Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }))


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/goldsmithsFF";
const client = new MongoClient(url);
client.connect().then(()=>{
 console.log("Connected");
})
.finally(()=>{
 client.close();
})


// Set up css
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/scripts'));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

// Define our data
var siteData = {siteName: "Goldsmiths Food Finder"}

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, siteData);

// Start the web app listening
app.listen(port, () => console.log(`App listening on port ${port}!`))
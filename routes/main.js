const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const saltRounds = 10;

module.exports = function(app, siteData) {
  
    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', siteData);
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', siteData);
    });

    app.get('/privacy',function(req,res){
        res.render('privacy.ejs', siteData);
    });

    app.get('/register', function(req,res){
        res.render('register.ejs', siteData);
    });

    app.get('/sitemap', function(req,res){
        res.render('sitemap.ejs', siteData);
    });

    app.post('/registered', async function(req, res) {
        const { first, last, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = {
            first,
            last,
            email,
            password: hashedPassword,
        };

        const client = new MongoClient('mongodb://localhost/goldsmithsFF');
        await client.connect();
        const db = client.db('goldsmithsFF');

        await db.collection('accounts').insertOne(user);
        await client.close();

        res.redirect('login');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', siteData);
    });

    app.post('/login', async function(req, res) {
        const { email, password } = req.body;

        const client = new MongoClient('mongodb://localhost/goldsmithsFF');
        await client.connect();
        const db = client.db('goldsmithsFF');

        const user = await db.collection('accounts').findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            res.redirect('../354/');
        } else {
            res.render('login.ejs', { ...siteData, errorMessage: 'Wrong account/password' });
        }

        await client.close();
    });

    app.get('/restaurants', async function(req, res) {

      const allergens = Array.isArray(req.query.allergen) ? req.query.allergen : [req.query.allergen]; 

      const query = { allergens: { $not: { $elemMatch: { $in: allergens } } } };

      let MongoClient = require('mongodb').MongoClient;
      let url = 'mongodb://localhost/goldsmithsFF';

      const client = new MongoClient(url);

      try {

        let db = client.db('goldsmithsFF');
        let cursor = await db.collection('restaurant_allergens').find(query); 
        let restaurants = await cursor.toArray();
        let restaurantIds = restaurants.map((r) => r.restaurant_id);

        cursor = await db.collection('restaurants').find({ _id: { $in: restaurantIds } });
        restaurants = await cursor.toArray();

        let newData = Object.assign({}, siteData, { availableRestaurants: restaurants });

        res.render('restaurants.ejs', newData);

    } finally {
        await client.close();
    }
});

      
    
  }
  
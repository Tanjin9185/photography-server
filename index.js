const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcopb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const serviceCollection = client.db("photography").collection("service");

    // Add service to database 

    app.post('/addservice', (req, res) => {
        const title = req.body.title;
        const price = req.body.price;
        const subtitle = req.body.subtitle;
        const content = req.body.content;
        serviceCollection.insertOne({ title, price, subtitle, content })
            .then((result) => {
                res.send(result.insertedCount > 0);
                console.log(result)
                console.log("service add to database")
            });

    });

    //load service 
    app.get("/services", (req, res) => {
        serviceCollection.find().toArray((err, service) => {
            res.send(service)
        });
    });

});



app.get('/', (req, res) => {
    res.send('Hello Tanjin');
})





app.listen(process.env.PORT || port)
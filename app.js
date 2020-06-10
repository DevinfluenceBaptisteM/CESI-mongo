var express = require('express');
var app = express();
app.engine('html', require('ejs').renderFile);
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Baptiste:azerty@data-3laxu.gcp.mongodb.net/DATA?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("sample_supplies").collection("sales");
    console.log(collection);
    // Faire les RQT ici
    client.close();
});
app.get('/', function(req, res) {
    res.render('index.html');
});
app.listen(8070, '127.0.0.1')
const uri = "mongodb+srv://jeanM:iWjYfAp7COoLJS2Q@cesitest-xb3jc.gcp.mongodb.net/sample_training?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err) {
        return err
    }

    const collection = client.db("sample_supplies").collection('sales')


    //Recherche par customer
    let gender = "M"
    
    collection.find({"customer.gender": "M"}).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(sale => {
            console.log(sale)
        });
        client.close();
    });
});
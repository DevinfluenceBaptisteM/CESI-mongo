var express = require('express');
var app = express();
app.engine('html', require('ejs').renderFile);
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Antoine:azerty@data-3laxu.gcp.mongodb.net/DATA?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(async err => {
    const collection = client.db("sample_training").collection("tweets");
    
    let tweets = await collection.find({source : "web"}).sort({id: -1}).toArray()
    console.log(tweets)
    client.close();
});
app.get('/', function (req, res) {
    res.render('index.html');
});
app.listen(8070, '127.0.0.1')
var express = require('express');
var app = express();
app.engine('html', require('ejs').renderFile);
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Baptiste:azerty@data-3laxu.gcp.mongodb.net/DATA?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("sample_training").collection("tweets");
    collection.findOne({}, function (err, result) {
        console.log(result)
    });
    client.close();
});
app.get('/', function (req, res) {
    res.render('index.html');
});
app.listen(8070, '127.0.0.1')
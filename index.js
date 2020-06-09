const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://jeanM:iWjYfAp7COoLJS2Q@cesitest-xb3jc.gcp.mongodb.net/sample_training?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if(err) {
        return err
    }

    const collection = client.db("sample_supplies").collection('sales')

    //Retourne tous les customers ordre
    // collection.find({}).toArray(function(err, result) {
    //     if (err) throw err;
    //     result.forEach(sale => {
    //         console.log(sale.customer)
    //     });
    // });

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
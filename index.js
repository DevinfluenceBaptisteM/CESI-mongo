const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://jeanM:iWjYfAp7COoLJS2Q@cesitest-xb3jc.gcp.mongodb.net/sample_training?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("Connected to mongodb")
  client.close();
});
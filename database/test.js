const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://howardwang:234Ar234@cluster0-vuff4.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err => {
  if (err) return console.log(err);

  console.log("Connected to DB!");
  const collection = client.db("cluster0").collection("commands");

  collection
    .find({
      $query: { shortcut: "for {int} until {int}" },
      $orderBy: { default: true }
    })
    .toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      return result;
    });
  client.close();
});

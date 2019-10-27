const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://howardwang:234Ar234@cluster0-vuff4.mongodb.net/test?retryWrites=true&w=majority";

const addCommand = (collect, shortcut, language, body) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client.connect(err => {
    if (err) {
      console.log(err);
      return false;
    }

    const collection = client.db("cluster0").collection(collect);

    console.log("Connected to DB!");

    collection.insertOne({
      shortcut,
      language,
      body,
      default: "false",
      queries: "0"
    });

    client.close();

    return true;
  });
};

module.exports = {
  addCommand,
  MongoClient,
  uri
};

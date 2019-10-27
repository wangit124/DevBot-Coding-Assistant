const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { addCommand, MongoClient, uri } = require("./database/server");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

/* GET home page. */
app.get("/", async function(req, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client.connect(err => {
    if (err) return console.log(err);

    const db = client.db("cluster0");

    //Step 1: declare promise

    var myPromise = () => {
      return new Promise((resolve, reject) => {
        db.collection("commands")
          .find({})
          .toArray(function(err, data) {
            err ? reject(err) : resolve(data);
          });
      });
    };

    //Step 2: async promise handler
    var callMyPromise = async () => {
      var result = await myPromise();
      //anything here is executed after result is resolved
      return result;
    };

    //Step 3: make the call
    callMyPromise().then(function(result) {
      client.close();
      res.render("index", { data: result });
    });
  }); //end mongo client
});

/* Receive create shortcut */
app.post("/create", function(req, res) {
  const data = req && req.body;

  const { shortcut, language, full } = data;

  const check = addCommand("commands", shortcut, language, full);

  res.send(check ? 'success!' : 'Failure!');
});

// Listen on ports
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});

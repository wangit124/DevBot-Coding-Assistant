// Import express and mongo
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {
  addCommand,
  MongoClient,
  uri,
  parseQuery
} = require("./database/server");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Offline data
var tempResult = [
  {
    shortcut: "while {condition}",
    language: "Python",
    body: "while ({condition}) {}",
    default: true
  },
  {
    shortcut: "for each {list}",
    language: "Python",
    body: "for (Object item : {list}) {}",
    default: true
  },
  {
    shortcut: "for {int} until {int}",
    language: "Python",
    body: "for (int i={int}; i<{int}; i++) {}",
    default: true
  },
  {
    shortcut: "hello world",
    language: "Python",
    body: "class HelloWorld {}",
    default: false
  }
];

/* GET home page. */
app.get("/", async function(req, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client.connect(err => {
    if (err) {
      return res.render("index", { data: tempResult });
    }

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

  res.send(check ? "success" : "failure");
});

/* Receive alexa query */
app.post("/alexa", async function(req, res) {
  const body = req && req.body;
  const { data: query } = body;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client.connect(err => {
    if (err) return console.log(err);

    const db = client.db("cluster0");

    const newQuery = parseQuery(query);

    if (newQuery && query.type != "any") {
      return res.send({ body: newQuery });
    }

    if (!newQuery) return res.send({ body: null });

    //Step 1: declare promise
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        db.collection("commands")
          .find({
            $query: { shortcut: newQuery.toLowerCase() },
            $orderBy: { default: true }
          })
          .toArray(function(err, data) {
            err ? reject(err) : resolve(data[0]);
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
      console.log(result);
      res.send(result);
    });
  }); //end mongo client
});

// Listen on ports
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});

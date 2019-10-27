import { MongoClient, uri } from "../../database/server";

// Initialize Mongo
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCGnWSepw9LSL447F9EJLoFTHDHPlk7sQk",
  authDomain: "devbot-dd096.firebaseapp.com",
  databaseURL: "https://devbot-dd096.firebaseio.com",
  storageBucket: "devbot-dd096.appspot.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference database
var db = firebase.database().ref("currCommand");

//Update recommendations
const updateRecommendations = newQuery => {
  console.log(newQuery);
};

// parse the query before
const parseQuery = query => {
  const { type, value, params } = query;

  switch (type) {
    case "while_loop":
      return {
        value: `while {condition}`,
        params
      };
    case "for_each":
      return {
        value: `for each {var}`,
        params
      };
    case "for_loop":
      return {
        value: `for {int} in {int}`,
        params
      };
    case "any":
      return {
        value,
        params
      };
    case "search":
      return {
        value: null,
        params
      };
    case "how_to":
      return {
        value: null,
        params
      };
    case "none":
      return null;
    case "error":
      return null;
    default:
      return null;
  }
};

// parse the output before returning
const parseOutput = (query, output) => {
  const { type, params } = query;
  switch (type) {
    case "while_loop":
      return output.replace("{condition}", params[0]);
    case "for_each":
      return output.replace("{list}", params[0]);
    case "for_loop":
      return output.replace("{int}", params[0]).replace("{int}", params[1]);
    case "any":
      return output;
    default:
      return null;
  }
};

// Query DB
const queryDB = query => {
  client.connect(err => {
    if (err) return console.log(err);

    const db = client.db("cluster0");

    var myPromise = () => {
      const newQuery = parseQuery(query);

      if (!newQuery) return null;
      if (!newQuery.value) return updateRecommendations(newQuery);

      const shortcut = newQuery.value;

      return new Promise((resolve, reject) => {
        db.collection("commands")
          .find({ $query: { shortcut }, $orderby: { default: "true" } })
          .toArray(function(err, data) {
            err ? reject(err) : resolve(data ? data[0] : []);
          });
      });
    };

    //Step 2: async promise handler
    var callMyPromise = async () => {
      var result = await myPromise();

      if (!result.length) {
        return alert("No results found!");
      }
      //anything here is executed after result is resolved
      return parseOutput(query, result);
    };

    //Step 3: make the call
    callMyPromise().then(function(result) {
      client.close();
      $("#code-field").text(result);
    });
  }); //end mongo client
};

// Listen for changes
db.on("value", function(snap) {
  console.log(snap.val());
  queryDB(snap.val());
});

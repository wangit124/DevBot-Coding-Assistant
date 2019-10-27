const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://howardwang:234Ar234@cluster0-vuff4.mongodb.net/test?retryWrites=true&w=majority";
const request = require("request");
const https = require("https");

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
      default: false
    });

    client.close();

    return true;
  });
};
// Function for fetching data from github
const fetchGithub = async (query, language) => {
  var options = {
    host: "api.github.com",
    path: "/search/repositories",
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Accept": "application/vnd.github.v3+json",
      "user-agent": "node.js"
    }
  };

  var request = https.request(options, function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk.toString("utf8");
    });

    response.on("end", function() {
      console.log("Body: ", body);
    });
  });
};

//Update recommendations
const updateRecommendations = async newQuery => {
  const { value, params } = newQuery;

  const data = await fetchGithub(value, params[0]);
  console.log(data);
};

// parse the query before
const parseQuery = query => {
  const { type, value, params } = query;

  switch (type) {
    case "while_loop":
      return `while (${params[0]}) {\n\n}`;
    case "for_each":
      return `for (int item : ${params[0]}) {\n\n}`;
    case "for_loop":
      return `for (int i=${params[0]}; i<${params[1]}; i++) {\n\n}`;
    case "any":
      return value;
    case "search":
      return updateRecommendations(query);
    case "how_to":
      return updateRecommendations(query);
    case "none":
      return null;
    case "error":
      return null;
    default:
      return null;
  }
};

module.exports = {
  addCommand,
  MongoClient,
  uri,
  parseQuery
};

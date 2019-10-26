var express = require("express");
var router = express.Router();

router.post("/alexa", function(request, response) {
  console.log("request", request);
  console.log("response", response);
});

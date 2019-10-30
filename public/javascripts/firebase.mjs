import { alert } from "/javascripts/alert.mjs";

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
var bodyListener = firebase.database().ref("currBody");

// Listen for changes
db.on("value", function(snap) {
  $.post("/alexa", { data: snap.val() }, data => {
    // console.log("data", data);
    const { body } = data;

    if (!body) {
      if (sessionStorage.getItem("alert_id")) {
        return alert(
          "Command Not Found",
          "Oops! DevBot could not recognize your command!",
          "Please try a different command :)"
        );
      } else {
        return sessionStorage.setItem("alert_id", "active");
      }
    }

    bodyListener.set({
      data: body
    });
  });
});

// bodyListener
bodyListener.on("value", snap => {
  const data = snap.val();
  if (data) {
    var editor = ace.edit("code-field");
    var code = editor.getValue();
    editor.setValue(code + "\n" + (data.data || data.body));
  }
});

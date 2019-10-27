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
    console.log("data", data);
    const { body } = data;
    bodyListener.set({
      data: body
    });
  });
});

// bodyListener
bodyListener.on("value", snap => {
  const data = snap.val();
  var editor = ace.edit("code-field");
  var code = editor.getValue();
  editor.setValue(code + '\n' + (data.data || data.body));
});

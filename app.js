const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const secrets = require("./secrets");
const { response } = require('express');

app = express();

app.use(express.static("static"));

app.use(bodyParser.urlencoded(
  { extended: true }
));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var firstname = req.body.fname;
  var lastname = req.body.lname;
  var email = req.body.email;
  console.log(firstname, lastname, email);


  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us17.api.mailchimp.com/3.0/lists/" + secrets['list-id'],
    method: "POST",
    headers: {
      "Authorization": "pankaj1 " + secrets['api-key']
   },
   body: jsonData
 };
  request(options, function(error, response, body){
    if(error){
      res.sendFile(__dirname + "/failure.html");
      console.log(error);
    } else{
      if(response.statusCode===200){
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(response.statusCode);
    }
  });
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.post("/backToMain", function (req,res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(){
 console.log("Server has Started on port 3000.");
});

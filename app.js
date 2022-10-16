const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
// const { request } = require('express');
const apiKey = "536fd4fcbac7ab4a29e0a0dc0350e0b8-us21"
const listId = "2389ea9d4f"
const serverPrefix = 'us21'
const https = require("https");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.use(express.static("public"));
app.use(bodyParser.urlencoded())
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/signup.html');
});
  
app.post('/', (req, res) => {
    console.log(req.body);
    fName = req.body.fName
    lName = req.body.lName
    email = req.body.email

    data = {
      members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }
      ]
    }

    var jsonData = JSON.stringify(data);
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: `0244198@up.edu.mx:${apiKey}`
    }


    var mailRequest = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            response.on("data", (data) => {
                var jsonResp = JSON.parse(data);
                if(jsonResp["error_count"] === 0) {
                  res.render(__dirname + "/succes.html", {name:fName});
                } else {
                  res.render(__dirname + "/failure.html", {ErrorName:jsonResp.errors[0]["error_code"], ErrorDescription:jsonResp.errors[0]["error"]});
                }
            }).on("error", (e) => {
              res.render(__dirname + "/failure.html", {ErrorName:"Failed to contact Api", ErrorDescription:e});
            });
        } else {
          res.render(__dirname + "/failure.html", {ErrorName:"Http error", ErrorDescription:response.statusCode});
        }
    });
    mailRequest.write(jsonData);
    mailRequest.end();
})

app.listen(port, () => {
  console.log(`Example app listening on posrt ${port}`)
})
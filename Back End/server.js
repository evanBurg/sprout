const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const token = "R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09";
const https = require("https");
const fs = require("fs");
const proxyPrefix = "/sprout-api";
const generateRoute = (route) => `${proxyPrefix}${route}`;
const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./chain.pem")
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  next();
});

app.use((req, res, next) => {
  console.log('---------------------');
  console.log(`Request @ ${String(new Date() + 3600000 * -5.0)}`);
  console.log(`Body @ ${JSON.stringify(req.body, null, 2)}`);
  console.log(`Query @ ${JSON.stringify(req.query, null, 2)}`);
  console.log(`Params @ ${JSON.stringify(req.params, null, 2)}`);
  console.log('---------------------');
  next();
});

app.get(generateRoute("/token"), (req, res) => {
  axios
    .post(
      `https://trefle.io/api/auth/claim?token=${token}&origin=${
        req.query.origin
      }`
    )
    .then((response, error) => {
      if (error) {
        res.status(400);
        res.send(error.data);
      }

      res.send(response.data);
    })
    .catch(error => {
      res.status(400);
      res.send(error.data);
    });
});

app.get(generateRoute("/plant/:id"), (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.send({ error: "You must specify and ID" });
  }

  axios
    .get(`https://trefle.io/api/plants/${req.params.id}?token=${token}`)
    .then((response, error) => {
      if (error) {
        res.status(400);
        res.send(error.data);
      }

      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(400);
      res.send(error.data);
    });
});

const port = 6969
https.createServer(options, app).listen(port);
const io = require('socket.io').listen(server);
const all = io.of('/sprout-api')
all.on('connection', function(socket){
  setTimeout(() => {
    console.log("-------------");
    console.log("Sending toast...");

    socket.emit("toast", {
        msg: "Testing toasts!"
    })

    console.log("Toast sent.");
  }, 2000)
});


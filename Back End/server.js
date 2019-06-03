const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const token = "R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09";

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
  console.log(`Request @ ${new Date() + 3600000 * -5.0}`);
  console.log(`Body @ ${req.body}`);
  console.log(`Query @ ${req.query}`);
  console.log(`Params @ ${req.params}`);
  next();
});

app.get("/token", (req, res) => {
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

app.get("/plant/:id", (req, res) => {
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

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

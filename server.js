const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const documentRoutes = require('./route/document');

app.use('/documents', documentRoutes);


// la route pour les users
const user = require('./route/auth');

app.use('/user', user);



app.post("/salut", (req, res) => {
  console.log("bonjour");
  console.log(5*8);

  res.status(200).send({ message: "le message passe "});
});


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
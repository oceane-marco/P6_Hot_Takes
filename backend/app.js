const express = require("express");
const helmet = require("helmet");

const mongoose = require("mongoose");
const path = require("path");



const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const app = express();


mongoose
  .connect(
    "mongodb+srv://oceane-marco:MDBjjsqmism1971@laothcluster.rsc4u.mongodb.net/HOT-TAKES?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json())
const limiter = new Bottleneck({
  reservoir: 40, // initial value
  reservoirIncreaseAmount: 2,
  reservoirIncreaseInterval: 1000, // must be divisible by 250
  reservoirIncreaseMaximum: 40,

  // also use maxConcurrent and/or minTime for safety
  maxConcurrent: 5,
  minTime: 250, // pick a value that makes sense for your use case
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;

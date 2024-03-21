const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // => /api/places..
app.use("/api/users", usersRoutes); // => /api/users..

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
}); //only reached when some req didnt get res before

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
}); // express error handling middleware

app.listen(5001);

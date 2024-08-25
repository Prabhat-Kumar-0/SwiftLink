const express = require("express");
const { connecttomongodb } = require("./connection");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const staticRoute = require("./routes/staticRouter");
const app = express();
const PORT = 8001;

connecttomongodb("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb Connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/url/:shortID", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));


// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require("lodash");
const app = express();

const secret = require("./secret");
const url = secret.myUrl;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (e) => {
    if (!e) {
      console.log("Database is connected with project.");
    }
  }
);

const articleSchema = mongoose.Schema({
  title: String,
  body: String,
  link: String,
  date: Date,
});

const Article = mongoose.model("Blog", articleSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", async(req, rep) => {
  let posts = [];
  await Article.find({}, (err, results) => {
    if (!err) {
      rep.render("home.ejs", {
        homeContent: homeStartingContent,
        articles: results,
      });
    } else {
      rep.render("home.ejs", {
        homeContent: homeStartingContent,
        articles: posts,
      });
    }
  });
});
app.get("/about", (req, rep) => {
  rep.render("about.ejs", { aboutContent: aboutContent });
});

app.get("/contact", (req, rep) => {
  rep.render("contact.ejs", { contactContent: contactContent });
});

app.get("/compose", (req, rep) => {
  rep.render("compose.ejs");
});

app.get("/articles/:article", (req, res) => {
  const linkName = req.params.article;
  Article.findOne({ link: linkName }, (err, result) => {
      if(!err){
          res.render("post.ejs", {postTitle: result.title, postBody: result.body});
      }else{
          console.log(err);
      }
      
  });
});

app.post("/compose", async (req, rep) => {
  const date = new Date();
  const now = date.getTime();
  const post = new Article({
    title: req.body.title,
    body: req.body.content,
    link: _.kebabCase(req.body.title),
    date: now,
  });
  await post.save();
  rep.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port : 3000");
});

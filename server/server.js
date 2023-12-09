const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const bcryptjs = require("bcryptjs");
const { MONGO_STRING, MONGO_STRING_OPTIONS, PORT } = require("./server-config");
const { Schema } = mongoose;
const DB_NAME = "recipes-db";
const RECIPE_COLLECTION = "recipes";
const USER_COLLECTION = "users";

//instantiate express and morgan logging
const app = express();
app.use(morgan("tiny"));

//create an instance of the mongo client to use for REST
const client = new MongoClient(MONGO_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//create a schema for the recipe documents in the DB
const recipeSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  description: String,
  ingredients: [
    { amount: String, units: String, ingredient: String },
  ],
  images: [{ url: String }],
  date: { type: Date, default: Date.now },
  meta: {
    likes: Number,
    favourites: Number,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);


mongoose.connect(
  `${MONGO_STRING + RECIPE_COLLECTION + MONGO_STRING_OPTIONS}`
);

const recipe = new Recipe ({
  title: "Delicious BananaBread", // String is shorthand for {type: String}
  author: "Chef Boyarde",
  description:
    "An easy and moist Banana Bread Recipe that is loaded with bananas, tangy-sweet raisins, and toasted walnuts. This is one of our favorite overripe banana recipes with hundreds of 5-star reviews.",
  ingredients: [
    { amount: '3', units: "", ingredient: "overripe bananas" },
    { amount: 'half', units: "cup", ingredient: "unsalted butter" },
    { amount: 'quarter', units: "cup", ingredient: "granulated sugar" },
    { amount: '2', units: "", ingredient: "large eggs, lightly beaten" },
    { amount: '1.5', units: "cups", ingredient: "all-purpose white flour" },
    { amount: '1', units: "tsp", ingredient: "baking soda" },
    { amount: 'half', units: "tsp", ingredient: "salt" },
    { amount: 'half', units: "tsp", ingredient: "vanilla extract" },
    { amount: '1', units: "cup", ingredient: "walnuts" },
    { amount: 'half', units: "cup", ingredient: "raisins" },
  ],
  images: [{ url: "https://natashaskitchen.com/wp-content/uploads/2018/05/Banana-Bread-Recipe-7.jpg" }],
  meta: {
    likes: 56,
    favourites: 12,
  },
});

recipe.save().then(() => {
  console.log('Recipe saved successfully!');

}).catch((err) => {
  console.log(`Recipe could not be saved: ${err}`);
});

const checkDBConnection = async () => {
  console.log("Checking DB connectivity on startup...");
  try {
    await client.connect(MONGO_STRING + MONGO_STRING_OPTIONS);
    console.log("Successfully established database connection!");
  } catch (err) {
    console.log(`Error when attempting to connecto to DB: ${err}`);
  } finally {
    client.close();
  }
};

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  checkDBConnection();
});

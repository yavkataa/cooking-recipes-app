const { MongoClient, ServerApiVersion, Db } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const ObjectId = require("mongodb").ObjectId;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  MONGO_STRING,
  MONGO_STRING_OPTIONS,
  PORT,
  JWT_SECRET_STRING,
} = require("./server-config");
const { Schema } = mongoose;
const DB_NAME = "recipes-db";
const RECIPE_COLLECTION = "recipes";
const USER_COLLECTION = "users";

//instantiate express and morgan logging
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//create an instance of the mongo client to use for REST
const client = new MongoClient(MONGO_STRING + MONGO_STRING_OPTIONS, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  mongoose.connect(`${MONGO_STRING + DB_NAME + MONGO_STRING_OPTIONS}`);
  console.log(`Mongoose successfully connected to DB.`);
} catch (err) {
  console.log(`Mongoose could not connect to DB: ${err}`);
}

//create a schema for the recipe documents in the DB
const recipeSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  description: String,
  ingredients: String,
  instructions: String,
  images: [{ url: String }],
  date: { type: Date, default: Date.now },
  meta: {
    likes: Number,
    favourites: Number,
  },
  authorId: ObjectId,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

//create a schema for the user documents in the DB
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const recipe = new Recipe({
  title: "Delicious BananaBread", // String is shorthand for {type: String}
  author: "Chef Boyarde",
  description:
    "An easy and moist Banana Bread Recipe that is loaded with bananas, tangy-sweet raisins, and toasted walnuts. This is one of our favorite overripe banana recipes with hundreds of 5-star reviews.",
  ingredients: [
    { amount: "3", units: "", ingredient: "overripe bananas" },
    { amount: "half", units: "cup", ingredient: "unsalted butter" },
    { amount: "quarter", units: "cup", ingredient: "granulated sugar" },
    { amount: "2", units: "", ingredient: "large eggs, lightly beaten" },
    { amount: "1.5", units: "cups", ingredient: "all-purpose white flour" },
    { amount: "1", units: "tsp", ingredient: "baking soda" },
    { amount: "half", units: "tsp", ingredient: "salt" },
    { amount: "half", units: "tsp", ingredient: "vanilla extract" },
    { amount: "1", units: "cup", ingredient: "walnuts" },
    { amount: "half", units: "cup", ingredient: "raisins" },
  ],
  images: [
    {
      url: "https://natashaskitchen.com/wp-content/uploads/2018/05/Banana-Bread-Recipe-7.jpg",
    },
  ],
  meta: {
    likes: 56,
    favourites: 12,
  },
});

// recipe
//   .save()
//   .then(() => {
//     console.log("Recipe saved successfully!");
//   })
//   .catch((err) => {
//     console.log(`Recipe could not be saved: ${err}`);
//   });

//User register authentication logic
const register = async (req, res, next) => {
  const { username, password, name } = req.body;

  if (password.length < 6) {
    return res.status(400).send("Password is shorter than 6 characters");
  }

  bcryptjs.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      name,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          JWT_SECRET_STRING,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.set("Access-Control-Allow-Credentials", req.hostname);
        res.status(201).json({
          username: username,
          _id: user._id,
          name: name,
        });
      })
      .catch((err) => {
        res.status(401).json({ message: `Error ${err}` });
      });
  });
};

//User login authentication logic
const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const findUser = await User.findOne({ username });

    if (!findUser) {
      return res.status(401).json({ message: `User not found` });
    }

    bcryptjs.compare(password, findUser.password).then((result) => {
      if (result) {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: findUser._id, username, role: findUser.role },
          JWT_SECRET_STRING,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.set("Access-Control-Allow-Origin", req.hostname);
        res.status(201).json({
          username: findUser.username,
          _id: findUser._id,
          name: findUser.name,
        });
      } else {
        return res.status(400).json({ message: "Incorrect password" });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: `An error occurred: ${err}` });
  }
};

//Authentication verification with cookie
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET_STRING, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: `Not authorized` });
      } else {
        if (decodedToken.role !== "Basic" && decodedToken.role !== "Admin") {
          return res.status(401).json({ message: `Not authorized` });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({ message: `Not authorized, no token found` });
  }
};

const checkDBConnection = async () => {
  try {
    await client.connect(MONGO_STRING + MONGO_STRING_OPTIONS);
    console.log("Successfully established database connection!");
  } catch (err) {
    console.log(`Error when attempting to connecto to DB: ${err}`);
  } finally {
    client.close();
  }
};

const getRecipes = async () => {
  const recipes = await client
    .db(DB_NAME)
    .collection(RECIPE_COLLECTION)
    .find()
    .toArray();
  return recipes;
};

const getOneRecipe = async (id) => {
  const recipe = await client
    .db(DB_NAME)
    .collection(RECIPE_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return recipe;
};

const getUserRecipes = async (id) => {
  const userRecipes = await client
    .db(DB_NAME)
    .collection(RECIPE_COLLECTION)
    .find({ authorId: new ObjectId(id) })
    .toArray();
  return userRecipes;
};

const postRecipe = async (req, res, next) => {
  const {
    title,
    author,
    description,
    ingredients,
    images,
    instructions,
    authorId,
  } = req.body;

  const recipe = new Recipe({
    title: title, // String is shorthand for {type: String}
    author: author,
    description: description,
    ingredients: ingredients,
    images: images,
    meta: {
      likes: 0,
      favourites: 0,
    },
    date: new Date(),
    instructions: instructions,
    authorId: new ObjectId(authorId),
  });

  recipe
    .save()
    .then((result) => {
      res.status(201).json({ _id: result._id });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: `Could not complete post request: ${err}` });
    });
};

const updateRecipe = async (id, updateParams) => {
  let result = await client
    .db(DB_NAME)
    .collection(RECIPE_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: updateParams });
  return result;
};

const deleteRecipe = async (id) => {
  const deletionOutcome = await client
    .db(DB_NAME)
    .collection(RECIPE_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return deletionOutcome;
};

const getUser = async (id) => {
  const user = client
    .db(DB_NAME)
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
  return user;
};

app.put("/api/recipes/recipe/:id", auth, (req, res, next) => {
  const updateParams = req.body;
  const { id } = req.params;
  updateRecipe(id, updateParams)
    .then((result) => {
      const userDetails = {
        username: result.username,
        name: result.name,
        _id: result._id,
      };
      res.status(201).json(userDetails);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.get("/api/recipes", (req, res, next) => {
  getRecipes()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => {
      res.status(400).json({ message: `Encounterted error: ${err}` });
    });
});

app.get("/api/recipes/user/:id", (req, res, next) => {
  const { id } = req.params;
  getUserRecipes(id)
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.get("/api/recipes/:id", (req, res, next) => {
  const id = req.params.id;
  getOneRecipe(id)
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((err) => {
      res.status(400).json({ message: `Encountered error: ${err}` });
    });
});

app.delete("/api/recipes/delete/:id/", auth, (req, res, next) => {
  const { id } = req.params;
  deleteRecipe(id)
    .then((result) => {
      res.status(204).json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: `Encountered error: ${err}` });
    });
});

app.get("/api/login-verify", auth, (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, JWT_SECRET_STRING, (err, decodedToken) => {
    const userInfo = { username: decodedToken.username, _id: decodedToken.id };
    res.status(200).json(userInfo);
  });
});

app.get("/api/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.send();
  // res.status(204).json({ message: "Logged out successfully." });
});

app.get("/api/user/:id", (req, res, next) => {
  const { id } = req.params;
  getUser(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.post("/api/post-recipe", auth, postRecipe);
app.post("/api/register", register);
app.post("/api/login", login);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);

  // console.log("Checking DB connectivity on startup...");
  // checkDBConnection();
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

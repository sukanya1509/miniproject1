const express = require("express"),
  app = express(),
  passport = require("passport"),
  port = process.env.PORT || 80,
  cors = require("cors"),
  cookie = require("cookie");

const bcrypt = require("bcrypt");

const db = require("./database.js");
let users = db.users;

require("./passport.js");

const router = require("express").Router(),
  jwt = require("jsonwebtoken");

app.use("/api", router);
router.use(cors({ origin: "http://localhost:3000", credentials: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("Login: ", req.body, user, err, info);
    if (err) return next(err);
    if (user) {
        if (req.body.remember == true) {
          time_exp = "7d";
        } else time_exp = "1d";
        const token = jwt.sign(user, db.SECRET, {
          expiresIn: time_exp,
        });
        var decoded = jwt.decode(token);
        let time = new Date(decoded.exp * 1000);
        console.log(new Date(decoded.exp * 1000));
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              maxAge: 60 * 60,
              sameSite: "strict",
              path: "/",
          })
      );
      res.statusCode = 200;
      return res.json({ user, token });
    } else return res.status(422).json(info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  return res.json({ message: "Logout successful" });
});

/* GET user profile. */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);
/* GET user foo. */
router.get(
  "/foo",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
      res.status(200).json({ message: "Foo" });
  }
);

router.post("/register", async (req, res) => {
  try {
    const SALT_ROUND = 10;
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ message: "Cannot register with empty string" });
    if (db.checkExistingUser(username) !== db.NOT_FOUND)
      return res.json({ message: "Duplicated user" });

    let id = users.users.length? users.users[users.users.length - 1].id + 1: 1;
    hash = await bcrypt.hash(password, SALT_ROUND);
    users.users.push({ id, username, password: hash, email });
    res.status(200).json({ message: "Register success" });
  } catch {
    res.status(422).json({ message: "Cannot register" });
  }
});

router.get("/alluser", (req, res) => res.json(db.users.users));

router.get("/", (req, res, next) => {
  res.send("Respond without authentication");
});

  let students = {
      list: [
        { "id": 1, "Ownername": "Sukanya","petsurname": "Cooper","species": "Himalayan cat" ,"age": 3.4 },
        { "id": 2, "Ownername": "Parichart","petsurname": "Molly","species": "Maine coon" ,"age": 2.6 }]
    }
  
  
  router
    .route("/pet")
    .get((req, res) => {
      res.send(pet);
    })
    .post((req, res) => {
      console.log(req.body);
      let newpet = {};
      newspet.id = pet.list.length ? pet.list[pet.list.length - 1].id + 1 : 1;
      newpet.ownername = req.body.ownername;
      newpet.petsurname= req.body.petsurname;
      newpet.species = req.body.species;
      newpet.age= req.body.age;
      pet = { list: [...pet.list, newpet] };
      res.json(pet);
    });
  
  router
    .route("/pet/:petid")
    .get((req, res) => {
      let id = pet.list.findIndex((item) => +item.id == +req.params.petid)
      res.json(pet.list[id]);
    })
    .put((req, res) => {
      let id = pet.list.findIndex((item) => item.id == +req.params.petid);
      pet.list[id].ownername = req.body.ownername;
      pet.list[id].petsurname = req.body.petsurname;
      pet.list[id].species = req.body.species;
      pet.list[id].age = req.body.age;
      res.json(pet.list);
    })
    .delete((req, res) => {
      pet.list = pet.list.filter((item) => +item.id !== +req.params.petid);
      res.json(pet.list);
    });
  
  
  router.route("/purchase/:petId")
  .post((req,res) => {
    let id = pet.list.findIndex((item) => +item.id == +req.params.petId)
    if (id == -1) {
      res.json({message: "Pet not found"})
    }
    else {
      pet.list = pet.list.filter((item) => +item.id !== +req.params.petId);
      res.json(pet.list);
    }
  })

// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
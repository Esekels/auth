const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true, // Changez cette URL selon votre frontend
    credentials: true,
  })
);

// Configurer la session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Changez secure: true en production (HTTPS)
  })
);

// Simuler une base de données
const users = [];

// Enregistrement d'utilisateur
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).send("User registered");
});

// Connexion d'utilisateur
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(401).send("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Incorrect password");
  }

  // Stocker l'utilisateur dans la session
  req.session.user = { username: user.username };

  // Envoyer les informations de l'utilisateur
  res.status(200).json({ username: user.username, message: "Logged in" });
});

// Récupérer les informations de l'utilisateur connecté
app.get("/user", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).send("Not authenticated");
  }
});

// Déconnexion
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.send("Logged out");
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

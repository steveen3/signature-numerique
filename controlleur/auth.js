/* const User = require("../utilis/user.js"); */
const User = require("../utilis/User");
const document = require("../utilis/document")

const bcrypt = require('bcrypt');

const {
  createUser, 
  findOneUser,

} = require("../database");


exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username + " " + email + " " + password);
  try {
    // Générer le hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // Le deuxième argument est le coût du hachage, plus il est élevé, plus le hachage est sécurisé mais plus il est lent

    // Enregistrer l'utilisateur avec le mot de passe haché
    createUser(username, email, hashedPassword);
    
    res.status(201).send({ message: "User registered" });
  } catch (error) {
    next(error);
  }
};



//authentification

// Assume matchPasswords method compares passwords
const matchPasswords = async (enteredPassword, savedPassword) => {
  return enteredPassword === savedPassword;
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    return next(new ErrorResponse("Please provide username and password", 400));
  }
  try {
    const user = await findOneUser(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await matchPasswords(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    console.log("Login success");
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

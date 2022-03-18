const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// passwordValidator import
const passwordValidator = require("password-validator");
const schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)         
.is().max(100)       
.has().uppercase(1)   
.has().lowercase(1)   
.has().symbols(1)    
.has().digits(2) 
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']); 

// model User Import
const User = require("../models/users");

exports.signup = (req, res, next) => {
  if(!schema.validate(req.body.password))
  {
    return res.status(400).json({
      message:
        "Veillez mettre dans votre mots de passe 8 caractère comportant: lettres majuscules, lettres minuscules, au moins 2 chiffres et 1 symbole ",
    });
  }
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch(() =>
            res
              .status(400)
              .json({ message: "l'utilisateur n'a pas pue être crée" })
          );
      })
      .catch((error) => res.status(500).json({ error }));
  
  
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
              expiresIn: "48h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Import bcrypt for hash passwords //
const bcrypt = require('bcrypt')

// Import Jsonwebtoken for token auth //
const jwt = require('jsonwebtoken')

// Import models of user //
const User = require('../models/User')

// allows to register a new user in the database //
exports.signup = (req, res, next) => {
    // hash password //
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            // save user in DB //
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

// login to authenticate //
exports.login = (req, res, next) => {
    // check that the user is present in the database with email //
    User.findOne({ email: req.body.email })
        .then(user => {
            // if not present then error 401 //
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
            }
            // if present check the validity of the password //
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // invalid = not authorized // 
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                    }
                    // if correct, we get a token //
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}
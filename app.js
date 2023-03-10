// import express //
const express = require('express')

// mongoose import //
const mongoose = require('mongoose')

// import the paths of the images //
const path = require('path')

// routes import //
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

// create an express application //
const app = express()

// connection to the mongoDB database //
mongoose.connect('mongodb+srv://Waellan:Arnold34Bart70@cluster0.xyadqry.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

// use a middleware that extracts the json body to make post request //
app.use(express.json())

// allows requests from all browsers to the API. CORS (Cross-Origin Request Sharing) //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// sauces route //
app.use('/api/sauces', saucesRoutes)

// authentication route //
app.use('/api/auth', userRoutes)

// routes that manage static files //
app.use('/images', express.static(path.join(__dirname, 'images')))

// export the application to other files with module.exports //
module.exports = app
// Import Jsonwebtoken for token auth //
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // we split between bearer and token and we recover the token in the header //
        const token = req.headers.authorization.split(' ')[1]

        // we decode our token, if it is valid, we continue otherwise an error //
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')

        //we get the userId and we add it to the request object which is sent to the routes //
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}
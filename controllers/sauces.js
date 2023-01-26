// Import models of sauces //
const Sauce = require('../models/sauces')

// Import of node.js module to access server files //
const fs = require('fs')

// create sauce //
exports.createSauce = (req, res, next) => {
    // parse the request object //
    const sauceObject = JSON.parse(req.body.sauce)
    // delete _id and  _userId //
    delete sauceObject._id
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        // we replace the _userId extracted from the token by the authentication middleware //
        userId: req.auth.userId,
        // we generate the URL of the image //
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    // sauce saved in the database //
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
}

// update (modify) sauce // 
exports.modifySauce = (req, res, next) => {
    // check if there is a file or not //
    const sauceObject = req.file ?
        { // if yes, we parse the string and recreate the image url //
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { // otherwise we get the sauce in the body of the request // 
            ...req.body
        }
    // remove userId from the request //
    delete sauceObject._userId
    // recover the sauce in the DB //
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // we check that the userId is the same as the one who created the sauce // 
            // if it is different, we get a 401 error //
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                // If it's the same then we update the sauce //
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

// delete sauce //
exports.deleteSauce = (req, res, next) => {
    // recover the sauce in the DB //
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // we check that the userId is the same as the one who created the sauce //
            // if it is different, we get a 401 error //
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                // If it's the same then we get the name of the file //
                const filename = sauce.imageUrl.split('/images/')[1]
                // we remove the image with unlink //
                fs.unlink(`images/${filename}`, () => {
                    // we remove the sauce in the DB //
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Sauce supprimée !' })

                        })
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}

// read (get) one sauce //
exports.getOneSauce = (req, res, next) => {
    // We use "findOne" with the id of the sauce we want to find //
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }))
}

// read (get) all sauce //
exports.getAllSauce = (req, res, next) => {
    // We use "find" to get the list of all the sauces in the DB //
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// like or dislike sauce //
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // If usersLiked is empty and like = 1 //
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                // Update BDD Sauce with likes and usersLiked //
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce liked" }))
                    .catch(error => res.status(400).json({ error }))
            }

            // If usersLiked is not empty and like = 0 (deletion of his vote) //
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                // Update BDD Sauce with likes and usersLiked //
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Like removed" }))
                    .catch(error => res.status(400).json({ error }))
            }

            // If usersDisliked is empty and like = -1 (dislikes = 1) //
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                // Update BDD Sauce with dislikes and usersDisliked //
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce disliked" }))
                    .catch(error => res.status(400).json({ error }))
            }

            // If usersDisliked is not empty and dislikes = 0 (deletion of his vote) //
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                // Update BDD Sauce with dislikes and usersLiked //
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Dislike removed" }))
                    .catch(error => res.status(400).json({ error }))
            }
        }
        )
        .catch(error => res.status(401).json({ error }))
}



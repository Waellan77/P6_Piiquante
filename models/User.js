// mongoose import //
const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

// user page template for signup //
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

// export models user //
module.exports = mongoose.model('User', userSchema)
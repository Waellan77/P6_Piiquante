// mongoose import //
const mongoose = require('mongoose')

// uniqueValidator import //
const uniqueValidator = require('mongoose-unique-validator')

// user page template for signup //
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

// Apply the uniqueValidator plugin to userSchema //
userSchema.plugin(uniqueValidator)

// export model user //
module.exports = mongoose.model('User', userSchema)
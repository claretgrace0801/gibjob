const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecruiterSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },

  contactNo: Number,
  bio: String
},
  {
    timestamps: true
  })


module.exports = Recruiter = mongoose.model('recruiter', RecruiterSchema)
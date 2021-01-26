const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicantSchema = new Schema({
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

  education: [{
    institute: String,
    startYear: Number,
    endYear: Number
  }],

  skills: [String],

  ratings: [{
    id: String,
    rating: Number
  }]
},
  {
    timestamps: true
  })


module.exports = Applicant = mongoose.model('applicant', ApplicantSchema)
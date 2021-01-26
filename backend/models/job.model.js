const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({

  r_id: String,

  title: {
    type: String,
    trim: true,
    required: true
  },

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

  maxApplications: Number,
  maxPositions: Number,

  deadline: Date,

  skills: [String],

  jobType: {
    type: String,
    trim: true
  },

  duration: Number,
  salary: Number,

  ratings: [{
    _id: String,
    rating: Number
  }],

  applicants: [{
    _id: String,
    status: Number,
    sop: String,
    applicationDate: Date,
    joiningDate: Date
  }]
},
  {
    timestamps: true
  })


module.exports = Job = mongoose.model('job', JobSchema)

/*
Applications statuses:
1: applied
2: shortlisted
3: Accepted
4: Rejected
*/
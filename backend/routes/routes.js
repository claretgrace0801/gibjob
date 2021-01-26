const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const Applicant = require('../models/applicant.model')
const Recruiter = require('../models/recruiter.model')
const Job = require('../models/job.model')

// Auth

router.post('/create', async (req, res) => {
  let salt = await bcrypt.genSalt(3)
  let hashedPassword = await bcrypt.hash(req.body.password, salt)

  try {
    if (req.body.type == 'applicant') {

      let checkExist = await Applicant.find({ email: req.body.email })
      if (checkExist.length > 0) {
        res.json({ success: false, message: "Applicant already exists" })
        return
      }

      const newApplicant = new Applicant({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        education: req.body.education,
        skills: req.body.skills,
        ratings: []
      })
      result = await newApplicant.save()
      res.json({ success: true, message: result })
    }
    else {

      let checkExist = await Recruiter.find({ email: req.body.email })
      if (checkExist.length > 0) {
        res.json({ success: false, message: "Recruiter already exists" })
        return
      }

      const newRecruiter = new Recruiter({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        contactNo: req.body.contactNo,
        bio: req.body.bio,
      })
      result = await newRecruiter.save()
      res.json({ success: true, message: result })
    }
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
})


router.put('/login', async (req, res) => {
  try {
    let result
    if (req.body.type == 'applicant') {
      result = await Applicant.findOne({ email: req.body.email })
    }
    else {
      result = await Recruiter.findOne({ email: req.body.email })
    }
    if (!result) {
      res.json({ success: false, message: "E-Mail not found" })
      return
    }
    let isMatch = await bcrypt.compare(req.body.password, result.password)
    if (!isMatch) {
      res.json({ success: false, message: "Incorrect Password" })
      return
    }

    res.json({ success: true, message: result })
  }
  catch (err) { res.json({ success: false, message: err.message }) }
})


// RECRUITER

router.get('/r/get', async (req, res) => {
  try {
    result = await Recruiter.find()
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }

})


router.get('/r/get/:email', async (req, res) => {
  try {
    result = await Recruiter.findOne({ email: req.params.email })
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }

})


router.delete('/r/deleteall', async (req, res) => {
  try {
    await Recruiter.deleteMany()
    res.json({ success: true })
  } catch (err) { res.json({ success: false, message: err.message }) }
})


router.put('/r/profile/edit', async (req, res) => {
  try {
    await Recruiter.updateOne({ email: req.body.email }, {
      name: req.body.name,
      email: req.body.email,
      contactNo: req.body.contactNo,
      bio: req.body.bio
    })
    result = await Recruiter.findOne({ email: req.body.email })
    res.json({ success: true, message: result })
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
})


router.put("/r/rateapp/:id", async (req, res) => {
  try {
    let user = await Applicant.findOne({ _id: req.params.id })
    user.ratings = [...user.ratings, req.body]
    result = await user.save()
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }
})



// APPLICANT

router.get('/a/get', async (req, res) => {
  try {
    result = await Applicant.find()
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }

})


router.get('/a/get/:id', async (req, res) => {
  try {
    result = await Applicant.findOne({ _id: req.params.id })
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }

})


router.get('/a/get/:email', async (req, res) => {
  try {
    result = await Applicant.findOne({ email: req.params.email })
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }

})


router.delete('/a/deleteall', async (req, res) => {
  try {
    await Applicant.deleteMany()
    res.json({ success: true })
  } catch (err) { res.json({ success: false, message: err.message }) }
})



router.put('/a/profile/edit', async (req, res) => {
  try {
    await Applicant.updateOne({ email: req.body.email }, {
      name: req.body.name,
      email: req.body.email,
      education: req.body.education,
      skills: req.body.skills,
      ratings: []
    })
    result = await Applicant.findOne({ email: req.body.email })
    res.json({ success: true, message: result })
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
})


router.put("/a/apply/:id", async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.id })
    job.applicants = [...job.applicants, req.body]
    result = await job.save()
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }
})


router.put("/a/ratejob/:id", async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.id })
    job.ratings = [...job.ratings, {
      _id: req.body._id,
      rating: req.body.rating
    }]
    result = await job.save()
    res.json({ success: true, message: result })
  } catch (err) { res.json({ success: false, message: err.message }) }
})


router.put("/a/editapp/:jobid", async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.jobid })
    let ind = job.applicants.findIndex(item => item._id == req.body._id)
    job.applicants.splice(ind, 1, req.body)
    let result = await job.save()
    res.json({ success: true, message: job })
  }
  catch (err) { res.json({ success: false, message: err.message }) }
})


router.put("/a/rejectall/:id", async (req, res) => {
  try {
    let jobs = await Job.find()
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i]._id == req.body.job_id) { continue }

      for (let j = 0; j < jobs[i].applicants.length; j++) {
        if (jobs[i].applicants[j]._id == req.params.id) {
          jobs[i].applicants[j].status = 4
        }
      }
      await jobs[i].save()
    }
    res.json({ success: true })
  }
  catch (err) { res.json({ success: false, message: err.message }) }
})


// JOB

router.post('/job', async (req, res) => {
  try {
    const newJob = new Job({
      r_id: req.body.r_id,
      title: req.body.title,
      email: req.body.email,
      name: req.body.name,
      maxApplications: req.body.maxApplications,
      maxPositions: req.body.maxPositions,
      deadline: req.body.deadline,
      skills: req.body.skills,
      jobType: req.body.jobType,
      duration: req.body.duration,
      salary: req.body.salary,
      applicants: [],
      ratings: []
    })
    let result = await newJob.save()
    res.json({ success: true, message: result })
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.delete('/job/:id', async (req, res) => {
  try {
    await Job.deleteOne({ _id: req.params.id })
    res.json({ success: true })
  } catch (err) { res.json({ success: false, message: err.message }) }
})

router.put('/job/:id', async (req, res) => {
  try {
    await Job.updateOne({ _id: req.params.id }, {
      deadline: req.body.deadline,
      maxApplications: req.body.maxApplications,
      maxPositions: req.body.maxPositions
    })
    res.json({ success: true })
  } catch (err) { res.json({ success: false, message: err.message }) }
})

router.delete('/jobs/deleteall', async (req, res) => {
  try {
    await Job.deleteMany()
    res.json({ success: true })
  } catch (err) { res.json({ success: false, message: err.message }) }
})

router.get('/job', async (req, res) => {
  result = await Job.find()
  res.json({ success: true, message: result })
})



// email

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "gibjob0801@gmail.com", // generated ethereal user
    pass: "jobisgiben", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post("/email/send", async (req, res) => {

  try {

    const output = `<h1>Congratulations!</h1><br>
  <h3>${req.body.name}, you have been accepted for the job "${req.body.title}" by ${req.body.recruiter}.</h3>`

    let info = await transporter.sendMail({
      from: '"Gibjob App" <gibjob0801@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Letter of Acceptance", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    res.json({ success: true })
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
})


module.exports = router
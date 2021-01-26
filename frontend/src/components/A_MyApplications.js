import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, CardContent, CardActions, Button, TextField, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class A_MyApplications extends Component {

  state = {}

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id

      this.state.rating = -1
      this.RateJob = this.RateJob.bind(this)

      this.state.componentLoaded = false
    }
    catch {
      this.props.history.push("/")
    }
  }

  async componentDidMount() {
    await this.props.getJobs()

    this.setState({ componentLoaded: true })
  }

  submitRating = async (job_id) => {
    if (this.state.rating >= 0 && this.state.rating <= 5) {
      let rating = {
        _id: this.state._id,
        rating: this.state.rating
      }
      let res = await this.props.rateJob(rating, job_id)
      if (res.data.success) {
        this.props.getJobs()
      }
    }
    else {
      alert("Enter a rating between 0 and 5")
    }
  }

  RateJob = ({ job }) => {
    let applicant = job.ratings?.find(user => user._id == this.state._id)
    let application = job.applicants?.find(user => user._id == this.state._id)

    if (applicant) {
      return (
        <Typography gutterBottom>
          You rated: {applicant.rating}
        </Typography>
      )
    }

    else if (application.status == 3) {
      return (
        < CardActions >
          <TextField
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Rate Job (0-5)"
            onChange={(event) => {
              if (event.target.value == "") { this.setState({ rating: -1 }) }
              else { this.setState({ rating: event.target.value }) }
            }}
          />
          <Button
            variant="contained"
            onClick={() => { this.submitRating(job._id) }}
          >
            Rate
          </Button>
        </CardActions >
      )
    }
    else {
      return null
    }
  }


  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    const { classes } = this.props
    let jobs

    try {
      jobs = this.props.state.jobs

      jobs = jobs?.filter(job => job.applicants.find((user) => user._id == this.state._id))
    }
    catch {
      this.props.history.push("/")
    }
    return (
      <div>
        <Navbar page={"My Applications"} type={"applicant"} />

        <Grid container className={classes.root} spacing={4}>

          {jobs?.map((job) => (
            <Grid key={job._id} item>
              <Card className={classes.root}>
                <CardContent>

                  <Typography variant="h6" color="textPrimary" gutterBottom>
                    {job.title}
                  </Typography>

                  <Typography gutterBottom>
                    Recruiter: {job.name}
                  </Typography>

                  <Typography gutterBottom>
                    Salary: $ {job.salary}
                  </Typography>

                  <Typography gutterBottom>
                    Duration: {!job.duration ? "Undefined" : job.duration + " months"}
                  </Typography>

                  <Typography gutterBottom>
                    Maximum positions available: {job.maxPositions}
                  </Typography>

                  <Typography gutterBottom>
                    Joining Date: {(new Date(job.applicants.find((user) => user._id == this.state._id).joiningDate)).toDateString()}
                  </Typography>

                  <Typography gutterBottom>
                    {job.jobType}
                  </Typography>

                  <Typography gutterBottom>
                    Skills required: {job.skills.join(", ")}
                  </Typography>

                  <Rating value={
                    job.ratings.length ?
                      job.ratings.map(job => job.rating)
                        .reduce((accumulator, currentValue) => accumulator + currentValue) / job.ratings.length
                      : 0}
                    readOnly />


                  < CardActions >
                    <Typography gutterBottom>
                      {misc.getApplyStatus(job.applicants.find((user) => user._id == this.state._id).status)}
                    </Typography>
                  </CardActions >

                  <this.RateJob job={job} />

                </CardContent>

              </Card>
            </Grid>

          ))}

        </Grid>
      </div >
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(A_MyApplications))
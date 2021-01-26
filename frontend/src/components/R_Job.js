import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { CircularProgress, Card, CardContent, CardActions, Container, Button, Select, FormControl, MenuItem, InputLabel, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class R_Job extends Component {

  state = {}

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id
      this.state.job_id = this.props.match.params.id

      this.state.sortOpen = false
      this.state.orderOpen = false
      this.state.sort = 0
      this.state.asc = 1

      this.state.isLoading = false

      this.state.componentLoaded = false
    }
    catch {
      this.props.history.push("/")
    }
  }

  async componentDidMount() {
    await this.props.getJobs()
    await this.props.getApplicants()

    this.setState({ componentLoaded: true })
  }

  acceptShortlistButton = ({ app }) => {
    if (app.application.status == 1) {
      return (
        <Button
          variant="contained"
          onClick={() => { this.changeApplication(app, 2) }}
        >
          Shortlist
        </Button>
      )
    }
    else if (app.application.status == 2) {
      return (
        <Button
          variant="contained"
          onClick={() => { app.application.joiningDate = new Date(); this.changeApplication(app, 3) }}
        >
          Accept
        </Button>
      )
    }
    else { return "" }
  }

  changeApplication = async (app, status) => {
    this.setState({ isLoading: true })
    app.application.status = status
    let res = await this.props.editApplication(app.application, this.state.job_id)

    if (status == 3) {
      await this.props.rejectAll(app.application._id, this.state.job_id)
      await this.props.sendEmail({
        name: app.user.name,
        title: app.job.title,
        email: app.user.email,
        recruiter: app.job.name
      })
      console.log("Email sent to", app.user.email)
    }

    await this.props.getJobs()
    this.setState({ isLoading: false })
  }

  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    const { classes } = this.props
    let job, applicants, job_applicants

    try {
      job = this.props.state.jobs?.find(item => item._id == this.state.job_id)

      applicants = this.props.state.applicants

      job_applicants = job.applicants?.filter(user => user.status != 4).map(item => {
        let applicant = applicants?.find(user => user._id == item._id)
        return ({
          application: item,
          user: applicant,
          job: job
        })
      })

      if (this.state.sort == 1) { // Name
        job_applicants?.sort((app1, app2) => this.state.asc * (app1.user.name.toLowerCase().localeCompare(app2.user.name.toLowerCase())))
      }

      else if (this.state.sort == 2) { // Date
        job_applicants?.sort((app1, app2) => this.state.asc * ((new Date(app1.application.applicationDate)) - (new Date(app2.application.applicationDate))))
      }

      else if (this.state.sort == 3) { // Rating
        job_applicants?.sort((app1, app2) => {
          let rating1 = app1.user.ratings.length ?
            app1.user.ratings.map(user => user.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0
          let rating2 = app2.user.ratings.length ?
            app2.user.ratings.map(user => user.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0

          return this.state.asc * (rating1 - rating2)
        })
      }
    }
    catch {
      this.props.history.push("/")
    }

    return (
      <div>
        <Navbar page={"Job"} type={"recruiter"} />

        <Card raised>
          <FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId="sort-label"
                open={this.state.sortOpen}
                onClose={() => { this.setState({ sortOpen: false }) }}
                onOpen={() => { this.setState({ sortOpen: true }) }}
                value={this.state.sort}
                onChange={(event) => { this.setState({ sort: event.target.value }) }}
              >
                <MenuItem value={1}>Name</MenuItem>
                <MenuItem value={2}>Application date</MenuItem>
                <MenuItem value={3}>Rating</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="order-label">Order</InputLabel>
              <Select
                labelId="order-label"
                open={this.state.orderOpen}
                onClose={() => { this.setState({ orderOpen: false }) }}
                onOpen={() => { this.setState({ orderOpen: true }) }}
                value={this.state.asc}
                onChange={(event) => { this.setState({ asc: event.target.value }) }}
              >
                <MenuItem value={1}>Ascending</MenuItem>
                <MenuItem value={-1}>Descending</MenuItem>
              </Select>
            </FormControl>
          </FormControl>
        </Card>

        <Container >
          {this.state.isLoading ? <CircularProgress /> : <span></span>}
        </Container>
        <br /><br />

        <Grid container className={classes.root} spacing={4}>

          {job_applicants?.map((app) => {
            if (app) {
              return (
                <Grid key={app.user._id} item>
                  <Card className={classes.root}>
                    <CardContent>

                      <Typography variant="h6" color="textPrimary" gutterBottom>
                        Name: {app.user.name}
                      </Typography>

                      <Typography gutterBottom>
                        Statement of purpose: {app.application.sop}
                      </Typography>

                      <Typography gutterBottom>
                        Skills: {app.user.skills.join(", ")}
                      </Typography>

                      <Typography gutterBottom>
                        Application Date: {(new Date(app.application.applicationDate)).toDateString()}
                      </Typography>

                      <Typography gutterBottom>
                        Education: {app.user.education.map(edu => <span><br />{`${edu.institute} (${edu.startYear} - ${edu.endYear})`}</span>)}
                      </Typography>

                      <Rating value={
                        app.user.ratings.length ?
                          app.user.ratings.map(item => item.rating)
                            .reduce((accumulator, currentValue) => accumulator + currentValue) / app.user.ratings.length
                          : 0}
                        readOnly />

                      <Typography gutterBottom>
                        Stage: {misc.getApplyStatus(app.application.status)}
                      </Typography>

                    </CardContent>

                    <CardActions>

                      <this.acceptShortlistButton app={app} />

                      <Button
                        variant="contained"
                        onClick={() => { this.changeApplication(app, 4) }}
                      >
                        Reject
                      </Button>
                    </CardActions>

                  </Card>
                </Grid>
              )
            }
          }
          )}

        </Grid>
      </div >
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(R_Job))
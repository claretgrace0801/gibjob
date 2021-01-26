import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'
import { Alert, Container, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, ButtonGroup, CssBaseline, TextField, Grid, Box } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class A_Profile extends Component {

  state = { type: "applicant" }

  async componentDidMount() {
    await this.props.getApplicant(this.state._id)
    this.setState({ componentLoaded: true })
  }

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id
      this.state.email = this.props.state.user.email
      this.state.name = this.props.state.user.name
      this.state.education = this.props.state.user.education
      this.state.skills = this.props.state.user.skills

      if (!this.state.education) { this.state.education = [] }
      if (!this.state.skills) { this.state.skills = [] }

      this.state.modal = false
      this.state.skillModal = false

      this.state.institute = ""
      this.state.startYear = 0
      this.state.endYear = 0

      this.state.skill = ""

      this.state.componentLoaded = false
    }
    catch {
      this.props.history.push("/")
    }
  }

  calcRating = (ratings) => {
    let total = 0
    for (let i = 0; i < ratings.length; i++) {
      let item = ratings[i]
      total = total + item.rating / ratings.length
    }
    return total
  }

  formSubmit = async () => {

    if (!misc.required([this.state.name, this.state.email, this.state.education, this.state.skills])
      || !misc.validate([misc.verifyEmail], [this.state.email])) {
      alert("Enter Valid Details")
      return
    }

    let user = {
      type: "applicant",
      name: this.state.name,
      email: this.state.email,
      education: this.state.education,
      skills: this.state.skills
    }

    await this.props.editApplicant(user)

    this.props.history.push("/a/dashboard")
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  skillToggle = () => {
    this.setState({ skillModal: !this.state.skillModal })
  }

  selectSkill = (event) => {
    if (this.state.skills.filter(item => item == event.target.innerText.toLowerCase()).length) {
      alert("Skill already exists")
      return
    }
    this.setState({
      skills: [...this.state.skills, event.target.innerText.toLowerCase()]
    })
  }

  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    let ratings, rating

    try {

      ratings = this.props.state.user.ratings
      if (!ratings) { ratings = [] }

      rating = this.calcRating(ratings)
    }
    catch {
      this.props.history.push("/")
    }

    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <Navbar page={"Profile"} type={"applicant"} />

        <CssBaseline />
        <div className={classes.paper}>

          <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating name="read-only" value={rating} readOnly />
          </Box>


          <form className={classes.form} noValidate>
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <TextField
                  autoComplete="name"
                  name="name"
                  id="name"
                  variant="outlined"
                  required
                  fullWidth
                  label="Name"
                  autoFocuss
                  value={this.state.name}
                  onChange={(event) => { this.setState({ name: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="email"
                  id="email"
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  value={this.state.email}
                  onChange={(event) => { this.setState({ email: event.target.value }) }}
                />
              </Grid>

              <Grid container spacing={2}>
                {this.state.education?.length ? (<Container><br /><Alert style={{ textAlign: "center" }} color="light"><h5 >Education</h5></Alert></Container>) : (<div></div>)}
                {this.state.education?.map(({ id, institute, startYear, endYear }) => (
                  <Grid item>
                    <Alert color="dark" toggle={() => {
                      this.setState({
                        education: this.state.education.filter((item) => item.id != id)
                      })
                    }}>
                      {institute} ({startYear} - {endYear})
                  </Alert>
                  </Grid>
                ))}
              </Grid>

              <br /><br />

              <Grid container spacing={2}>
                {this.state.skills?.length ? (<Container><br /><Alert style={{ textAlign: "center" }} color="light"><h5>Skills</h5></Alert></Container>) : (<div></div>)}

                {this.state.skills?.map((skill) => (
                  <Grid item>
                    <Alert color="dark" toggle={() => {
                      this.setState({
                        skills: this.state.skills.filter((item) => item != skill)
                      })
                    }}>
                      {skill}
                    </Alert>
                  </Grid>
                ))}
              </Grid>

              <Modal isOpen={this.state.skillModal} toggle={this.skillToggle}>
                <ModalHeader toggle={this.skillToggle}>Select Skill</ModalHeader>
                <ModalBody>
                  <Container>
                    <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                      <Button onClick={this.selectSkill}>C++</Button>
                      <Button onClick={this.selectSkill}>C</Button>
                      <Button onClick={this.selectSkill}>python</Button>
                      <Button onClick={this.selectSkill}>javascript</Button>
                      <Button onClick={this.selectSkill}>ruby</Button>
                      <Button onClick={this.selectSkill}>HTML</Button>
                      <Button onClick={this.selectSkill}>CSS</Button>
                    </ButtonGroup>
                  </Container>
                </ModalBody>
              </Modal>

              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Enter education details</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>

                      <Box m="1rem">
                        <Label for="institute">Institute</Label>
                        <Input
                          type="text"
                          id="institute"
                          placeholder="Institute Name"
                          onChange={(event) => { this.setState({ institute: event.target.value }) }}
                        />
                      </Box>

                      <Box m="1rem">
                        <Label for="startYear">Start Year</Label>
                        <Input
                          type="number"
                          id="startYear"
                          placeholder="Start Year"
                          onChange={(event) => { this.setState({ startYear: event.target.value }) }}
                        />
                      </Box>

                      <Box m="1rem">
                        <Label for="endYear">End Year</Label>
                        <Input
                          type="number"
                          id="endYear"
                          placeholder="End Year"
                          onChange={(event) => { this.setState({ endYear: event.target.value }) }}
                        />
                      </Box>
                      <Button
                        onClick={() => {
                          if (this.state.institute == "" || this.state.startYear == "" || this.state.endYear == "") {
                            alert("Enter all required details")
                            return
                          }
                          this.setState({
                            education: [...this.state.education, {
                              id: `${this.state.institute}${this.state.startYear}${this.state.startYear}`,
                              institute: this.state.institute,
                              startYear: this.state.startYear,
                              endYear: this.state.endYear
                            }]
                          })
                          this.toggle()
                        }}
                      >Save
                      </Button>

                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>

            </Grid>

            <br />

            <div style={{ display: 'flex', justifyContent: "center" }}>

              <div style={{ margin: "1rem" }}>
                <TextField
                  className={classes.submit}
                  variant="outlined"
                  label="skill"
                  value={this.state.skill}
                  onChange={(event) => { this.setState({ skill: event.target.value }) }}
                />
                <Button
                  className={classes.submit}
                  style={{ marginRight: "3rem" }}
                  variant="outlined"
                  onClick={() => {
                    this.setState({
                      skillModal: true
                    })
                  }}>
                  <ArrowDropDown />
                </Button>

                <Button
                  style={{ maxHeight: "2rem", marginRight: "10%" }}
                  variant="contained"
                  onClick={() => {
                    if (this.state.skills.filter(item => item == this.state.skill).length) {
                      alert("Skill already exists")
                      return
                    }
                    if (this.state.skill == "") {
                      alert("Enter a skill")
                      return
                    }
                    this.setState({
                      skills: [...this.state.skills, this.state.skill],
                      skill: ""
                    })
                  }}>
                  Add Skill
              </Button>
              </div>






              <div>
                <Button
                  variant="contained"
                  onClick={this.toggle}
                  className={classes.submit}
                >
                  Add Education
            </Button>

                <Button
                  style={{ marginLeft: "2rem" }}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => { this.formSubmit() }}>
                  Save Changes
            </Button>
              </div>

            </div>


          </form>
        </div>
      </Container>
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(A_Profile))
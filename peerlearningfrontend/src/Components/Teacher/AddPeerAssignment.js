import React, { useState, useContext } from 'react'
import AuthContext from "../../AuthContext";
import { API } from "../../config";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from "react-select";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AddPeerAssignment = (props) => {

    const { user, userData, course, setOpen, setMessage } = useContext(AuthContext);

  const [assignment, setAssignment] = useState({}); //for choosing an assignment while adding an assignment to peer learning
  const [questions, setQuestions] = useState(0); //for setting no. of questions for an assignment
  const [maxMarks, setMaxMarks] = useState([]); //for setting marks per question 
  const [reviewers, setReviewers] = useState(0); //for assigning reviewers per sheet
  const [reviewDeadline, setReviewDeadline] = useState(""); //for assigning deadline for review
  const [openDialog, setOpenDialog] = React.useState(false); //for pop up to add assignment
  const [openMarks, setOpenMarks] = useState(false);
  const [formInput, setFormInput] = useState({
    chosenAssignment: {},
    noOfQue: "0",
    reviewersPerSheet: "0",
    reviewerDeadline: "",
    modelAns: ""
  })
  

  const OnClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setQuestions(0);
    setMaxMarks([]);
    setFormInput({ chosenAssignment: "", noOfQue: "0", reviewersPerSheet: "0", reviewerDeadline: "", modelAns: "" });
    setReviewers(0);
    setReviewDeadline("");
    setAssignment({});
    setOpenDialog(false);
  };

  const handleAssignmentChange = (s) => {
    setAssignment(s);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addPeerLearning();
    handleClose();
  };
  
  const handleMaxMarksChange = (index, value) => {
    let k = maxMarks;
    k[index] = Math.max(0, Number(value));
    setMaxMarks([...k]);
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormInput({ ...formInput, [name]: value })
    if (name === "noOfQue") {
      const que = formInput.noOfQue;
      if (que < value) {
        setQuestions(formInput.noOfQue);
        setOpenMarks(true);
        setMaxMarks((m) => [...m, 1]);

      }
      if (que > value) {
        setQuestions(questions - 1);
        maxMarks.pop();
        setMaxMarks(maxMarks);
      }
    }
    if (name === "reviewersPerSheet") {
      setReviewers(parseInt(e.target.value))
    }
    if (name === "reviewerDeadline") {
      setReviewDeadline(new Date(e.target.value).toISOString());
      // console.log(reviewDeadline);
      // console.log(formInput.reviewerDeadline);
    }
    // if (name === "modelAns") {
    //   console.warn("file data", e.target.files);
    // }
  }

  const handleMarksSubmit = () => {
    setOpenMarks(false);
  }

  const handleMarksClose = () => {
    setOpenMarks(false);
    setQuestions(questions - 1);
    setFormInput({ ...formInput, noOfQue: questions })

    maxMarks.pop();
    setMaxMarks(maxMarks);
  };


  const addPeerLearning = () => {
    if (course.id && assignment.id) {
      // console.log(assignment);
      // console.log(course);
      // console.log(course.id, assignment.id, userData.user.email, questions, maxMarks);
      //setUserData({ ...userData, loader: 1 });
      fetch(
        `${API}/api/assignment/add?course_id=${course.id}&assignment_id=${assignment.id}&owner=${user.email}&total_questions=${questions}&access_token=${userData.token}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_id: course.id,
            assignment_id: assignment.id,
            owner: user.email,
            total_questions: questions,
            max_marks_per_question: maxMarks,
            access_token: userData.token,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setOpen(true);
          setMessage("Successfully added peer learning on this assignment");
          // console.log("Successfully added peer learning");
          props.setPeerAssignments((p) => [...p, { ...res.data, ...assignment }]);

          fetch(`${API}/api/assignment?course_id=${course.id}`, { //add the assignments using backend assignment module (the field of status is added by default)
            method: "GET",
          })
            .then((r) => r.json())
            .then((r) => {
              // console.log("trying to get id");
              // console.log(r);
              // console.log("trying to get a");
              r.forEach((a) => {
                if (a.assignment_id === assignment.id) {
                  const id = a._id;
                  // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
                  fetch(
                    `${API}/api/assignreviewers?peer_assignment_id=${id}&random_assignees=${reviewers}&access_token=${userData.token}&reviewer_deadline=${reviewDeadline}`,
                    {
                      method: "POST",
                    }
                  )
                    .then((res) => res.json())
                    .then(
                      (res) => {
                        // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                        setOpen(true);
                        setMessage("Successfully assigned reviewers");
                        // console.log(res);

                      },
                      (err) => {
                        console.log(err);
                        // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                        setOpen(true);
                        setMessage("Something went wrong while assigning");
                      }
                    );
                }
              });
            });
          
        })
        .catch((err) => {
          console.log(err);
          setOpen(true);
          setMessage("Something went wrong while adding peer review");
        });
    }
  };


  return (
      <div>
        <Button variant="outlined" style={{color: "#1E4FA0", borderRadius: "15px", backgroundColor: "white", marginTop: "0px", marginLeft: "50%",}} onClick={OnClickOpen}>
          <AddCircleIcon style={{ color: "#1E4FA0", marginRight: "20px", marginLeft: "40px", textAlign: "center",}}/>
            {" "}
            Add New Peer Assignment
        </Button>


        <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Create New Assignment
          </DialogTitle>

          <DialogContent style={{ height: "270px", marginTop: "10px" }}>
            <p>Choose An Assignment:</p>
            <div
              style={{width: "200px", height: "50px", marginTop: "-45px", marginLeft: "200px",}}>

              <Select
                value={assignment} /**** */
                options={props.allAssignments}  /****** */
                getOptionLabel={(option) => option.title} /**** */
                getOptionValue={(option) => option.id} /**** */
                onChange={handleAssignmentChange}
                rules={{ required: "Please select an option" }}
              />
            </div>

            <form action="" onSubmit={handleFormSubmit}>
              <div style={{ margin: "10px" }}>
                <p style={{ marginLeft: "31px" }}>No. of Questions:</p>
                <div style={{ marginTop: "-43px", marginLeft: "190px" }}>
                  <input
                    style={{ width: "60px" }}
                    type="number"
                    name="noOfQue"
                    min="0"
                    value={formInput.noOfQue} /**** */
                    onChange={handleInput}
                    required
                  />
                </div>
                {maxMarks.map((m, index) => ( /**** */
                  <Dialog
                    open={openMarks} /**** */
                    onClose={handleMarksClose} 
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Enter Marks
                    </DialogTitle>
                    <DialogContent>
                      <input
                        style={{ width: "60px" }}
                        type="number"
                        min="0"
                        name="noOfQue"
                        value={m}
                        onChange={(e) => {
                          handleMaxMarksChange(index, e.target.value); 
                        }}
                        required
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleMarksClose} color="primary">
                        {" "}
                        Cancel{" "}
                      </Button>
                      <Button onClick={handleMarksSubmit}  color="primary">
                        {" "}
                        Set Marks{" "}
                      </Button>
                    </DialogActions>
                  </Dialog>
                ))}
              </div>
              <div style={{ margin: "20px" }}>
                <p>Reviewers Per Sheet:</p>
                <div style={{ marginTop: "-41px", marginLeft: "180px" }}>
                  <input
                    style={{ width: "60px" }}
                    type="number"
                    name="reviewersPerSheet"
                    min="0"
                    value={formInput.reviewersPerSheet} /**** */
                    onChange={handleInput} 
                    required
                  />
                </div>
              </div>
              <div style={{ margin: "15px" }}>
                <p style={{ marginLeft: "28px" }}>Review Deadline:</p>
                <div style={{ marginTop: "-40px", marginLeft: "185px" }}>
                  <input
                    style={{ width: "200px" }}
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="reviewerDeadline"
                    value={formInput.reviewerDeadline} /**** */
                    onChange={handleInput}
                  />
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel{" "}
                </Button>
                <Button type="submit" color="primary">
                  {" "}
                  Add Assignment{" "}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>

        </Dialog>
      </div>
  );
}

export default AddPeerAssignment


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

  //console.log(props.allAssignments);

  const { user, userData, course, setOpen, setMessage } = useContext(AuthContext);

  const [assignment, setAssignment] = useState({}); //for choosing an assignment while adding an assignment to peer learning
  const [questions, setQuestions] = useState(0); //for setting no. of questions for an assignment
  const [maxMarks, setMaxMarks] = useState([]); //for setting marks per question 
  const [tolerance, setTolerance] = useState(0); //for setting tolerance of marks in an assignment
  const [reviewers, setReviewers] = useState(0); //for assigning reviewers per sheet
  const [reviewDeadline, setReviewDeadline] = useState(""); //for assigning deadline for review
  const [openDialog, setOpenDialog] = React.useState(false); //for pop up to add assignment
  const [openMarks, setOpenMarks] = useState(false);
  const [formInput, setFormInput] = useState({
    chosenAssignment: {},
    noOfQue: "0",
    reviewersPerSheet: "0",
    tolerancePercentage: "0",
    reviewerDeadline: "",
    modelAns: ""
  })

  const [modelAnswerSheet, setModelAnswerSheet] = useState(null);
  const [openModelAnswerDialog, setOpenModelAnswerDialog] = useState(false);
  const handleModelAnswerDialogOpen = () => {
    setOpenModelAnswerDialog(true);
  };

  const handleModelAnswerDialogClose = () => {
    setOpenModelAnswerDialog(false);
  };
  const [modelAnswerSheetUrl, setModelAnswerSheetUrl] = useState(""); // Add this state variable


  const OnClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setQuestions(0);
    setMaxMarks([]);
    setFormInput({ chosenAssignment: "", noOfQue: "0", tolerancePercentage: "0", reviewersPerSheet: "0", reviewerDeadline: "", modelAns: "" });
    setReviewers(0);
    setReviewDeadline("");
    setTolerance(0);
    setAssignment({});
    setOpenDialog(false);
  };

  const handleAssignmentChange = (s) => {

    const selectedTitle = s ? s.title : '';

    // Update the filename in the formInput state
    setFormInput({
      ...formInput,
      chosenAssignment: s,
      modelAns: selectedTitle, // Set the filename based on the selected title
    });

    // Update the assignment in the state
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
        console.log("questions" + questions);
        setQuestions(questions - 1);
        maxMarks.pop();
        setMaxMarks(maxMarks);
      }
    }
    if (name === "reviewersPerSheet") {
      setReviewers(parseInt(e.target.value))
    }
    if (name === "tolerancePercentage") {
      setTolerance(parseInt(e.target.value))
    }
    if (name === "reviewerDeadline") {
      setReviewDeadline(new Date(e.target.value).toISOString());
    }
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
        `${API}/api/assignment/add?course_id=${course.id}&assignment_id=${assignment.id}&owner=${user.email}&max_marks_per_question=${maxMarks}&total_questions=${questions}&access_token=${userData.token}`,
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
            tolerance: tolerance,
            access_token: userData.token,
            modelAnswerSheetUrl: modelAnswerSheetUrl, // Include the modelAnswerSheetUrl
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

  const handleModelAnswerUpload = async () => {
    //console.log(modelAnswerSheet);
    if (modelAnswerSheet) {
      const formData = new FormData();
      formData.append('modelAnswerSheet', modelAnswerSheet);
      console.log(modelAnswerSheet);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userData.token}`, // Use the user's access token
            'Content-Type': 'application/pdf',
            //'Content-Disposition': 'inline; filename="desired-file-name.pdf"', // Specify the desired filename
            //'Slug': 'desired-file-name.pdf',
          },
          body: formData,
        });

        if (response.ok) {
          // Handle successful upload
          // You can add code here to store the file information or do any other necessary actions.
          // Close the upload dialog
          const fileMetadata = await response.json();
          // Now, update the uploaded file's name using a separate request
          const fileId = fileMetadata.id;
          const newFileName = formInput.modelAns; // Set your desired filename here
          const renameResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${userData.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newFileName }),
          });

          if (renameResponse.ok) {
            // Handle successful filename update
            handleModelAnswerDialogClose();
            console.log('File renamed successfully.');
          } else {
            // Handle error when updating filename
            console.error('Error renaming file: ' + renameResponse.status);
          }
          const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

          // Set the URL to the state variable
          setModelAnswerSheetUrl(fileUrl);
          console.log(fileUrl);
          const shareResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${userData.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              role: 'reader', // Grants read-only access
              type: 'anyone', // Allows anyone with the link to access
            }),
          });

          if (shareResponse.ok) {
            console.log('File sharing permissions updated successfully.');
          } else {
            console.error('Error updating file sharing permissions: ' + shareResponse.status);
          }

        } else {
          // Handle error
          console.error('Error uploading Model Answer Sheet: ' + response.status);
        }
      } catch (error) {
        console.error('Error uploading Model Answer Sheet', error);
      }
    }
  };




  return (
    <div>
      <Button variant="outlined" style={{ color: "#1E4FA0", borderRadius: "15px", backgroundColor: "white", marginTop: "0px", marginLeft: "50%", }} onClick={OnClickOpen}>
        <AddCircleIcon style={{ color: "#1E4FA0", marginRight: "20px", marginLeft: "40px", textAlign: "center", }} />
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
            style={{ width: "200px", height: "50px", marginTop: "-45px", marginLeft: "200px", }}>

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
              <div style={{ marginTop: "-43px", marginLeft: "200px" }}>
                <input
                  style={{ width: "60px" }}
                  type="number"
                  name="noOfQue"
                  min="0"
                  value={formInput.noOfQue}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>
            {Array.from({ length: formInput.noOfQue }, (_, index) => (
              <div key={index} style={{ margin: "10px 0 0 70px" }}>
                <p>Max Marks for Question {index + 1}:</p>
                <div style={{ marginTop: "-43px", marginLeft: "190px" }}>
                  <input
                    style={{ width: "60px" }}
                    type="number"
                    min="0"
                    name={`maxMarks[${index}]`}
                    value={maxMarks[index]}
                    onChange={(e) => handleMaxMarksChange(index, e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

              <div style={{ margin: "20px" }}>
                <p>Reviewers Per Sheet:</p>
                <div style={{ marginTop: "-41px", marginLeft: "190px" }}>
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

            <div style={{ margin: "20px" }}>
              <p>Tolerance Percentage(%) :</p>
              <div style={{ marginTop: "-41px", marginLeft: "190px" }}>
                <input
                  style={{ width: "60px" }}
                  type="number"
                  name="tolerancePercentage"
                  min="0"
                  max="100"
                  value={formInput.tolerancePercentage} /**** */
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
            <div>
              <Button
                onClick={handleModelAnswerDialogOpen}
                color="primary"
                variant="outlined"
              >
                Upload Model Answer Sheet (PDF)
              </Button>
              <Dialog
                open={openModelAnswerDialog}
                onClose={handleModelAnswerDialogClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Upload Model Answer Sheet (PDF)
                </DialogTitle>
                <DialogContent>
                  {/* Add file input to allow the user to choose a PDF file */}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setModelAnswerSheet(e.target.files[0])}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleModelAnswerDialogClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleModelAnswerUpload} color="primary">
                    Upload
                  </Button>
                </DialogActions>
              </Dialog>

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

      </Dialog >
    </div >
  );
}

export default AddPeerAssignment
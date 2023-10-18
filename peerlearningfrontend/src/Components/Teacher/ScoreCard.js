import React, { useContext, useEffect, useState } from "react";
import { API } from "../../config";
import editIcon from "../Images/editIcon.png";
import AuthContext from "../../AuthContext";

export const ScoreCard = (props) => {

  const [isShown, setIsShown] = useState(false);
  
  return (
    <div className="link-with-preview" style={{ cursor: 'pointer' }}>
      <span onClick={() => setIsShown(!isShown)}> {props.children} </span>
      {isShown && <Card data={props.data} questions={props.questions} />}
    </div>
  );
};


const Card = (props) => {

  const { userData } = useContext(AuthContext);

  //console.log(props.data);

  const [score, setScore] = useState(0);
  const [editingRow, setEditingRow] = useState(-1);
  const [newMarks, setNewMarks] = useState('');

  useEffect(() => {
    let i = 0;
    props.data.review_score.forEach((s) => {
      i = i + s;
    });
    setScore(i);
  }, []);

  const handleEditMarks = (index) => {
    setEditingRow(index);
    setNewMarks(props.data.review_score[index]);
  }

  const handleSaveMarks = (index) => {
    const updatedScores = [...props.data.review_score];
    updatedScores[index] = parseFloat(newMarks); 
    props.data.review_score = updatedScores;
    setScore(updatedScores.reduce((acc, val) => acc + val, 0));
    console.log(props.data);
    submitReview(props.data);
    setEditingRow(-1); 
  }

  const submitReview = async (row) => {
    if (userData.token) {
      await fetch(`${API}/api/reviewassignment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              peer_activity_id: row._id,
              review_score: row.review_score,
              reviewer_comment: row.reviewer_comment,
          }),
      })
        .then((res) => res.json())
        .then(
            (res) => {
              //console.log(res);
                //alert("Updated succesfully");
            },
            (err) => {
                alert("Some thing went wrong while saving review");
            }
        );
    }


};

  return (
    <div className="card" style={{ width: "400px", marginLeft: "150px", marginRight: "150px"}}>
      <p style={{ fontSize: "17px", fontWeight:"bold", marginLeft: "10px" }}>Total Score: {score}</p>
      <table style={{ width: "90%", backgroundColor: "white", marginLeft: "10px", fontSize: "15px" }}>
        <tr style={{ backgroundColor: "#4285F4", color: "white" }}>
          <th>Questions</th>
          <th>Marks</th>
          <th>Comments</th>
          <th>Edit Marks</th>
        </tr>
        {Array(props.questions).fill(0).map((_, index) => (
          <tr key={index}>
            <td>Q{index + 1}</td>
            <td>
              {editingRow === index ? (
                <input
                  type="number"
                  value={newMarks}
                  onChange={(e) => setNewMarks(e.target.value)}
                  style={{ width: '60px' }}
                />
              ) : (
                props.data.review_score[index]
              )}
            </td>
            <td>{props.data.reviewer_comment[index]}</td>
            <td>
              {editingRow === index ? (
                <button onClick={() => handleSaveMarks(index)}>Save</button>
              ) : (
                <img src={editIcon} alt="edit" onClick={() => handleEditMarks(index)} />
              )}
            </td>
          </tr>
        ))}
      </table>
      <p style={{ fontSize: "15px", fontWeight:"bold", marginTop: "10px", marginLeft: "10px" }}>View Submission :
        <a target="_blank" rel="noreferrer" href={props.data.material_drive_link} style={{ height: "20px", marginLeft: "10px" }}>
          <input type="text" value="Answersheet.pdf" style={{ marginTop: "8px", textAlign: "center", cursor: "pointer", backgroundColor: "white" }} ></input>
        </a>
      </p>
    </div>
  );
};


// const Card = (props) => {
//   const [score, setScore] = useState(0);

//   console.log(props.data);

//   useEffect(() => {
//     let i = 0;
//     props.data.review_score.forEach((s) => {
//       i = i + s;
//     });
//     setScore(i);
//   }, []);

//   const handleEditMarks = () => {console.log("edit edit")}

//   return (
//     <div className="card" style={{ width: "400px", marginLeft: "150px", marginRight: "150px"}}>
//       <p style={{ fontSize: "17px", fontWeight:"bold", marginLeft: "10px" }}>Total Score: {score}</p>
//       <table style={{ width: "90%", backgroundColor: "white", marginLeft: "10px", fontSize: "15px" }}>
//         <tr style={{ backgroundColor: "#4285F4", color: "white" }}>
//           <th>Questions</th>
//           <th>Marks</th>
//           <th>Comments</th>
//           <th>Edit Marks</th>
//         </tr>
//         {Array(props.questions).fill(0).map((i, index) => (
//           <>
//             <tr>
//               <td key={`${index}-${props.data.name.fullName}`}> Q{index + 1} </td>
//               <td> {props.data.review_score[index]} </td>
//               <td> {props.data.reviewer_comment[index]} </td>
//               <td><img src={editIcon} alt="edit" onClick={() => handleEditMarks()}/></td>
//             </tr>
//           </>
//         ))}
//       </table>
//       <p style={{ fontSize: "15px", fontWeight:"bold", marginTop: "10px", marginLeft: "10px" }}>View Submission :
//         <a target="_blank" rel="noreferrer" href={props.data.material_drive_link} style={{ height: "20px", marginLeft: "10px" }}>
//           <input type="text" value="Answersheet.pdf" style={{ marginTop: "8px", textAlign: "center", cursor: "pointer", backgroundColor: "white" }} ></input>
//         </a>
//       </p>
//     </div>
//   );
// };

import React from "react";
import StudentDropdown from "../dropdown/student_dropdown";


function StudentDropdown_with_content() {
  return (
    <>
      <div style={{ padding: "0%", margin:'20px', backgroundColor:'#fff'}}>
        <div
          style={{
            height: "200px",
            borderRadius:'0.5rem',
            padding: "3%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "30% 40% 30%",
              height: "100px",
            }}
          >
            <b style={{ fontSize: "1.2em" }}>Cummulative consistency score</b>
            <div />
            <div style={{ marginLeft: "auto" }}>
              <StudentDropdown/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDropdown_with_content;

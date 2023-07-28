import React from "react";
import TeacherDropdown from "../dropdown/teacher_dropdown";

function TeacherDropdown_with_content() {
  return (
    <>
      <div style={{ padding: "0%", margin: "20px", backgroundColor: "#fff" }}>
        <div
          style={{
            height: "200px",
            borderRadius: "0.5rem",
            padding: "3%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 40%",
              height: "100px",
            }}
          >
            <b style={{ fontSize: "1.2em" }}>Cummulative consistency score</b>
            <div style={{ marginLeft: "auto" }}>
              <TeacherDropdown />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherDropdown_with_content;

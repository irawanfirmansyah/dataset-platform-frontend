import React, { useState } from "react";
import { useHistory } from "react-router";
import { API_BASE_URL } from "./constants";
import NavBar from "./NavBar";

export default function CreateTask() {
  const [taskName, setTaskName] = useState("");
  const [file, setFile] = useState("");
  const [loading, setloading] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    setloading(true);
    const formData = new FormData();
    formData.append("name", taskName);
    formData.append("dataset", document.getElementById("dataset").files[0]);

    fetch(`${API_BASE_URL}/task`, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status !== 201) {
        window.alert("Failed to upload task");
        setloading(false);
        return;
      }
      res.json().then((json) => {
        window.alert(json.message);
        history.push("/task-list");
      });
    });
  };

  return (
    <>
      <NavBar />
      <div className="form-bg" style={{ marginTop: "-42px" }}>
        <div className="form-container">
          <h1>Create Task</h1>
          <form id="form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <br />
            <label htmlFor="dataset">File</label>
            <input
              id="dataset"
              name="dataset"
              onChange={(e) =>
                setFile(e.target.files[0] ? e.target.files[0].name : "")
              }
              type="file"
              accept="application/zip"
              style={{ display: "none" }}
            />
            <button
              style={{
                margin: "0 0 1em 51px",
                padding: "0.2em 1em",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "179px",
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("dataset").click();
              }}
            >
              {file.length === 0 ? "No File Chosen" : file}
            </button>
            <br />
            <input
              type="submit"
              value={loading ? "Loading" : "Upload"}
              disabled={taskName.length === 0 || file.length === 0 || loading}
            />
          </form>
        </div>
      </div>
    </>
  );
}

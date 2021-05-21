import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "./App";
import { API_BASE_URL } from "./constants";
import NavBar from "./NavBar";

export default function TaskList() {
  const auth = useAuth();
  const [data, setData] = useState({ result: [] });
  const history = useHistory();

  useEffect(() => {
    if (!auth.user) {
      history.push("/login");
      return;
    }
    const getTaskByUser = async () => {
      const res = await fetch(`${API_BASE_URL}/task/booked`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status !== 200) {
        auth.signout(() => {
          history.push("/login");
        });
        return;
      }
      const json = await res.json();
      setData(json);
    };
    getTaskByUser();
  }, [auth, history]);

  return (
    <>
      <NavBar />
      <div className="task-bg">
        <div className="task-container">
          <h1>Task List</h1>
          <div>
            {data.result.length > 0 ? (
              <TaskListComponent listTask={data.result} />
            ) : (
              "Task is empty"
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TaskListComponent({ listTask }) {
  return (
    <div className="task-list">
      {listTask.map((item) => (
        <TaskRow key={item.task_id} {...item} />
      ))}
    </div>
  );
}

function TaskRow(item) {
  const auth = useAuth();

  const handleDownload = (item) => {
    if (item.task_id) {
      fetch(`${API_BASE_URL}/task/download?task_id=${item.task_id}`, {
        method: "GET",
      })
        .then((res) => res.blob())
        .then((blob) => {
          let fileName = item.file_path.substring(8);
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    }
  };

  const handleInvoke = (taskName) => {
    if (taskName) {
      let reqBody = {
        user_id: auth.user.id,
        task_name: taskName,
      };
      fetch(`${API_BASE_URL}/user_task`, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.status !== 200) {
          window.alert("Failed book task");
          return;
        }
        res.json().then((json) => {
          window.alert(json.message);
          window.location.reload();
        });
      });
    }
  };

  const handleRevoke = (item) => {
    if (item.user_id && item.task_id) {
      let reqBody = {
        user_id: item.user_id,
        task_id: item.task_id,
      };
      fetch(`${API_BASE_URL}/user_task`, {
        method: "DELETE",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.status !== 200) {
          window.alert("Failed revoke task");
          return;
        }
        res.json().then((json) => {
          window.alert(json.message);
          window.location.reload();
        });
      });
    }
  };

  const handleDelete = (taskId) => {
    if (taskId) {
      fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.status !== 200) {
          window.alert("Failed delete task");
          return;
        }
        res.json().then((json) => {
          window.alert(json.message);
          window.location.reload();
        });
      });
    }
  };

  const canDownloadOrRevoke = item.user_id === auth.user.id;
  return (
    <div>
      <p>{item.name}</p>
      <span
        style={{
          cursor: canDownloadOrRevoke ? "pointer" : "default",
          color: canDownloadOrRevoke ? "black" : "#DDDD",
        }}
        onClick={canDownloadOrRevoke ? () => handleDownload(item) : () => {}}
      >
        <i className="fas fa-download"></i>
        Download
      </span>
      <span
        style={{ cursor: "pointer" }}
        onClick={
          canDownloadOrRevoke
            ? () => handleRevoke(item)
            : () => handleInvoke(item.name)
        }
      >
        <i className="fas fa-hand-pointer"></i>
        {canDownloadOrRevoke ? "Revoke" : "Invoke"}
      </span>
      <span
        style={{
          cursor: "pointer",
        }}
        onClick={() => handleDelete(item.task_id)}
      >
        <i className="fas fa-trash"></i>
        Delete
      </span>
    </div>
  );
}

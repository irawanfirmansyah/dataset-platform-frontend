import { createContext, useContext, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import TaskList from "./TaskList";
import CreateTask from "./CreateTask";
import { API_BASE_URL } from "./constants";

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  function getUser() {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    return user;
  }

  function getAuthToken() {
    const userToken = localStorage.getItem("token");
    return userToken;
  }

  const [user, setUser] = useState(getUser());
  const [, setToken] = useState(getAuthToken());
  const [error, setError] = useState(false);

  const signin = (bodyJson, cb) => {
    return fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(bodyJson),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.status !== 200) {
        setError(true);
        return;
      }
      res.json().then((json) => {
        setUser(json.user);
        setToken(json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        localStorage.setItem("token", json.token);
        cb();
      });
    });
  };

  const signout = (cb) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setError(false);
    cb();
  };

  return {
    user,
    error,
    signin,
    signout,
  };
}

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/task-list">
            <TaskList />
          </Route>
          <Route path="/create-task">
            <CreateTask />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;

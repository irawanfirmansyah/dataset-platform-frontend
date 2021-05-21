import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "./App";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassowrd] = React.useState("");
  const history = useHistory();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      history.push("/task-list");
    }
  }, [auth, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bodyJson = {
      email,
      password,
    };

    await auth.signin(bodyJson, () => {
      history.push("/task-list");
    });
  };

  return (
    <div className="form-bg">
      <div className="form-container">
        <h1>Dataset Management Platform</h1>
        <form id="form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
          />
          <br />
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassowrd(e.target.value)}
            type="password"
            id="password"
            name="password"
          />
          <br />
          <input
            type="submit"
            value="Login"
            disabled={email.length === 0 || password.length === 0}
          />
          {auth.error && (
            <p style={{ marginTop: "0.2em", color: "red" }}>
              Wrong username or password.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

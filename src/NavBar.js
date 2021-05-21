import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "./App";

export default function NavBar() {
  let auth = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    auth.signout(() => {
      history.push("/login");
    });
  };

  return auth.user ? (
    <nav>
      <ul>
        <li>
          <Link to="/task-list">Task List</Link>
        </li>
        <li>
          <Link to="/create-task">Create Task</Link>
        </li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  ) : null;
}

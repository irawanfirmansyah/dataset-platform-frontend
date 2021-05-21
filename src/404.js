import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Page you find doesn't exist</h1>
      <Link to="/task-list">
        <h3>Go back to main page</h3>
      </Link>
    </div>
  );
}

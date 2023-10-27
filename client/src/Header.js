import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      // setUserInfo(null);
      .then((response) => {
        if (response.ok) {
          setUserInfo(null);
        } else {
          console.error("Logout failed");
        }
      })
      .catch((err) => {
        console.error("Error during Logout:", err);
      });
  }
  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {/* if there is username */}
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <Link onClick={logout}>Logout ({username})</Link>
          </>
        )}
        {/* if there is no username */}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

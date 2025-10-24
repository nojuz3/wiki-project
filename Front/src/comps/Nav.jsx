import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/L._Corp.png"

export default function Nav() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loggedin, setLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      setLoggedin(false);
      setLoading(false);
      setUser(null);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setLoggedin(true);
          setUser(res.data.user.username);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedin(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <nav class="nav">
        <div class="nav-left">Nav</div>
      </nav>
    );
  }

  return (
    <nav class="nav">
      <div class="nav-left"><img src={logo} width={"25px"} height={"25px"}></img><p>Lobotomy Corporations Abnormality Encyclopedia</p></div>
      {!loggedin ? (
        <div class="nav-right">
          {" "}
          <a class="nav-login" href="http://localhost:5173/wiki/Register">
            Create an account
          </a>{" "}
          <a class="nav-login" href="http://localhost:5173/wiki/Login">
            Login
          </a>
        </div>
      ) : (
        <div class="nav-right">
          {user}
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </nav>
  );
}

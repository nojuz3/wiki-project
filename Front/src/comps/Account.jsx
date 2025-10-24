import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Account() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isRegister = path === "/Register";
  const isLogin = path === "/Login";

  const loginhandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/pages/login", {
        username,
        password,
      });
      setToken(res.data.token);
      if (res.data.success) {
        alert("Login success");
        localStorage.setItem("token", res.data.token); // save JWT
        navigate("/")
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
    setEmail("");
    setPassword("");
    setUsername("");
  };
  const registerhandle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/pages/register", {
        email,
        username,
        password,
      });
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err) {
      console.log(err);
    }
  };

  if (isRegister) {
    console.log("register page");
  }

  return (
    <div>
      {isLogin && (
        <div class="login-box">
          <h1>Login</h1>
          <form onSubmit={loginhandle}>
            <label>Username</label>
            <input
              type="text"
              required
              minLength={4}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>

            <label>Password</label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Login</button>
          </form>
          <p>Don't have an Account? <a href="./Register">Click here to register</a></p>
        </div>
      )}
      {isRegister && (
        <div class="login-box">
          <h1>Register</h1>
          <form onSubmit={registerhandle}>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label>Username</label>
            <input
              type="text"
              required
              minLength={4}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
  
            <label>Password</label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Register</button>
          </form>
          <p>Already have an Account? <a href="./Login">Click here to login</a></p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Content from "./comps/Content";
import Nav from "./comps/Nav";
import Abnos from "./comps/Abnos";
import Account from "./comps/Account";
import image from "./assets/downloa.png";
import Confirm from "./comps/Confirm";

function App() {
  const [cuser,setCuser] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      return;
    }
    const user = async() => {
      try {
      const res = await axios.get("http://localhost:8080/api/pages/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
          setCuser(res.data.user);
        }
    } catch (error) {
      localStorage.removeItem("token");
      console.log(error);
    }
    };
    user();
  }, []);

  return (
    <>
      <Router basename="/wiki">
        <Nav />
        <div class="main">
          <aside class="aside">
            <div class="aside-inner">
              <Link to="/"><img class="side-img" src={image}></img></Link>
              <br />
              <Link  class="x" to="/">
                Main
              </Link>
              <br />
              <Link class="x" to="/Abnormalities">Abnormalities</Link>
              <br />
              {cuser.role === "admin" &&(
                <Link class="x" to="/Confirm">Confirm</Link>
              )}
            </div>
          </aside>
          <main>
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/Abnormalities" element={<Abnos />} />
              <Route path="/Abnormalities/:slug" element={<Content />} />
              <Route path="/Login" element={<Account />} />
              <Route path="/Register" element={<Account />} />
              <Route path="/Confirm" element={<Confirm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;

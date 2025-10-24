import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Content from "./Content";
import axios from "axios";

export default function Abnos() {
  const token = localStorage.getItem("token");
  const [pages, setPages] = useState(null);
  const [title, setTitle] = useState("");
  const [pagedelete, setPagedelete] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      try {
        axios
          .get(`http://localhost:8080/api/pages/`)
          .then((res) => setPages(res.data))
          .catch((err) => console.error(err));
      } catch (err) {
        console.log(err);
      }
    };
    const fetchImg = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/all");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchUser();
    }
    fetchImg();
    fetchData();
  }, []);
  const handleClick = async () => {
    if (!title) return;
    try {
      await axios.post("http://localhost:8080/api/pages/", {
        title: title,
      });
      setTitle("");
    } catch (err) {
      console.log(err);
    }
  };
  const hangleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmed) return;
    try {
      await axios.post(
        "http://localhost:8080/api/pages/delete",
        {
          title: pagedelete,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  function cycle(data) {
    const mapping = {};
    for (const i in data) {
      const pageId = data[i].page_id;
      const image = data[i].Image;
      mapping[pageId] = image;
    }

    console.log(mapping);
    return mapping;
  }
  const mapping = cycle(data);

  return (
    <div>
      {user.role === "admin" && (
        <div>
          <div>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={() => handleClick()}>Create</button>
          </div>
          <div>
            <select
              value={pagedelete}
              onChange={(e) => setPagedelete(e.target.value)}
            >
              {pages &&
                pages.map((e, index) => (
                  <option key={e.id || index}>{e.title}</option>
                ))}
            </select>
            <button onClick={() => hangleDelete()}>Delete</button>
          </div>
        </div>
      )}
      <div class="abno-content">
        {pages &&
          pages.map((e, index) => (
            <div class="abno-box" style={{backgroundImage: `url(${mapping[e.id]})` }} id={e.id} key={e.id || index}>
              <a href={`/wiki/Abnormalities/${e.slug}`}>{e.title}</a>
            </div>
          ))}
      </div>
    </div>
  );
}

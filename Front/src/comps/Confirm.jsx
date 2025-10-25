import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
export default function Confirm() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(null);

  function check(user) {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          check(res.data.user);
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
        check("false");
      }
    };
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/pages/all/changes"
        );
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    fetchUser();
  }, []);

  const toggleCollapse = (index) => {
    setOpen(open === index ? null : index);
  };
  const handleConfirm = async (changes) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/pages/finalize",
        {
          id: changes.id,
          identifier: changes.identifier,
          title: changes.title,
          description_md: changes.description_md,
          damage_type: changes.damage_type,
          damage: changes.damage,
          Qliphoth: changes.Qliphoth,
          Image: changes.Image,
          risk_level: changes.risk_level,
          content_id: changes.content_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.message) {
        alert("Page updated successfully!");
        setData((prev) => prev.filter((e) => e.id !== changes.id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (changes) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/pages/changes/delete",
        {
          id: changes.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prev) => prev.filter((e) => e.id !== changes.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="confirm-box">
      {data &&
        data.map((e, index) => (
          <div class="confirm-all" key={e.id || index}>
            <div class="confirm-colaps" onClick={() => toggleCollapse(index)}>
              <p>
                <strong>Title:</strong> {e.username}
              </p>
            </div>
            <div>
              <button onClick={() => handleConfirm(e)}>CONFIRM</button>
              <button onClick={() => handleDelete(e)}>DELETE</button>
            </div>
            {open === index && (
              <div>
                {e.title && (
                  <p>
                    <strong>Title:</strong> {e.title}
                  </p>
                )}
                {e.identifier && (
                  <p>
                    <strong>Identifier:</strong> {e.identifier}
                  </p>
                )}
                {e.damage_type && (
                  <p>
                    <strong>Damage Type:</strong> {e.damage_type}
                  </p>
                )}
                {e.damage && (
                  <p>
                    <strong>Damage:</strong> {e.damage}
                  </p>
                )}
                {e.Qliphoth && (
                  <p>
                    <strong>Qliphoth:</strong> {e.Qliphoth}
                  </p>
                )}
                {e.Image && (
                  <p>
                    <strong>Image:</strong>{" "}
                    <img src={e.Image} alt={e.title || "Image"} width="100" />
                  </p>
                )}
                {e.risk_level && (
                  <p>
                    <strong>Risk Level:</strong> {e.risk_level}
                  </p>
                )}
                {e.description_md && (
                  <div>
                    <strong>Description:</strong>{" "}
                    <Markdown>{e.description_md}</Markdown>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

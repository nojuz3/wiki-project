import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const token = localStorage.getItem("token");

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
    fetchUser();
  }, []);

  return(
    <div class="confirm-box">
        
    </div>
  );
}

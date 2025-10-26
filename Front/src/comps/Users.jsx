import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchUsers();
    fetchUser();
  }, []);
  const handleRoleChange = async (userid, newrole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userid ? { ...user, role: newrole } : user
      )
    );
    try {
      const res = await axios.post(
        "http://localhost:8080/api/pages/updateRole",
        { id: userid, role: newrole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const filteredUsers = users.filter((index) =>
    index.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div class="confirm-box">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          class="search-input"
        />
      </div>

      <div className="user-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={user.userid || index} class="users">
              <p>User: {user.username}</p>
              <p>Email: {user.email}</p>
              <label >Role:</label>
              <select 
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
              >
                <option value="viewer">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

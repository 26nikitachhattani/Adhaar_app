import { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient"; // adjust path if needed

function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/users")
      .then((res) => {
        console.log("API Response:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message || "Something went wrong");
      });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.phoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
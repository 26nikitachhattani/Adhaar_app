import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../lib/axiosClient";

function UserDetail() {
  const { id } = useParams(); // 👈 get id from URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const usr = JSON.parse(localStorage.getItem("user"));
  const userId = usr ? usr.id : null;
  console.log(userId);

  useEffect(() => {
    axiosClient
      .get(`/users/${userId}`)
      .then((res) => {
        console.log("User Detail:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("User not found or API error");
      });
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!user) return <h3>Loading...</h3>;

  return (
    <div>
      <h1>User Detail Page</h1>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Aadhaar:</b> {user.aadhaarNumber}</p>
      <p><b>Phone:</b> {user.phoneNumber}</p>
    </div>
  );
}

export default UserDetail;
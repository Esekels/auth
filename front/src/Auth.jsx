import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/register",
        { username, password },
        { withCredentials: true }
      );
      alert("User registered");
    } catch (error) {
      console.error(error);
      alert("Failed to register");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password },
        { withCredentials: true }
      );
      alert(`Logged in as ${response.data.username}`);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to log in");
    }
  };

  return (
    <div>
      <h1>Authentication</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Auth;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api"
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 Call Laravel API (adjust URL to your backend)
      const response = await api.post("/login", {
        email,
        password,
        });
      if (response.data.access_token) {
         const token = response.data.access_token;
         localStorage.setItem("token", token);
       // localStorage.setItem("token", response.data.access_token); // save token
       // localStorage.setItem("user", JSON.stringify(response.data.user)); // optional: store user info
         dispatch(login({ token }));
        navigate("/dashboard"); // redirect to admin dashboard
      } else {
        alert("Invalid login response!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-xl p-6 w-96"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
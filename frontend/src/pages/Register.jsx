import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
  try {
    const res = await API.post("/auth/register", form);

    // ✅ store token
    localStorage.setItem("token", res.data.token);

    alert("Registered successfully");

    // ✅ redirect to dashboard
    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
};

  return (
<>
  <Navbar />
  <div className="h-screen flex items-center justify-center bg-gray-100">
    
  
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Register
        </button>
        <p className="text-sm mt-4 text-center">
     Already have an account?{" "}
     <span
    className="text-green-500 cursor-pointer"
    onClick={() => navigate("/")}
     >
    Login
      </span>
    </p>
      </div>
    </div>
    </div>
</>
  );
}
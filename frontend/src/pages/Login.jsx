import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 const handleSubmit = async () => {
  try {
    const res = await API.post("/auth/login", form);

    console.log("LOGIN SUCCESS:", res.data);

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Error");
  }
};

  return (
    <>
  <Navbar />
  <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

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
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  </div>
</>
  );
}
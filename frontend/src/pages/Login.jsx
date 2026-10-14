import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  <Navbar />
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f4f6f2] px-5 py-12">
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-xl border border-[#e4e9e3] bg-white p-8 shadow-sm">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#145b4c]">Faculty collective</p>
        <h2 className="font-serif text-3xl text-[#20342f]">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-500">Sign in to your EduNexus workspace.</p>
      </div>
      <label className="block text-sm font-medium text-gray-700">Email address
        <input type="email" autoComplete="email" required value={form.email} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block text-sm font-medium text-gray-700">Password
        <input type="password" autoComplete="current-password" required value={form.password} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-[#145b4c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#103f35] disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-gray-600">New to EduNexus? <button type="button" className="font-semibold text-[#145b4c] underline-offset-2 hover:underline" onClick={() => navigate("/register")}>Create an account</button></p>
    </form>
  </div>
</>
  );
}
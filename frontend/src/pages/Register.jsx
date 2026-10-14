import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });
      if (!res.data?.token || !res.data?.user) {
        throw new Error("The server returned an incomplete account response.");
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response
            ? "We couldn't create your account. Please try again."
            : "Unable to reach EduNexus. Check that the backend is running and VITE_API_URL is correct.")
      );
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
        <h2 className="font-serif text-3xl text-[#20342f]">Join EduNexus</h2>
        <p className="mt-2 text-sm text-gray-500">Build a richer teaching practice with colleagues across institutions.</p>
      </div>
      <label className="block text-sm font-medium text-gray-700">Full name
        <input type="text" autoComplete="name" required minLength={2} maxLength={80} value={form.name} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block text-sm font-medium text-gray-700">Institutional email
        <input type="email" autoComplete="email" required maxLength={254} value={form.email} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block text-sm font-medium text-gray-700">Password
        <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={form.password} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-[#145b4c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#103f35] disabled:opacity-60">
        {loading ? "Creating account..." : "Create faculty account"}
      </button>
      <p className="text-center text-sm text-gray-600">Already a member? <button type="button" className="font-semibold text-[#145b4c] underline-offset-2 hover:underline" onClick={() => navigate("/")}>Sign in</button></p>
    </form>
  </div>
</>
  );
}
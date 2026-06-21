import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { AuthCard, AuthLink } from "@/app/components/AuthCard";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <AuthCard
      title="Join the movement"
      subtitle="Register as a GYSC member to stay connected with programmes, forums, and global youth policy work."
      footer={
        <p style={{ fontSize: 14, color: "#64748B" }}>
          Already have an account? <AuthLink to="/login">Sign in</AuthLink>
        </p>
      }
    >
      {success ? (
        <p style={{ color: "#0f9f6f", fontWeight: 600, textAlign: "center", padding: "20px 0" }}>Registration successful! Redirecting...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-fields">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <button className="btn btn-teal btn-fw" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create member account"} <ArrowRight size={16} />
          </button>
        </form>
      )}
    </AuthCard>
  );
}

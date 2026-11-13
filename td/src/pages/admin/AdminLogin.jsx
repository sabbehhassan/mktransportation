
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../constants/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("Login token was not received from the server.");
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-black)] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-3xl font-bold text-[var(--brand-black)] shadow-lg shadow-[var(--brand-gold)]/20">
            S
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            MK Transportation
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-gray)]">
            Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">
              Admin Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--brand-gray)]">
              Sign in to manage carrier agreements, deposits, and loads.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white/85"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your admin email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] px-4 py-3 text-white outline-none transition placeholder:text-[var(--brand-gray)] focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white/85"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] px-4 py-3 text-white outline-none transition placeholder:text-[var(--brand-gray)] focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-gold)] px-4 py-3 font-semibold text-[var(--brand-black)] transition hover:bg-[var(--brand-gold-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--brand-dark-gray)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--brand-border)] pt-5 text-center">
            <p className="text-xs text-[var(--brand-gray)]">
              Authorized personnel only. Secure admin access.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--brand-gray)]">
          © {new Date().getFullYear()} MK Transportation
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

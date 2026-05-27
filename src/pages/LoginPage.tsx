import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./services/authService";
import toast from "react-hot-toast";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("error");

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const result = await login(email, password);

            if (rememberMe) {
                localStorage.setItem("token", result.token);
            } else {
                sessionStorage.setItem("token", result.token);
            }

            window.dispatchEvent(new Event("authChanged"));
            toast.success("Logged in successfully");
            navigate("/");
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            setMessageType("error");
            setMessage("Invalid email or password.");
            toast.error("Invalid email or password");
        }
    }

    return (
        <div className="auth-layout">
            <section className="auth-brand-panel">
                <div className="auth-brand-content">
                    <span className="auth-logo">JoinUp</span>
                    <h1>Find people. Build moments.</h1>
                    <p>
                        Join events, create experiences, and connect with people around
                        shared interests.
                    </p>

                    <div className="auth-highlights">
                        <span>✨ Discover events</span>
                        <span>🤝 Join communities</span>
                        <span>🚀 Create your own</span>
                    </div>
                </div>
            </section>

            <section className="auth-form-panel">
                <div className="auth-card auth-card-v2">
                    <h1>Welcome back</h1>

                    <p className="auth-subtitle">
                        Log in to manage your events and join new ones.
                    </p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>

                        {message && (
                            <div className={`form-message ${messageType}`}>
                                {message}
                            </div>
                        )}

                        <button className="primary-btn auth-submit-btn" type="submit">
                            Login
                        </button>

                        <p className="auth-switch-text">
                            New to JoinUp?{" "}
                            <Link to="/register">Create an account</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;
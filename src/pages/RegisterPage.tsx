import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./services/authService";
import toast from "react-hot-toast";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] =
        useState<"success" | "error">("error");

    const navigate = useNavigate();

    function validatePassword() {
        if (password.length < 6) return "Password must be at least 6 characters.";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return "";
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const validationError = validatePassword();

        if (validationError) {
            setMessageType("error");
            setMessage(validationError);
            toast.error(validationError);
            return;
        }

        try {
            await register(email, password);

            setMessageType("success");
            setMessage("Registration successful.");
            toast.success("Registration successful");

            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            console.error("REGISTER ERROR:", error);
            setMessageType("error");
            setMessage("Registration failed. Try another email.");
            toast.error("Registration failed");
        }
    }

    return (
        <div className="auth-layout">
            <section className="auth-brand-panel">
                <div className="auth-brand-content">
                    <span className="auth-logo">JoinUp</span>

                    <h1>Create events. Meet people.</h1>

                    <p>
                        Start your JoinUp journey and create events that bring
                        people together.
                    </p>

                    <div className="auth-highlights">
                        <span>🚀 Create events</span>
                        <span>🤝 Build communities</span>
                        <span>🎯 Find your people</span>
                    </div>
                </div>
            </section>

            <section className="auth-form-panel">
                <div className="auth-card auth-card-v2">
                    <h1>Create account</h1>

                    <p className="auth-subtitle">
                        Sign up and start organizing events in just a few clicks.
                    </p>

                    <form onSubmit={handleRegister}>
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
                                    placeholder="Create a password"
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

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <p className="password-hint">
                            6+ characters, one uppercase letter and one number.
                        </p>

                        {message && (
                            <div className={`form-message ${messageType}`}>
                                {message}
                            </div>
                        )}

                        <button className="primary-btn auth-submit-btn" type="submit">
                            Create Account
                        </button>

                        <p className="auth-switch-text">
                            Already have an account?{" "}
                            <Link to="/login">Login here</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default RegisterPage;
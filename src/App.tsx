import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import JoinedEventsPage from "./pages/JoinedEventsPage";
import MyEventsPage from "./pages/MyEventsPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AdminPage from "./pages/AdminPage";
import { isAdmin } from "./pages/services/authUtils";

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Navbar />

                <main className="app-container page-section">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route
                            path="/create-event"
                            element={
                                <ProtectedRoute>
                                    <CreateEventPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/joined-events"
                            element={
                                <ProtectedRoute>
                                    <JoinedEventsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-events"
                            element={
                                <ProtectedRoute>
                                    <MyEventsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    {isAdmin() ? <AdminPage /> : <HomePage />}
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/edit-event/:id"
                            element={
                                <ProtectedRoute>
                                    <EditEventPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/event/:id"
                            element={
                                <ProtectedRoute>
                                    <EventDetailsPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>

                    <footer className="site-footer">
                        <div className="app-container footer-inner">
                            <div>
                                <strong>JoinUp</strong>
                                <p>Find people. Join events. Build connections.</p>
                            </div>

                            <div className="footer-copy">
                                © 2026 JoinUp
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
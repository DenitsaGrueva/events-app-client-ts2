import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getAdminEvents,
    getAdminUsers,
    deleteEventAsAdmin,
    restoreEventAsAdmin
} from "./services/adminService";

type AdminEvent = {
    id: number;
    title: string;
    description?: string;
    city?: string;
    location?: string;
    startAt?: string;
    neededPeople?: number;
    createdByUserId?: string;
    isDeleted: boolean;
};

type AdminUser = {
    id: string;
    email: string;
    userName: string;
};

function AdminPage() {
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [activeTab, setActiveTab] = useState<"events" | "users">("events");
    const [loading, setLoading] = useState(true);

    const [eventSearch, setEventSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [eventStatusFilter, setEventStatusFilter] =
        useState<"all" | "active" | "deleted">("all");

    useEffect(() => {
        void loadAdminData();
    }, []);

    async function loadAdminData() {
        try {
            setLoading(true);

            const [eventsData, usersData] = await Promise.all([
                getAdminEvents(),
                getAdminUsers(),
            ]);

            setEvents(eventsData);
            setUsers(usersData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Admin data failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEvent(id: number) {
        try {
            await deleteEventAsAdmin(id);
            toast.success("Event deleted by admin");
            await loadAdminData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        }
    }

    async function handleRestoreEvent(id: number) {
        try {
            await restoreEventAsAdmin(id);
            toast.success("Event restored by admin");
            await loadAdminData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Restore failed");
        }
    }

    const activeEvents = events.filter((event) => !event.isDeleted).length;
    const deletedEvents = events.filter((event) => event.isDeleted).length;

    const totalEvents = events.length || 1;

    const activePercent = Math.round((activeEvents / totalEvents) * 100);
    const deletedPercent = Math.round((deletedEvents / totalEvents) * 100);

    const cityStats = Object.entries(
        events.reduce((acc, event) => {
            const city = event.city || "Unknown";
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const mostActiveCity =
        events
            .filter((event) => event.city)
            .reduce((acc, event) => {
                const city = event.city || "Unknown";
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

    const topCity =
        Object.entries(mostActiveCity).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "No data";

    const deletedPercentage =
        events.length === 0
            ? 0
            : Math.round((deletedEvents / events.length) * 100);

    const filteredEvents = events.filter((event) => {
        const search = eventSearch.toLowerCase();

        const matchesSearch =
            event.title.toLowerCase().includes(search) ||
            event.city?.toLowerCase().includes(search) ||
            event.location?.toLowerCase().includes(search);

        const matchesStatus =
            eventStatusFilter === "all" ||
            (eventStatusFilter === "active" && !event.isDeleted) ||
            (eventStatusFilter === "deleted" && event.isDeleted);

        return matchesSearch && matchesStatus;
    });

    const filteredUsers = users.filter((user) => {
        const search = userSearch.toLowerCase();

        return (
            user.email?.toLowerCase().includes(search) ||
            user.userName?.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return <div className="loading-card">Loading admin dashboard...</div>;
    }

    return (
        <div className="admin-page">
            <section className="admin-hero">
                <div>
                    <p className="section-kicker">Admin area</p>
                    <h1>Platform Dashboard</h1>
                    <p>
                        Manage JoinUp events, users, and platform activity from one place.
                    </p>
                </div>

                <div className="admin-hero-badge">Admin Access</div>
            </section>

            <section className="admin-stats">
                <div className="admin-stat-card">
                    <span>{events.length}</span>
                    <p>Total events</p>
                </div>

                <div className="admin-stat-card">
                    <span>{activeEvents}</span>
                    <p>Active events</p>
                </div>

                <div className="admin-stat-card">
                    <span>{deletedEvents}</span>
                    <p>Deleted events</p>
                </div>

                <div className="admin-stat-card">
                    <span>{users.length}</span>
                    <p>Total users</p>
                </div>

                <div className="admin-stat-card">
                    <span>{topCity}</span>
                    <p>Most active city</p>
                </div>

                <div className="admin-stat-card">
                    <span>{deletedPercentage}%</span>
                    <p>Deleted rate</p>
                </div>
            </section>

            <section className="admin-charts">
                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3>Events status</h3>
                        <p>Active vs deleted events</p>
                    </div>

                    <div className="status-chart">
                        <div>
                            <span>Active</span>
                            <div className="chart-bar">
                                <div
                                    className="chart-fill active"
                                    style={{ width: `${activePercent}%` }}
                                ></div>
                            </div>
                            <strong>{activePercent}%</strong>
                        </div>

                        <div>
                            <span>Deleted</span>
                            <div className="chart-bar">
                                <div
                                    className="chart-fill deleted"
                                    style={{ width: `${deletedPercent}%` }}
                                ></div>
                            </div>
                            <strong>{deletedPercent}%</strong>
                        </div>
                    </div>
                </div>

                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3>Top cities</h3>
                        <p>Most active event locations</p>
                    </div>

                    <div className="city-chart">
                        {cityStats.map(([city, count]) => (
                            <div className="city-chart-row" key={city}>
                                <span>{city}</span>

                                <div className="chart-bar">
                                    <div
                                        className="chart-fill city"
                                        style={{
                                            width: `${Math.min(
                                                (count / events.length) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>

                                <strong>{count}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="admin-tabs">
                <button
                    className={activeTab === "events" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("events")}
                >
                    Events
                </button>

                <button
                    className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
            </div>

            {activeTab === "events" ? (
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h3>Events</h3>
                            <p>Review active and deleted events.</p>
                        </div>
                    </div>

                    <div className="admin-toolbar">
                        <input
                            type="text"
                            placeholder="Search events by title, city, location..."
                            value={eventSearch}
                            onChange={(e) => setEventSearch(e.target.value)}
                        />

                        <select
                            value={eventStatusFilter}
                            onChange={(e) =>
                                setEventStatusFilter(
                                    e.target.value as "all" | "active" | "deleted"
                                )
                            }
                        >
                            <option value="all">All events</option>
                            <option value="active">Active only</option>
                            <option value="deleted">Deleted only</option>
                        </select>
                    </div>

                    <div className="admin-table">
                        {filteredEvents.length === 0 ? (
                            <div className="empty-state">No events match your filters.</div>
                        ) : (
                            filteredEvents.map((event) => (
                                <div className="admin-row" key={event.id}>
                                    <div className="admin-row-main">
                                        <span className="admin-id">#{event.id}</span>

                                        <div>
                                            <strong>{event.title}</strong>
                                            <p>
                                                {event.city || "No city"} •{" "}
                                                {event.location || "No location"}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={
                                            event.isDeleted
                                                ? "admin-badge deleted"
                                                : "admin-badge active"
                                        }
                                    >
                                        {event.isDeleted ? "Deleted" : "Active"}
                                    </span>

                                    <div className="admin-row-actions">
                                        {!event.isDeleted ? (
                                            <button
                                                className="danger-btn"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button
                                                className="secondary-btn"
                                                onClick={() => handleRestoreEvent(event.id)}
                                            >
                                                Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            ) : (
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <h3>Users</h3>
                            <p>All registered JoinUp accounts.</p>
                        </div>
                    </div>

                    <div className="admin-toolbar single">
                        <input
                            type="text"
                            placeholder="Search users by email or username..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                    </div>

                    <div className="admin-table">
                        {filteredUsers.length === 0 ? (
                            <div className="empty-state">No users match your search.</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div className="admin-row user-row" key={user.id}>
                                    <div className="admin-user-avatar">
                                        {user.email?.charAt(0).toUpperCase() || "U"}
                                    </div>

                                    <div>
                                        <strong>{user.email}</strong>
                                        <p>{user.userName}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

export default AdminPage;
import { useEffect, useState } from "react";
import { getEvents, joinEvent, leaveEvent } from "./services/eventService";
import type { Event } from "../types/Event";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const categories = [
        "All",
        "Sports",
        "Music",
        "Party",
        "Travel",
        "Gaming",
        "Business",
        "Study",
        "Food",
        "Outdoors",
        "Networking",
        "Other",
    ];

    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState("");

    const [keyword, setKeyword] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void loadEvents();
    }, []);

    async function loadEvents() {
        try {
            setLoading(true);

            const data = await getEvents();

            if (Array.isArray(data)) {
                setEvents(data);
            } else if (Array.isArray(data.data)) {
                setEvents(data.data);
            } else {
                setError("Unexpected data format");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    async function handleJoin(id: number) {
        try {
            await joinEvent(id);
            toast.success("Joined successfully");
            await loadEvents();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error joining event"
            );
        }
    }

    async function handleLeave(id: number) {
        try {
            await leaveEvent(id);
            toast.success("Left event successfully");
            await loadEvents();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error leaving event"
            );
        }
    }

    const filteredEvents = events.filter((event) => {
        const keywordMatch =
            event.title
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
            event.description
                .toLowerCase()
                .includes(keyword.toLowerCase());

        const cityMatch =
            !cityFilter ||
            event.city
                ?.toLowerCase()
                .includes(cityFilter.toLowerCase()) ||
            event.location
                ?.toLowerCase()
                .includes(cityFilter.toLowerCase());

        const dateMatch =
            !dateFilter ||
            event.startAt?.slice(0, 10) === dateFilter;

        const categoryMatch =
            categoryFilter === "All" ||
            (event.category || "Other") === categoryFilter;

        return (
            keywordMatch &&
            cityMatch &&
            dateMatch &&
            categoryMatch
        );
    });

    return (
        <div>
            <section className="hero-card hero-split">
                <div className="hero-orb one"></div>
                <div className="hero-orb two"></div>
                <div className="hero-orb three"></div>

                <div className="hero-content">
                    <div className="badge badge-glass">
                        Discover • Join • Organize
                    </div>

                    <h1>
                        Find people. Build moments. Create memories.
                    </h1>

                    <p>
                        A modern platform for discovering activities,
                        creating your own events, and connecting
                        people around shared interests.
                    </p>

                    <div className="hero-actions">
                        <Link
                            to="/create-event"
                            className="primary-btn hero-link-btn"
                        >
                            Create Event
                        </Link>

                        <a
                            href="#events-section"
                            className="secondary-btn hero-link-btn"
                        >
                            Explore Events
                        </a>
                    </div>
                </div>

                <div className="hero-stats hero-stats-premium">
                    <div className="stat-card">
                        <span className="stat-number">
                            {events.length}
                        </span>
                        <span className="stat-label">
                            Live events
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-number">
                            Fast
                        </span>
                        <span className="stat-label">
                            Simple event management
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-number">
                            Smart
                        </span>
                        <span className="stat-label">
                            Modern user experience
                        </span>
                    </div>
                </div>
            </section>

            <section className="category-strip">
                {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                        <button
                            key={category}
                            className={
                                categoryFilter === category
                                    ? "category-tile active"
                                    : "category-tile"
                            }
                            onClick={() => setCategoryFilter(category)}
                        >
                            <span>
                                {category === "Sports"}
                                {category === "Music"}
                                {category === "Party"}
                                {category === "Travel"}
                                {category === "Gaming"}
                                {category === "Business"}
                                {category === "Study"}
                                {category === "Food"}
                                {category === "Outdoors"}
                                {category === "Networking"}
                                {category === "Other"}
                            </span>
                            {category}
                        </button>
                    ))}
            </section>

            <div className="search-panel search-panel-premium">
                <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="City or location..."
                    value={cityFilter}
                    onChange={(e) =>
                        setCityFilter(e.target.value)
                    }
                />

                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(e.target.value)
                    }
                />

                <select
                    value={categoryFilter}
                    onChange={(e) =>
                        setCategoryFilter(
                            e.target.value
                        )
                    }
                >
                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

                <button
                    className="secondary-btn"
                    onClick={() => {
                        setKeyword("");
                        setCityFilter("");
                        setDateFilter("");
                        setCategoryFilter("All");
                    }}
                >
                    Clear
                </button>
            </div>

            <div
                className="section-header"
                id="events-section"
            >
                <div>
                    <p className="section-kicker">
                        Browse opportunities
                    </p>

                    <h2 className="section-title">
                        Featured Events
                    </h2>
                </div>
            </div>

            {loading && (
                <div className="loading-card">
                    Loading events...
                </div>
            )}

            {error && <p>{error}</p>}

            {!loading &&
                filteredEvents.length === 0 ? (
                <div className="empty-state">
                    <p>No events found.</p>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map((event) => {
                        const progress =
                            Math.min(
                                (event.participantsCount /
                                    event.neededPeople) *
                                100,
                                100
                            );

                        return (
                            <article
                                key={event.id}
                                className="event-card premium-card event-card-v2"
                                onClick={() =>
                                    navigate(
                                        `/event/${event.id}`
                                    )
                                }
                            >
                                <div className="event-card-glow"></div>

                                <div className="event-card-top">
                                    {event.isFull ? (
                                        <div className="badge badge-red">
                                            Full
                                        </div>
                                    ) : event.isJoined ? (
                                        <div className="badge badge-green">
                                            Joined
                                        </div>
                                    ) : (
                                        <div className="badge badge-blue">
                                            Open Event
                                        </div>
                                    )}

                                    <div className="top-tags">
                                        {event.city && (
                                            <span className="mini-tag">
                                                {
                                                    event.city
                                                }
                                            </span>
                                        )}

                                        <span
                                            className={`category-badge category-${(event.category || "other").toLowerCase()}`}
                                        >
                                            {event.category === "Sports"}
                                            {event.category === "Music"}
                                            {event.category === "Party"}
                                            {event.category === "Travel"}
                                            {event.category === "Gaming"}
                                            {event.category === "Business"}
                                            {event.category === "Study"}
                                            {event.category === "Food"}
                                            {event.category === "Outdoors"}
                                            {event.category === "Networking"}
                                            {(event.category === "Other" || !event.category)}
                                            {event.category || "Other"}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to={`/event/${event.id}`}
                                    className="event-title-link"
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >
                                    <h3>
                                        {event.title}
                                    </h3>
                                </Link>

                                <p className="event-description">
                                    {
                                        event.description
                                    }
                                </p>

                                <div className="event-meta">
                                    {event.location && (
                                        <p>
                                            <span className="event-label">
                                                📍
                                                Location
                                            </span>

                                            <span>
                                                {
                                                    event.location
                                                }
                                            </span>
                                        </p>
                                    )}

                                    {event.startAt && (
                                        <p>
                                            <span className="event-label">
                                                🗓
                                                Date
                                            </span>

                                            <span>
                                                {new Date(
                                                    event.startAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </p>
                                    )}

                                    <p>
                                        <span className="event-label">
                                            👥
                                            Participants
                                        </span>

                                        <span>
                                            {
                                                event.participantsCount
                                            }{" "}
                                            /{" "}
                                            {
                                                event.neededPeople
                                            }
                                        </span>
                                    </p>
                                </div>

                                <div className="progress-wrap">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="event-card-footer">
                                    <span className="card-status">
                                        {event.isFull
                                            ? "No available spots"
                                            : `${event.remainingSpots ??
                                            event.neededPeople -
                                            event.participantsCount
                                            } spots left`}
                                    </span>

                                    {event.isJoined ? (
                                        <button
                                            className="danger-btn card-action-btn"
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();
                                                void handleLeave(
                                                    event.id
                                                );
                                            }}
                                        >
                                            Leave
                                            Event
                                        </button>
                                    ) : (
                                        <button
                                            className="primary-btn card-action-btn"
                                            disabled={
                                                event.isFull
                                            }
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();
                                                void handleJoin(
                                                    event.id
                                                );
                                            }}
                                        >
                                            {event.isFull
                                                ? "Full"
                                                : "Join Event"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HomePage;
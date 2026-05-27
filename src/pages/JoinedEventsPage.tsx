import { useEffect, useState } from "react";
import { getJoinedEvents, leaveEvent } from "./services/eventService";
import type { Event } from "../types/Event";
import toast from "react-hot-toast";

function JoinedEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState("");

    async function loadJoinedEvents() {
        try {
            const data = await getJoinedEvents();
            setEvents(data);
        } catch (err) {
            console.error("JOINED EVENTS ERROR:", err);
            setError("Failed to load joined events");
        }
    }

    useEffect(() => {
        const load = async () => {
            await loadJoinedEvents();
        };

        void load();
    }, []);

    async function handleLeave(id: number) {
        try {
            await leaveEvent(id);
            await loadJoinedEvents();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error leaving event");
        }
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <p className="section-kicker">Your activity</p>
                    <h2 className="section-title">Joined Events</h2>
                </div>
            </div>

            {error && <p>{error}</p>}

            {events.length === 0 ? (
                <div className="empty-state">
                    <p>You have not joined any events yet.</p>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map((event) => {
                        const progress = Math.min(
                            (event.participantsCount / event.neededPeople) * 100,
                            100
                        );

                        return (
                            <article key={event.id} className="event-card premium-card">
                                <div className="event-card-glow"></div>

                                <div className="event-card-top">
                                    <div className="badge badge-green">Joined</div>

                                    {event.city && (
                                        <span className="mini-tag">{event.city}</span>
                                    )}
                                </div>

                                <h3>{event.title}</h3>
                                <p className="event-description">{event.description}</p>

                                <div className="event-meta">
                                    {event.location && (
                                        <p>
                                            <span className="event-label">📍 Location</span>
                                            <span>{event.location}</span>
                                        </p>
                                    )}

                                    <p>
                                        <span className="event-label">👥 Participants</span>
                                        <span>
                                            {event.participantsCount} / {event.neededPeople}
                                        </span>
                                    </p>
                                </div>

                                <div className="progress-wrap">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="event-card-footer">
                                    <span className="card-status">You are participating</span>

                                    <button
                                        className="danger-btn card-action-btn"
                                        onClick={() => handleLeave(event.id)}
                                    >
                                        Leave Event
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default JoinedEventsPage;
import { useEffect, useState } from "react";
import { getMyEvents, deleteEvent } from "./services/eventService";
import type { Event } from "../types/Event";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function MyEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState("");
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    useEffect(() => {
        void loadMyEvents();
    }, []);

    async function loadMyEvents() {
        try {
            const data = await getMyEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load your events");
        }
    }

    async function confirmDelete() {
        if (!eventToDelete) return;

        try {
            await deleteEvent(eventToDelete.id);
            toast.success("Event deleted successfully");
            setEventToDelete(null);
            await loadMyEvents();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete event");
        }
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <p className="section-kicker">Manage your activity</p>
                    <h2 className="section-title">My Created Events</h2>
                </div>
            </div>

            {error && <p>{error}</p>}

            {events.length === 0 ? (
                <div className="empty-state">
                    <p>You have not created any events yet.</p>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map((event) => (
                        <article key={event.id} className="event-card premium-card">
                            <div className="event-card-top">
                                <div className="badge badge-blue">Owner</div>

                                {event.city && (
                                    <span className="mini-tag">{event.city}</span>
                                )}
                            </div>

                            <h3>{event.title}</h3>
                            <p className="event-description">{event.description}</p>

                            <div className="event-meta">
                                <p>
                                    <span className="event-label">📍 Location</span>
                                    <span>{event.location}</span>
                                </p>

                                <p>
                                    <span className="event-label">👥 Participants</span>
                                    <span>
                                        {event.participantsCount} / {event.neededPeople}
                                    </span>
                                </p>
                            </div>

                            <div className="event-card-footer">
                                <span className="card-status">You created this event</span>

                                <Link
                                    to={`/edit-event/${event.id}`}
                                    className="secondary-btn card-action-btn"
                                >
                                    Edit
                                </Link>

                                <button
                                    className="danger-btn card-action-btn"
                                    onClick={() => setEventToDelete(event)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {eventToDelete && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>Delete event?</h3>
                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{eventToDelete.title}</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                className="secondary-btn"
                                onClick={() => setEventToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="danger-btn"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyEventsPage;
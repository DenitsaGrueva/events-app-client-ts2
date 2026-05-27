import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getEventById,
    joinEvent,
    leaveEvent,
    getEventParticipants,
} from "./services/eventService";
import type { Event } from "../types/Event";
import toast from "react-hot-toast";

type Participant = {
    id: string;
    email: string;
};

function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void loadAll();
    }, [id]);

    async function loadAll() {
        try {
            setLoading(true);

            const eventData = await getEventById(Number(id));
            const users = await getEventParticipants(Number(id));

            setEvent(eventData);
            setParticipants(users);
        } catch {
            toast.error("Failed to load event");
        } finally {
            setLoading(false);
        }
    }

    async function handleJoin() {
        if (!event) return;

        try {
            await joinEvent(event.id);
            toast.success("Joined successfully");
            await loadAll();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Join failed");
        }
    }

    async function handleLeave() {
        if (!event) return;

        try {
            await leaveEvent(event.id);
            toast.success("Left event successfully");
            await loadAll();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Leave failed");
        }
    }

    if (loading) {
        return <div className="loading-card">Loading event details...</div>;
    }

    if (!event) {
        return (
            <div className="empty-state empty-state-premium">
                <h3>Event not found</h3>
                <p>This event may have been removed or is no longer available.</p>
                <button className="secondary-btn" onClick={() => navigate("/")}>
                    Back to events
                </button>
            </div>
        );
    }

    const spotsLeft =
        event.remainingSpots ?? event.neededPeople - event.participantsCount;

    const progress = Math.min(
        (event.participantsCount / event.neededPeople) * 100,
        100
    );

    return (
        <div className="details-page details-page-v2">
            <button className="secondary-btn details-back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <section className="details-hero-v2">
                <div className="details-hero-content">
                    <div className="details-badges">
                        {event.isOrganizer ? (
                            <span className="badge badge-blue">Organizer</span>
                        ) : event.isFull ? (
                            <span className="badge badge-red">Full</span>
                        ) : event.isJoined ? (
                            <span className="badge badge-green">Joined</span>
                        ) : (
                            <span className="badge badge-blue">Open Event</span>
                        )}

                        {event.city && <span className="mini-tag">{event.city}</span>}
                    </div>

                    <h1>{event.title}</h1>

                    <p>{event.description}</p>
                </div>

                <aside className="details-cta-card">
                    <span className="details-cta-label">Available spots</span>
                    <strong>{spotsLeft}</strong>
                    <p>
                        {event.participantsCount} of {event.neededPeople} people joined
                    </p>

                    <div className="progress-wrap">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {event.isOrganizer ? (
                        <Link
                            to={`/edit-event/${event.id}`}
                            className="secondary-btn details-main-action"
                        >
                            Edit Event
                        </Link>
                    ) : event.isJoined ? (
                        <button
                            className="danger-btn details-main-action"
                            onClick={handleLeave}
                        >
                            Leave Event
                        </button>
                    ) : (
                        <button
                            className="primary-btn details-main-action"
                            disabled={event.isFull}
                            onClick={handleJoin}
                        >
                            {event.isFull ? "Event Full" : "Join Event"}
                        </button>
                    )}
                </aside>
            </section>

            <section className="details-grid details-grid-v2">
                <div className="details-info-box">
                    <span>Date & Time</span>
                    <strong>
                        {event.startAt
                            ? new Date(event.startAt).toLocaleString()
                            : "Not specified"}
                    </strong>
                </div>

                <div className="details-info-box">
                    <span>City</span>
                    <strong>{event.city || "Not specified"}</strong>
                </div>

                <div className="details-info-box">
                    <span>Category</span>
                    <strong>{event.category || "Other"}</strong>
                </div>

                <div className="details-info-box">
                    <span>Location</span>
                    <strong>{event.location || "Not specified"}</strong>
                </div>

                <div className="details-info-box">
                    <span>Participants</span>
                    <strong>
                        {event.participantsCount} / {event.neededPeople}
                    </strong>
                </div>

                <div className="details-info-box">
                    <span>Status</span>
                    <strong>
                        {event.isFull
                            ? "Full"
                            : event.isJoined
                                ? "You joined"
                                : "Open"}
                    </strong>
                </div>
            </section>

            <section className="participants-panel participants-panel-v2">
                <div className="participants-header">
                    <div>
                        <h3>Participants</h3>
                        <p>People who joined this event.</p>
                    </div>

                    <span className="results-pill">{participants.length}</span>
                </div>

                {participants.length === 0 ? (
                    <div className="participants-empty">
                        <p>No participants yet.</p>
                    </div>
                ) : (
                    <div className="participants-list">
                        {participants.map((p) => (
                            <div className="participant-item" key={p.id}>
                                <div className="participant-avatar">
                                    {p.email?.charAt(0).toUpperCase() || "U"}
                                </div>

                                <div>
                                    <strong>{p.email}</strong>
                                    <p>Participant</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default EventDetailsPage;
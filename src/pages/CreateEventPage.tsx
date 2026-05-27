import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createEvent } from "./services/eventService";

const categories = [
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

function CreateEventPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("Other");
    const [location, setLocation] = useState("");
    const [neededPeople, setNeededPeople] = useState(1);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleCreateEvent(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        if (title.trim().length < 3) {
            setMessage("Title must be at least 3 characters.");
            toast.error("Title must be at least 3 characters");
            return;
        }

        if (!startAt) {
            setMessage("Please choose a start date and time.");
            toast.error("Please choose a start date and time");
            return;
        }

        if (neededPeople < 1) {
            setMessage("Needed people must be at least 1.");
            toast.error("Needed people must be at least 1");
            return;
        }

        try {
            await createEvent({
                title,
                description,
                startAt,
                city,
                category,
                location,
                neededPeople,
            });

            toast.success("Event created successfully");
            navigate("/");
        } catch (error) {
            console.error("CREATE EVENT ERROR:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create event"
            );

            toast.error("Failed to create event");
        }
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <h1>Create Event</h1>
                <p className="form-subtitle">
                    Fill in the details below and publish your new event.
                </p>

                <form onSubmit={handleCreateEvent}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Describe your event"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Start date and time</label>
                        <input
                            type="datetime-local"
                            value={startAt}
                            onChange={(e) => setStartAt(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((categoryOption) => (
                                <option key={categoryOption} value={categoryOption}>
                                    {categoryOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="Exact location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Needed people</label>
                        <input
                            type="number"
                            min="1"
                            value={neededPeople}
                            onChange={(e) => setNeededPeople(Number(e.target.value))}
                        />
                    </div>

                    {message && (
                        <div className="form-message error">
                            {message}
                        </div>
                    )}

                    <button className="primary-btn" type="submit">
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEventPage;
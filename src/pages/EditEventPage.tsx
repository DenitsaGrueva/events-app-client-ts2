import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "./services/eventService";
import toast from "react-hot-toast";

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

function formatForDateTimeLocal(value: string) {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
}

function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("Other");
    const [location, setLocation] = useState("");
    const [neededPeople, setNeededPeople] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        void loadEvent();
    }, []);

    async function loadEvent() {
        try {
            if (!id) return;

            const event = await getEventById(Number(id));

            setTitle(event.title);
            setDescription(event.description);
            setStartAt(formatForDateTimeLocal(event.startAt));
            setCity(event.city);
            setCategory(event.category || "Other");
            setLocation(event.location);
            setNeededPeople(event.neededPeople);
        } catch (error) {
            console.error("LOAD EVENT ERROR:", error);
            setError("Failed to load event");
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        try {
            if (!id) return;

            await updateEvent(Number(id), {
                title,
                description,
                startAt,
                city,
                category,
                location,
                neededPeople,
            });

            toast.success("Event updated successfully");
            navigate("/my-events");
        } catch (error) {
            console.error("UPDATE EVENT ERROR:", error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to update event");
            }
        }
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <h1>Edit Event</h1>

                <p className="form-subtitle">
                    Update the details of your event.
                </p>

                {error && <p>{error}</p>}

                <form onSubmit={handleUpdate}>
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

                    <button className="primary-btn" type="submit">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditEventPage;
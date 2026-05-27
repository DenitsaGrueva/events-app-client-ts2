const API_URL = "https://joinup-e5ahg0h8hvhzgke5.swedencentral-01.azurewebsites.net/api/events";

function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getAuthHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getEvents() {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch events");
    }

    return await response.json();
}

export async function createEvent(eventData: {
    title: string;
    description: string;
    startAt: string;
    city: string;
    category: string;
    location: string;
    neededPeople: number;
})  {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
    });


    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create event");
    }

    return await response.json();
}

export async function joinEvent(eventId: number) {
    const response = await fetch(`${API_URL}/${eventId}/join`, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to join event");
    }

    return await response.json();
}

export async function leaveEvent(eventId: number) {
    const response = await fetch(`${API_URL}/${eventId}/leave`, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to leave event");
    }

    return await response.json();
}

export async function deleteEvent(eventId: number) {
    const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete event");
    }
}

export async function getEventById(eventId: number) {
    const response = await fetch(`${API_URL}/${eventId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load event");
    }

    return await response.json();
}

export async function updateEvent(
    eventId: number,
    eventData: {
        title: string;
        description: string;
        startAt: string;
        city: string;
        category: string;
        location: string;
        neededPeople: number;
    }
) {
    const response = await fetch(`${API_URL}/${eventId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            Title: eventData.title,
            Description: eventData.description,
            StartAt: new Date(eventData.startAt).toISOString(),
            City: eventData.city,
            Category: eventData.category,
            Location: eventData.location,
            NeededPeople: eventData.neededPeople,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update event");
    }

    return await response.json();
}

export async function getMyEvents() {
    const response = await fetch(`${API_URL}/my`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load your events");
    }

    return await response.json();
}

export async function getJoinedEvents() {
    const response = await fetch(`${API_URL}/joined`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load joined events");
    }

    return await response.json();
}

export async function getEventParticipants(eventId: number) {
    const response = await fetch(`${API_URL}/${eventId}/participants`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load participants");
    }

    return await response.json();
}
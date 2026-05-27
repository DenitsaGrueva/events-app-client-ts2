const API_URL = "https://joinup-e5ahg0h8hvhzgke5.swedencentral-01.azurewebsites.net/api/admin";

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

export async function getAdminEvents() {
    const response = await fetch(`${API_URL}/events`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load admin events");
    }

    return await response.json();
}

export async function getAdminUsers() {
    const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load users");
    }

    return await response.json();
}

export async function deleteEventAsAdmin(eventId: number) {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete event");
    }

    return await response.json();
}

export async function restoreEventAsAdmin(eventId: number) {
    const response = await fetch(`${API_URL}/events/${eventId}/restore`, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to restore event");
    }

    return await response.json();
}
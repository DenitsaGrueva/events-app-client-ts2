const API_URL = "https://joinup-e5ahg0h8hvhzgke5.swedencentral-01.azurewebsites.net/api/auth";


export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Email: email,
            Password: password,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
    }

    return await response.json();
}

export async function register(email: string, password: string) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Register failed");
    }

    return await response.json();
}
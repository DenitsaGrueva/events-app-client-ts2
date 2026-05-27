import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    role?: string | string[];
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
};

export function isAdmin(): boolean {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload & { roles?: string | string[] }>(token);

        const role =
            decoded.role ||
            decoded.roles ||
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (Array.isArray(role)) {
            return role.includes("Admin");
        }

        return role === "Admin";
    } catch {
        return false;
    }
}
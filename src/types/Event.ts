export interface Event {
    id: number;
    title: string;
    description: string;
    startAt?: string;
    city?: string;
    category?: string;
    location?: string;
    neededPeople: number;
    participantsCount: number;
    remainingSpots?: number;
    isFull: boolean;
    isJoined: boolean;
    isOrganizer?: boolean;
}
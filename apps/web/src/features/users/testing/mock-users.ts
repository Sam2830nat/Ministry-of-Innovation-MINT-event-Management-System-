import { UserRecord } from "../types";

export const mockUsers: UserRecord[] = [
    { id: '1', name: 'Abebe Bikila', email: 'abebe.b@mint.gov.et', role: 'ADMIN', status: 'active', joined: '2025-09-01' },
    { id: '2', name: 'Martha Tadesse', email: 'martha.t@mint.gov.et', role: 'ORGANIZER', status: 'active', joined: '2025-09-15' },
    { id: '3', name: 'Kebede Molla', email: 'kebede.m@mint.gov.et', role: 'GUEST', status: 'pending', joined: '2026-01-10' },
    { id: '4', name: 'Sara Lemma', email: 'sara.l@mint.gov.et', role: 'STAFF', status: 'inactive', joined: '2025-10-20' },
    { id: '5', name: 'Yonas Berhane', email: 'yonas.b@mint.gov.et', role: 'ORGANIZER', status: 'active', joined: '2025-11-05' },
];

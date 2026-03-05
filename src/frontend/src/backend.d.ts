import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Room {
    id: bigint;
    name: string;
    invoiceId: bigint;
    subtotal: number;
}
export interface Item {
    id: bigint;
    rate: number;
    unit: string;
    description: string;
    quantity: number;
    roomId: bigint;
    amount: number;
}
export interface Invoice {
    id: bigint;
    clientId: bigint;
    createdAt: bigint;
    grandTotal: number;
    billingNumber: string;
}
export interface Client {
    id: bigint;
    name: string;
    createdAt: bigint;
    address: string;
    mobile: string;
    billingNumber: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClient(name: string, mobile: string, address: string): Promise<bigint>;
    createInvoice(clientId: bigint): Promise<bigint>;
    createItem(roomId: bigint, description: string, quantity: number, unit: string, rate: number): Promise<bigint>;
    createRoom(invoiceId: bigint, name: string): Promise<bigint>;
    deleteClient(id: bigint): Promise<void>;
    deleteInvoice(id: bigint): Promise<void>;
    deleteItem(id: bigint): Promise<void>;
    deleteRoom(id: bigint): Promise<void>;
    getAllClients(): Promise<Array<Client>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(id: bigint): Promise<Client>;
    getDashboardStats(): Promise<{
        totalBillingAmount: number;
        totalClients: bigint;
        totalInvoices: bigint;
    }>;
    getInvoice(id: bigint): Promise<Invoice>;
    getInvoicesByClientId(clientId: bigint): Promise<Array<Invoice>>;
    getItem(id: bigint): Promise<Item>;
    getItemsByRoomId(roomId: bigint): Promise<Array<Item>>;
    getRoom(id: bigint): Promise<Room>;
    getRoomsByInvoiceId(invoiceId: bigint): Promise<Array<Room>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(id: bigint, name: string, mobile: string, address: string): Promise<void>;
    updateInvoice(id: bigint, clientId: bigint): Promise<void>;
    updateItem(id: bigint, description: string, quantity: number, unit: string, rate: number): Promise<void>;
    updateRoom(id: bigint, name: string): Promise<void>;
}

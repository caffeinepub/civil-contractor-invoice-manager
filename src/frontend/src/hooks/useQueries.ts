import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Client, Invoice, Item, Room } from "../backend.d";
import { useActor } from "./useActor";

// ── Clients ─────────────────────────────────────────────────────────────────

export function useGetAllClients() {
  const { actor, isFetching } = useActor();
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClient(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Client | null>({
    queryKey: ["client", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getClient(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      mobile,
      address,
    }: { name: string; mobile: string; address: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createClient(name, mobile, address);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      mobile,
      address,
    }: { id: bigint; name: string; mobile: string; address: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateClient(id, name, mobile, address);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", vars.id.toString()] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteClient(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ── Invoices ─────────────────────────────────────────────────────────────────

export function useGetAllInvoices() {
  const { actor, isFetching } = useActor();
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInvoice(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Invoice | null>({
    queryKey: ["invoice", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getInvoice(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (clientId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createInvoice(clientId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteInvoice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteInvoice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ── Rooms ─────────────────────────────────────────────────────────────────

export function useGetRoomsByInvoiceId(invoiceId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Room[]>({
    queryKey: ["rooms", invoiceId?.toString()],
    queryFn: async () => {
      if (!actor || invoiceId === null) return [];
      return actor.getRoomsByInvoiceId(invoiceId);
    },
    enabled: !!actor && !isFetching && invoiceId !== null,
  });
}

export function useCreateRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      invoiceId,
      name,
    }: { invoiceId: bigint; name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createRoom(invoiceId, name);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["rooms", vars.invoiceId.toString()] });
    },
  });
}

export function useDeleteRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: bigint; invoiceId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteRoom(id);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["rooms", vars.invoiceId.toString()] });
    },
  });
}

// ── Items ─────────────────────────────────────────────────────────────────

export function useGetItemsByRoomId(roomId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Item[]>({
    queryKey: ["items", roomId?.toString()],
    queryFn: async () => {
      if (!actor || roomId === null) return [];
      return actor.getItemsByRoomId(roomId);
    },
    enabled: !!actor && !isFetching && roomId !== null,
  });
}

export function useCreateItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      description,
      quantity,
      unit,
      rate,
    }: {
      roomId: bigint;
      description: string;
      quantity: number;
      unit: string;
      rate: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createItem(roomId, description, quantity, unit, rate);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["items", vars.roomId.toString()] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      description,
      quantity,
      unit,
      rate,
    }: {
      id: bigint;
      roomId: bigint;
      description: string;
      quantity: number;
      unit: string;
      rate: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateItem(id, description, quantity, unit, rate);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["items", vars.roomId.toString()] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useDeleteItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: bigint; roomId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteItem(id);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["items", vars.roomId.toString()] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalBillingAmount: number;
    totalClients: bigint;
    totalInvoices: bigint;
  } | null>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

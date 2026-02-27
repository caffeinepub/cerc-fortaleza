import type {
  FoundObject,
  Lead,
  LeadStats,
  ObjectType,
  PersonalObject,
  PublicStats,
} from "@/backend.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      whatsapp,
    }: { name: string; whatsapp: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitLead(name, whatsapp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGetAllLeads() {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();

  return useQuery<LeadStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// --- CERC APP QUERIES ---

export function useMyObjects() {
  const { actor, isFetching } = useActor();

  return useQuery<PersonalObject[]>({
    queryKey: ["myObjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyObjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useRegisterObject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brand,
      model,
      identifier,
      objType,
    }: {
      brand: string;
      model: string;
      identifier: string;
      objType: ObjectType;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerObject(brand, model, identifier, objType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myObjects"] });
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function useReportTheft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      objectId,
      boNumber,
      latitude,
      longitude,
      date,
      location,
      stolenPlace,
      latitudeStart,
      longitudeStart,
    }: {
      objectId: bigint;
      boNumber: string;
      latitude: bigint;
      longitude: bigint;
      date: bigint;
      location: string;
      stolenPlace?: string;
      latitudeStart?: bigint;
      longitudeStart?: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.reportTheft(
        objectId,
        boNumber,
        latitude,
        longitude,
        date,
        location,
        stolenPlace ?? null,
        latitudeStart ?? null,
        longitudeStart ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myObjects"] });
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function usePublicSearch() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (identifier: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.publicObjectSearch(identifier);
    },
  });
}

export function useFoundObjects() {
  const { actor, isFetching } = useActor();

  return useQuery<FoundObject[]>({
    queryKey: ["foundObjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableFoundObjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useAddFoundObject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      description,
      location,
    }: { description: string; location: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addFoundObject(description, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foundObjects"] });
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function useClaimFoundObject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foundObjectId: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.claimFoundObject(foundObjectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foundObjects"] });
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function usePublicStats() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicStats>({
    queryKey: ["publicStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getPublicStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

// --- SUBSCRIPTION & STRIPE QUERIES ---

import type {
  ShoppingItem,
  StripeSessionStatus,
  SubscriptionInfo,
  SubscriptionPlan,
} from "@/backend.d";

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

export function useMySubscription() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionInfo>({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getMySubscription();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useCanRegisterMoreObjects() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["canRegisterMoreObjects"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canRegisterMoreObjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");

      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );

      console.log("[Stripe] Raw response:", result.substring(0, 300));

      let url: string | undefined;
      let id: string | undefined;

      // Try JSON parse first
      try {
        const parsed = JSON.parse(result) as Record<string, unknown>;
        url = typeof parsed?.url === "string" ? parsed.url : undefined;
        id = typeof parsed?.id === "string" ? parsed.id : undefined;
      } catch {
        console.warn("[Stripe] JSON parse failed, falling back to regex");
      }

      // Regex fallback: extract url and id from raw JSON string
      if (!url) {
        const urlMatch = result.match(/"url"\s*:\s*"(https?:[^"]+)"/);
        if (urlMatch) url = urlMatch[1].replace(/\\/g, "");
      }
      if (!id) {
        const idMatch = result.match(/"id"\s*:\s*"(cs_[^"]+)"/);
        if (idMatch) id = idMatch[1];
      }

      if (!url) {
        console.error(
          "[Stripe] Could not extract url. Response:",
          result.substring(0, 500),
        );
        throw new Error(
          "Não foi possível obter a URL de pagamento do Stripe. Verifique as configurações.",
        );
      }

      return { id: id ?? "", url };
    },
  });
}

export function useGetStripeSessionStatus() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<StripeSessionStatus> => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStripeSessionStatus(sessionId);
    },
  });
}

export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      plan,
      stripeCustomerId,
      expirationDate,
    }: {
      plan: SubscriptionPlan;
      stripeCustomerId: string;
      expirationDate: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.upgradeToPremium(plan, stripeCustomerId, expirationDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["canRegisterMoreObjects"] });
    },
  });
}

export function useActivateMyPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      plan,
    }: { sessionId: string; plan: SubscriptionPlan }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.activateMyPremium(sessionId, plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["canRegisterMoreObjects"] });
    },
  });
}

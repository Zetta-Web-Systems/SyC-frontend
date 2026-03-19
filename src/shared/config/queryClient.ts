import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { getApiErrorMessage } from "@shared/api/apiError";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      showGlobalError?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showGlobalError === false) return;

      toast.error(getApiErrorMessage(error));
    },
  }),
});

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@shared/config/queryClient";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

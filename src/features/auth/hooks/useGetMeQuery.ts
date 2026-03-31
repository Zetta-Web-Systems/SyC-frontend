import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth.api";

export function useGetMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });
}

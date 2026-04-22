import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { MEMBERS_KEYS } from "@features/members";

interface CreateMutationOptions<TVars, TData> {
  mutationFn: MutationFunction<TData, TVars>;
  successMessage: string;
  getMemberId: (vars: TVars) => string;
}

export function createClinicalProfileMutation<
  TVars extends { memberId: string },
  TData,
>({
  mutationFn,
  successMessage,
  getMemberId,
}: CreateMutationOptions<TVars, TData>) {
  return function useGeneratedMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn,
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: MEMBERS_KEYS.detail(getMemberId(vars)),
        });
        toast.success(successMessage);
      },
    });
  };
}

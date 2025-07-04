import { useMutation } from "@tanstack/react-query";
import { useApi } from "./use-api";
import { useAccountMe } from "./use-account";

export const useSlidesMinigame = () => {
    const { post } = useApi();
    const { accountQuery } = useAccountMe();

    const finishGameMutation = useMutation<any, Error, { energyConsumed: number; collectedTime: number }>({
        mutationFn: (variables: { energyConsumed: number; collectedTime: number }) => post('/minigames/slide/finish_game', variables),
        onSuccess: () => {
            accountQuery.refetch();
        },
    });

    return {
        finishGameMutation,
    };
}
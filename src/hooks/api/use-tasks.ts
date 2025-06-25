import { useApi } from "./use-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export enum TaskNames {
    DailyComboLeaveCommentInTwitter = 'daily-combo-twitter-comment',
    DailyComboBuyTicket = 'daily-combo-buy-ticket',
    SubscribeTwitter = 'task-subscribe-twitter',
    Invite2Friends = 'task-invite-2-friends',
}

// --- Интерфейсы для данных (могут потребовать уточнения) ---

export interface ITask {
    telegramId: number,
    name: string,
    isCompleted: boolean,
    reward: {
        type: "time" | "energy",
        value: number,
    },
    description: string,
    createdAt: number,
    updatedAt: number,
}

export interface IDailyCombo {
    resetAt: number;
    tasks: ITask[];
}

// --- Хук useTasks ---

export function useTasks() {
    const { get, post } = useApi();
    const queryClient = useQueryClient();

    /**
     * Запрос для получения списка всех задач.
     */
    const tasksQuery = useQuery<ITask[], Error>({
        queryKey: ['tasks'],
        queryFn: async () => await get('/tasks/get_tasks') as ITask[],
        staleTime: 5 * 60 * 1000, // Кэш на 5 минут
    });

    /**
     * Запрос для получения данных о ежедневном комбо.
     */
    const dailyComboQuery = useQuery<IDailyCombo, Error>({
        queryKey: ['dailyCombo'],
        queryFn: async () => await get('/tasks/get_daily_combo') as IDailyCombo,
        staleTime: 5 * 60 * 1000, // Кэш на 5 минут
    });

    /**
     * Мутация для завершения задачи.
     */
    const completeTaskMutation = useMutation<any, Error, { taskName: TaskNames }>({
        mutationFn: (variables) => post('/tasks/complete_task', variables),
        onSuccess: () => {
            // При успешном завершении задачи, мы делаем невалидными (и заново запрашиваем)
            // данные по задачам и дневному комбо, чтобы UI обновился.
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['dailyCombo'] });
        },
    });

    return {
        // Данные и состояние для списка задач
        tasksQuery,

        // Данные и состояние для ежедневного комбо
        dailyComboQuery,

        // Функция и состояние для завершения задачи
        completeTask: completeTaskMutation.mutate,
        isCompletingTask: completeTaskMutation.isPending,
        completeTaskError: completeTaskMutation.error,
    };
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './use-api'

export enum TasksDailyComboNames {
  WatchAd = 'daily-combo-watch-ad',
  PostTelegramStory = 'daily-combo-post-telegram-story',
  ViewTwitterNews = 'daily-combo-view-twitter-news',
  DailyComboCompleteAllTasks = 'daily-combo-complete-all-tasks',
}

export enum TaskNames {
  // Social Media Subscriptions
  SubscribeTwitter = 'task-subscribe-twitter',
  SubscribeTelegram = 'task-subscribe-telegram',
  SubscribeInstagram = 'task-subscribe-instagram',
  SubscribeYoutube = 'task-subscribe-youtube',

  // Visiting Websites
  VisitWebsite = 'task-visit-website',
  WatchAd = 'task-watch-ad',

  // Shopping Actions
  MintNFT = 'task-mint-nft',

  // Invitations
  Invite1Friends = 'task-invite-1-friends',
  Invite3Friends = 'task-invite-3-friends',
  Invite5Friends = 'task-invite-5-friends',
  Invite10Friends = 'task-invite-10-friends',

  // Lvl progress tasks
  ReachLevel11 = 'task-reach-lvl-11',
  ReachLevel10 = 'task-reach-lvl-10',
  ReachLevel9 = 'task-reach-lvl-9',
  ReachLevel7 = 'task-reach-lvl-7',

  // Post telegram story
  PostTelegramStory = 'task-post-telegram-story',
}

// --- Интерфейсы для данных (могут потребовать уточнения) ---

export interface ITask {
  telegramId: number
  name: string
  description: string
  reward: {
    type: 'time' | 'energy'
    value: number
  }
  status: 'pending' | 'completed' | 'in-progress'
}

export interface IDailyCombo {
  resetAt: number
  tasks: Array<ITask>
}

// --- Хук useTasks ---

export function useTasks() {
  const { get, post } = useApi()
  const queryClient = useQueryClient()

  /**
   * Запрос для получения списка всех задач.
   */
  const allTasksQuery = useQuery<Array<ITask>, Error>({
    queryKey: ['allTasks'],
    queryFn: async () => await get('/tasks/get_all_tasks'),
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
  })

  /**
   * Запрос для получения списка всех задач.
   */
  const tasksQuery = useQuery<Array<ITask>, Error>({
    queryKey: ['tasks'],
    queryFn: async () => await get('/tasks/get_tasks'),
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
  })

  /**
   * Запрос для получения данных о ежедневном комбо.
   */
  const dailyComboQuery = useQuery<IDailyCombo, Error>({
    queryKey: ['dailyCombo'],
    queryFn: async () => await get('/tasks/get_daily_combo'),
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
  })

  /**
   * Мутация для завершения задачи.
   */
  const completeTaskMutation = useMutation<
    any,
    Error,
    { taskName: TaskNames | TasksDailyComboNames }
  >({
    mutationFn: (variables) => post('/tasks/complete_task', variables),
    onSuccess: () => {
      // При успешном завершении задачи, мы делаем невалидными (и заново запрашиваем)
      // данные по задачам и дневному комбо, чтобы UI обновился.
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dailyCombo'] })
      queryClient.invalidateQueries({ queryKey: ['allTasks'] })
    },
  })

  return {
    // Данные и состояние для списка задач
    tasksQuery,

    // Данные и состояние для ежедневного комбо
    dailyComboQuery,

    allTasksQuery,

    // Функция и состояние для завершения задачи
    completeTask: completeTaskMutation.mutate,
    isCompletingTask: completeTaskMutation.isPending,
    completeTaskError: completeTaskMutation.error,
  }
}

import { StarBoardIcon } from '@/assets/icons/menu-icons/star-board-icon'
import { HomeIcon } from '@/assets/icons/menu-icons/home-icon'
import { FriendsIcon } from '@/assets/icons/menu-icons/friends-icon'
import { TasksIcon } from '@/assets/icons/menu-icons/tasks-icon'

export const navItems = [
  { to: '/star-board', label: 'Star Board', icon: StarBoardIcon },
  { to: '/tasks', label: 'Tasks', icon: TasksIcon },
  { to: '/home', label: 'Home', icon: HomeIcon },
  { to: '/friends', label: 'Frens', icon: FriendsIcon },
  { to: '/locked', label: 'Blured', icon: FriendsIcon, isLocked: true },
]

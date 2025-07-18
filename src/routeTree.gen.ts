/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UnlockGateImport } from './routes/unlock-gate'
import { Route as TasksImport } from './routes/tasks'
import { Route as StarBoardImport } from './routes/star-board'
import { Route as ShopImport } from './routes/shop'
import { Route as SendGiftImport } from './routes/send-gift'
import { Route as HomeImport } from './routes/home'
import { Route as GateImport } from './routes/gate'
import { Route as FrensImport } from './routes/frens'
import { Route as CheckInImport } from './routes/check-in'
import { Route as AuthErrorImport } from './routes/auth-error'
import { Route as IndexImport } from './routes/index'
import { Route as MinigamesSlideImport } from './routes/minigames/slide'
import { Route as MinigamesBattleResultImport } from './routes/minigames/battle-result'
import { Route as MinigamesBattleImport } from './routes/minigames/battle'

// Create/Update Routes

const UnlockGateRoute = UnlockGateImport.update({
  id: '/unlock-gate',
  path: '/unlock-gate',
  getParentRoute: () => rootRoute,
} as any)

const TasksRoute = TasksImport.update({
  id: '/tasks',
  path: '/tasks',
  getParentRoute: () => rootRoute,
} as any)

const StarBoardRoute = StarBoardImport.update({
  id: '/star-board',
  path: '/star-board',
  getParentRoute: () => rootRoute,
} as any)

const ShopRoute = ShopImport.update({
  id: '/shop',
  path: '/shop',
  getParentRoute: () => rootRoute,
} as any)

const SendGiftRoute = SendGiftImport.update({
  id: '/send-gift',
  path: '/send-gift',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => rootRoute,
} as any)

const GateRoute = GateImport.update({
  id: '/gate',
  path: '/gate',
  getParentRoute: () => rootRoute,
} as any)

const FrensRoute = FrensImport.update({
  id: '/frens',
  path: '/frens',
  getParentRoute: () => rootRoute,
} as any)

const CheckInRoute = CheckInImport.update({
  id: '/check-in',
  path: '/check-in',
  getParentRoute: () => rootRoute,
} as any)

const AuthErrorRoute = AuthErrorImport.update({
  id: '/auth-error',
  path: '/auth-error',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const MinigamesSlideRoute = MinigamesSlideImport.update({
  id: '/minigames/slide',
  path: '/minigames/slide',
  getParentRoute: () => rootRoute,
} as any)

const MinigamesBattleResultRoute = MinigamesBattleResultImport.update({
  id: '/minigames/battle-result',
  path: '/minigames/battle-result',
  getParentRoute: () => rootRoute,
} as any)

const MinigamesBattleRoute = MinigamesBattleImport.update({
  id: '/minigames/battle',
  path: '/minigames/battle',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth-error': {
      id: '/auth-error'
      path: '/auth-error'
      fullPath: '/auth-error'
      preLoaderRoute: typeof AuthErrorImport
      parentRoute: typeof rootRoute
    }
    '/check-in': {
      id: '/check-in'
      path: '/check-in'
      fullPath: '/check-in'
      preLoaderRoute: typeof CheckInImport
      parentRoute: typeof rootRoute
    }
    '/frens': {
      id: '/frens'
      path: '/frens'
      fullPath: '/frens'
      preLoaderRoute: typeof FrensImport
      parentRoute: typeof rootRoute
    }
    '/gate': {
      id: '/gate'
      path: '/gate'
      fullPath: '/gate'
      preLoaderRoute: typeof GateImport
      parentRoute: typeof rootRoute
    }
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/send-gift': {
      id: '/send-gift'
      path: '/send-gift'
      fullPath: '/send-gift'
      preLoaderRoute: typeof SendGiftImport
      parentRoute: typeof rootRoute
    }
    '/shop': {
      id: '/shop'
      path: '/shop'
      fullPath: '/shop'
      preLoaderRoute: typeof ShopImport
      parentRoute: typeof rootRoute
    }
    '/star-board': {
      id: '/star-board'
      path: '/star-board'
      fullPath: '/star-board'
      preLoaderRoute: typeof StarBoardImport
      parentRoute: typeof rootRoute
    }
    '/tasks': {
      id: '/tasks'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof TasksImport
      parentRoute: typeof rootRoute
    }
    '/unlock-gate': {
      id: '/unlock-gate'
      path: '/unlock-gate'
      fullPath: '/unlock-gate'
      preLoaderRoute: typeof UnlockGateImport
      parentRoute: typeof rootRoute
    }
    '/minigames/battle': {
      id: '/minigames/battle'
      path: '/minigames/battle'
      fullPath: '/minigames/battle'
      preLoaderRoute: typeof MinigamesBattleImport
      parentRoute: typeof rootRoute
    }
    '/minigames/battle-result': {
      id: '/minigames/battle-result'
      path: '/minigames/battle-result'
      fullPath: '/minigames/battle-result'
      preLoaderRoute: typeof MinigamesBattleResultImport
      parentRoute: typeof rootRoute
    }
    '/minigames/slide': {
      id: '/minigames/slide'
      path: '/minigames/slide'
      fullPath: '/minigames/slide'
      preLoaderRoute: typeof MinigamesSlideImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth-error': typeof AuthErrorRoute
  '/check-in': typeof CheckInRoute
  '/frens': typeof FrensRoute
  '/gate': typeof GateRoute
  '/home': typeof HomeRoute
  '/send-gift': typeof SendGiftRoute
  '/shop': typeof ShopRoute
  '/star-board': typeof StarBoardRoute
  '/tasks': typeof TasksRoute
  '/unlock-gate': typeof UnlockGateRoute
  '/minigames/battle': typeof MinigamesBattleRoute
  '/minigames/battle-result': typeof MinigamesBattleResultRoute
  '/minigames/slide': typeof MinigamesSlideRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth-error': typeof AuthErrorRoute
  '/check-in': typeof CheckInRoute
  '/frens': typeof FrensRoute
  '/gate': typeof GateRoute
  '/home': typeof HomeRoute
  '/send-gift': typeof SendGiftRoute
  '/shop': typeof ShopRoute
  '/star-board': typeof StarBoardRoute
  '/tasks': typeof TasksRoute
  '/unlock-gate': typeof UnlockGateRoute
  '/minigames/battle': typeof MinigamesBattleRoute
  '/minigames/battle-result': typeof MinigamesBattleResultRoute
  '/minigames/slide': typeof MinigamesSlideRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/auth-error': typeof AuthErrorRoute
  '/check-in': typeof CheckInRoute
  '/frens': typeof FrensRoute
  '/gate': typeof GateRoute
  '/home': typeof HomeRoute
  '/send-gift': typeof SendGiftRoute
  '/shop': typeof ShopRoute
  '/star-board': typeof StarBoardRoute
  '/tasks': typeof TasksRoute
  '/unlock-gate': typeof UnlockGateRoute
  '/minigames/battle': typeof MinigamesBattleRoute
  '/minigames/battle-result': typeof MinigamesBattleResultRoute
  '/minigames/slide': typeof MinigamesSlideRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/auth-error'
    | '/check-in'
    | '/frens'
    | '/gate'
    | '/home'
    | '/send-gift'
    | '/shop'
    | '/star-board'
    | '/tasks'
    | '/unlock-gate'
    | '/minigames/battle'
    | '/minigames/battle-result'
    | '/minigames/slide'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth-error'
    | '/check-in'
    | '/frens'
    | '/gate'
    | '/home'
    | '/send-gift'
    | '/shop'
    | '/star-board'
    | '/tasks'
    | '/unlock-gate'
    | '/minigames/battle'
    | '/minigames/battle-result'
    | '/minigames/slide'
  id:
    | '__root__'
    | '/'
    | '/auth-error'
    | '/check-in'
    | '/frens'
    | '/gate'
    | '/home'
    | '/send-gift'
    | '/shop'
    | '/star-board'
    | '/tasks'
    | '/unlock-gate'
    | '/minigames/battle'
    | '/minigames/battle-result'
    | '/minigames/slide'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthErrorRoute: typeof AuthErrorRoute
  CheckInRoute: typeof CheckInRoute
  FrensRoute: typeof FrensRoute
  GateRoute: typeof GateRoute
  HomeRoute: typeof HomeRoute
  SendGiftRoute: typeof SendGiftRoute
  ShopRoute: typeof ShopRoute
  StarBoardRoute: typeof StarBoardRoute
  TasksRoute: typeof TasksRoute
  UnlockGateRoute: typeof UnlockGateRoute
  MinigamesBattleRoute: typeof MinigamesBattleRoute
  MinigamesBattleResultRoute: typeof MinigamesBattleResultRoute
  MinigamesSlideRoute: typeof MinigamesSlideRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthErrorRoute: AuthErrorRoute,
  CheckInRoute: CheckInRoute,
  FrensRoute: FrensRoute,
  GateRoute: GateRoute,
  HomeRoute: HomeRoute,
  SendGiftRoute: SendGiftRoute,
  ShopRoute: ShopRoute,
  StarBoardRoute: StarBoardRoute,
  TasksRoute: TasksRoute,
  UnlockGateRoute: UnlockGateRoute,
  MinigamesBattleRoute: MinigamesBattleRoute,
  MinigamesBattleResultRoute: MinigamesBattleResultRoute,
  MinigamesSlideRoute: MinigamesSlideRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth-error",
        "/check-in",
        "/frens",
        "/gate",
        "/home",
        "/send-gift",
        "/shop",
        "/star-board",
        "/tasks",
        "/unlock-gate",
        "/minigames/battle",
        "/minigames/battle-result",
        "/minigames/slide"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth-error": {
      "filePath": "auth-error.tsx"
    },
    "/check-in": {
      "filePath": "check-in.tsx"
    },
    "/frens": {
      "filePath": "frens.tsx"
    },
    "/gate": {
      "filePath": "gate.tsx"
    },
    "/home": {
      "filePath": "home.tsx"
    },
    "/send-gift": {
      "filePath": "send-gift.tsx"
    },
    "/shop": {
      "filePath": "shop.tsx"
    },
    "/star-board": {
      "filePath": "star-board.tsx"
    },
    "/tasks": {
      "filePath": "tasks.tsx"
    },
    "/unlock-gate": {
      "filePath": "unlock-gate.tsx"
    },
    "/minigames/battle": {
      "filePath": "minigames/battle.tsx"
    },
    "/minigames/battle-result": {
      "filePath": "minigames/battle-result.tsx"
    },
    "/minigames/slide": {
      "filePath": "minigames/slide.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

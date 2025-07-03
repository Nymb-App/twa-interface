import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Provider } from '@/provider'
import { BackgroundMusic } from '@/components/background-music'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Provider>
        <BackgroundMusic />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </Provider>
    </>
  ),
})

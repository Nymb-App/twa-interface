import { BackgroundMusic } from '@/components/background-music'
import { ShopLoadingPortal } from '@/components/ui/shop-loading-portal'
import { Provider } from '@/provider'
import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Provider>
        <ShopLoadingPortal />
        <BackgroundMusic />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </Provider>
    </>
  ),
})

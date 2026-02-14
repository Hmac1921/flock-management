import { Outlet, createRootRoute } from '@tanstack/react-router';

import { AppLayout } from '../components/layouts/app-layout';

export const Route = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

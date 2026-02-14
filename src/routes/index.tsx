import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '../views/dashboard-page';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

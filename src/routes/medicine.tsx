import { createFileRoute } from '@tanstack/react-router';

import { MedicinePage } from '../views/medicine-page';

export const Route = createFileRoute('/medicine')({
  component: MedicinePage,
});

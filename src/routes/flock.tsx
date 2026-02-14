import { createFileRoute } from '@tanstack/react-router';

import { FlockPage } from '../views/flock-page';

export const Route = createFileRoute('/flock')({
  component: FlockPage,
});

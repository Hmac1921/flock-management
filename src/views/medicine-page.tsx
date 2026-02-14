import { Card, EmptyState } from '../components/design-system';

export const MedicinePage = () => (
  <Card eyebrow="Medicine" title="Medicines & Stock">
    <EmptyState
      title="No medicine records yet"
      description="Track medicine batches, expiry dates, and treatment history."
      actionLabel="Add medicine"
    />
  </Card>
);

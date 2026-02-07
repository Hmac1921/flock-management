import { create } from 'zustand';

type StockStore = {
  totalItems: number;
  pendingAudits: number;
  locations: number;
  lastActivity: string;
  recordDelivery: (count?: number) => void;
  scheduleAudit: (count?: number) => void;
  resolveAudit: (count?: number) => void;
  addLocation: () => void;
};

const activityMessage = (message: string) =>
  `${message} • ${new Date().toLocaleTimeString()}`;

export const useStockStore = create<StockStore>((set) => ({
  totalItems: 1280,
  pendingAudits: 3,
  locations: 6,
  lastActivity: activityMessage('Seeded sample data'),
  recordDelivery: (count = 40) =>
    set((state) => ({
      totalItems: state.totalItems + count,
      lastActivity: activityMessage(`Recorded delivery (+${count})`),
    })),
  scheduleAudit: (count = 1) =>
    set((state) => ({
      pendingAudits: state.pendingAudits + count,
      lastActivity: activityMessage(
        `Scheduled ${count} audit${count !== 1 ? 's' : ''}`,
      ),
    })),
  resolveAudit: (count = 1) =>
    set((state) => ({
      pendingAudits: Math.max(0, state.pendingAudits - count),
      lastActivity: activityMessage(
        `Closed ${count} audit${count !== 1 ? 's' : ''}`,
      ),
    })),
  addLocation: () =>
    set((state) => ({
      locations: state.locations + 1,
      lastActivity: activityMessage('Added warehouse'),
    })),
}));

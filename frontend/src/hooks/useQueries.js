import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

// ─── Helper: parse JSON safely ──────────────────────────────
const fetchJson = async (url, options = {}) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};

const authFetchJson = async (url, options = {}) => {
  const res = await authFetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};

// ─── Stale times ────────────────────────────────────────────
const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

// ═══════════════════════════════════════════════════════════
// PUBLIC QUERIES (no auth needed)
// ═══════════════════════════════════════════════════════════

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await fetchJson(API_ENDPOINTS.PRODUCTS);
      return data.data?.products || data.products || data || [];
    },
    staleTime: FIVE_MINUTES,
  });

export const useFarmers = () =>
  useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const data = await fetchJson(API_ENDPOINTS.MARKETPLACE_FARMERS);
      return data.data?.farmers || data.farmers || data || [];
    },
    staleTime: FIVE_MINUTES,
  });

export const useFarmerProfile = (farmerId) =>
  useQuery({
    queryKey: ['farmer', farmerId],
    queryFn: () => fetchJson(API_ENDPOINTS.MARKETPLACE_FARMER_PROFILE(farmerId)),
    enabled: !!farmerId,
    staleTime: FIVE_MINUTES,
  });

// ═══════════════════════════════════════════════════════════
// FARMER DASHBOARD QUERIES
// ═══════════════════════════════════════════════════════════

export const useFarmerProducts = (enabled = true) =>
  useQuery({
    queryKey: ['farmer', 'products'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.FARMER_PRODUCTS);
      return data.data?.products || [];
    },
    enabled,
    staleTime: FIVE_MINUTES,
  });

export const useFarmerOrders = (enabled = true) =>
  useQuery({
    queryKey: ['farmer', 'orders'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.FARMER_ORDERS);
      return data.data?.orders || [];
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

export const useFarmerProfile2 = (enabled = true) =>
  useQuery({
    queryKey: ['farmer', 'profile'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.PROFILE);
      return data.data?.profile || null;
    },
    enabled,
    staleTime: TEN_MINUTES,
  });

export const useInventorySummary = (enabled = true) =>
  useQuery({
    queryKey: ['farmer', 'inventory'],
    queryFn: async () => {
      const [summaryRes, historyRes] = await Promise.all([
        authFetch(API_ENDPOINTS.INVENTORY_SUMMARY),
        authFetch(API_ENDPOINTS.INVENTORY_HISTORY),
      ]);
      const summary = await summaryRes.json();
      const history = await historyRes.json();
      return {
        summary: summary || null,
        stockHistory: history?.history || [],
      };
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const [notifRes, countRes] = await Promise.all([
        authFetch(API_ENDPOINTS.NOTIFICATIONS),
        authFetch(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT),
      ]);
      const notifData = await notifRes.json();
      const countData = await countRes.json();
      return {
        notifications: notifData?.notifications || [],
        unreadCount: typeof countData?.unreadCount === 'number' ? countData.unreadCount : 0,
      };
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

// ─── Farmer Mutations ───────────────────────────────────────

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantityChange, notes }) => {
      const res = await authFetch(API_ENDPOINTS.INVENTORY_ADJUST(productId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityChange, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to adjust stock');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'products'] });
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      await authFetch(API_ENDPOINTS.NOTIFICATION_MARK_READ(notificationId), { method: 'PUT' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await authFetch(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ, { method: 'PUT' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      await authFetch(API_ENDPOINTS.NOTIFICATION_DELETE(notificationId), { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ═══════════════════════════════════════════════════════════
// ADMIN DASHBOARD QUERIES
// ═══════════════════════════════════════════════════════════

export const useAdminUsers = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.ADMIN_USERS);
      return data.data?.users || [];
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

export const useAdminDashboard = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const [activityRes, farmersRes, dashboardRes] = await Promise.all([
        authFetch(API_ENDPOINTS.ADMIN_ACTIVITY, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        authFetch(API_ENDPOINTS.ADMIN_TOP_FARMERS, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        authFetch(API_ENDPOINTS.ADMIN_DASHBOARD, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);

      let activity = [];
      let topFarmers = [];
      let dashboardStats = null;

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        activity = (activityData.data?.activities || []).slice(0, 10).map((a) => ({
          id: a.id,
          type: a.type === 'order' ? 'Order Placed' : a.type === 'product' ? 'Product Added' : 'Review Posted',
          actor: a.description?.split(' ')[0] || 'User',
          target: a.description || '',
          time: new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rawType: a.type,
        }));
      }

      if (farmersRes.ok) {
        const farmersData = await farmersRes.json();
        topFarmers = (farmersData.data?.farmers || []).map((f) => ({
          id: f.id,
          name: f.name,
          phone: f.phone || '',
          revenue: `${Math.floor(f.revenue).toLocaleString()} FCFA`,
          orderCount: f.orderCount,
          productsSold: f.productsSold,
        }));
      }

      if (dashboardRes.ok) {
        const dashData = await dashboardRes.json();
        dashboardStats = dashData.data;
      }

      return { activity, topFarmers, dashboardStats };
    },
    enabled,
    staleTime: FIVE_MINUTES,
  });

export const useAdminTransactions = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.ADMIN_TRANSACTIONS);
      return data.data?.transactions || [];
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

export const useAdminPendingFarmers = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'pendingFarmers'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.ADMIN_PENDING_FARMERS);
      return data.data || data || [];
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

// ═══════════════════════════════════════════════════════════
// CONSUMER QUERIES
// ═══════════════════════════════════════════════════════════

export const useMyOrders = (enabled = true) =>
  useQuery({
    queryKey: ['consumer', 'orders'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.MY_ORDERS);
      return data.data?.orders || data.orders || [];
    },
    enabled,
    staleTime: ONE_MINUTE,
  });

export const useReviewableProducts = (enabled = true) =>
  useQuery({
    queryKey: ['consumer', 'reviewable'],
    queryFn: async () => {
      const data = await authFetchJson(API_ENDPOINTS.REVIEW_MY_REVIEWABLE);
      return data.data || data || [];
    },
    enabled,
    staleTime: FIVE_MINUTES,
  });

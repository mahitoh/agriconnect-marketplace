// Dummy data for dashboard UI (farmer, consumer, admin)

export const farmerSummary = {
  name: 'Jean-Pierre Mballa',
  farmName: 'Ferme Bio Mballa',
  revenueThisMonth: '1,250,000 FCFA',
  ordersThisMonth: 48,
  activeProducts: 32,
  fulfillmentRate: '96%',
  pendingOrders: 6,
  completedOrders: 42,
  availableInventory: 210
};

export const farmerRecentOrders = [
  { id: 'ORD-1023', customer: 'Alice N.', total: '32,500 FCFA', status: 'Pending', date: 'Today' },
  { id: 'ORD-1022', customer: 'Bouba K.', total: '15,000 FCFA', status: 'Completed', date: 'Yesterday' },
  { id: 'ORD-1021', customer: 'Flora S.', total: '8,200 FCFA', status: 'Completed', date: '2 days ago' },
  { id: 'ORD-1020', customer: 'Marcel T.', total: '21,500 FCFA', status: 'Cancelled', date: '3 days ago' }
];

export const farmerProducts = [
  { id: 1, name: 'Organic Vegetable Basket', category: 'Vegetables', price: '15,000 FCFA', quantity: 25, status: 'Active' },
  { id: 2, name: 'Fresh Tomatoes (5kg)', category: 'Vegetables', price: '2,500 FCFA', quantity: 40, status: 'Active' },
  { id: 3, name: 'Farm Eggs (30)', category: 'Livestock', price: '4,500 FCFA', quantity: 18, status: 'Low stock' },
  { id: 4, name: 'Banana Bunch', category: 'Fruits', price: '1,800 FCFA', quantity: 0, status: 'Out of stock' }
];

export const farmerPayments = [
  { id: 'PAY-8001', orderId: 'ORD-1022', phone: '+237 6XX XXX 123', amount: '15,000 FCFA', status: 'Successful', reference: 'MTN123456', date: 'Today' },
  { id: 'PAY-7999', orderId: 'ORD-1021', phone: '+237 6XX XXX 456', amount: '8,200 FCFA', status: 'Successful', reference: 'MTN123455', date: 'Yesterday' },
  { id: 'PAY-7995', orderId: 'ORD-1019', phone: '+237 6XX XXX 789', amount: '12,000 FCFA', status: 'Pending', reference: 'MTN123450', date: '2 days ago' }
];

export const farmerEarningsByMonth = [
  { month: 'Jan', amount: 820000 },
  { month: 'Feb', amount: 910000 },
  { month: 'Mar', amount: 740000 },
  { month: 'Apr', amount: 1_050_000 },
  { month: 'May', amount: 1_250_000 }
];

export const farmerInventory = [
  { id: 1, name: 'Organic Vegetable Basket', quantity: 25, lowStockThreshold: 10 },
  { id: 2, name: 'Fresh Tomatoes (5kg)', quantity: 40, lowStockThreshold: 15 },
  { id: 3, name: 'Farm Eggs (30)', quantity: 8, lowStockThreshold: 10 },
  { id: 4, name: 'Banana Bunch', quantity: 0, lowStockThreshold: 8 }
];

export const farmerNotifications = [
  { id: 1, type: 'order', message: 'New order ORD-1023 received from Alice N.', time: '5 min ago', read: false },
  { id: 2, type: 'payment', message: 'Payment PAY-8001 confirmed for ORD-1022.', time: '30 min ago', read: false },
  { id: 3, type: 'system', message: 'Your farm profile has been verified by the admin team.', time: 'Yesterday', read: true }
];

export const farmerSupportTickets = [
  { id: 'SUP-301', subject: 'Payment delay for ORD-1019', status: 'Open', date: '2 days ago' },
  { id: 'SUP-298', subject: 'Question about product approval', status: 'Resolved', date: 'Last week' }
];

export const consumerSummary = {
  name: 'Alice Nkam',
  totalSpent: '420,000 FCFA',
  ordersCount: 27,
  favouriteFarmers: 5
};

export const consumerRecentOrders = [
  { id: 'ORD-2034', farmer: 'Ferme Bio Mballa', total: '18,000 FCFA', status: 'On the way', date: 'Today' },
  { id: 'ORD-2033', farmer: 'Les Jardins de Mama Ngo', total: '9,500 FCFA', status: 'Delivered', date: 'Last week' },
  { id: 'ORD-2032', farmer: 'Ferme Nkeng', total: '12,300 FCFA', status: 'Delivered', date: '2 weeks ago' }
];

export const consumerSuggestions = [
  { id: 1, name: 'Banana Bunch', farmer: 'Ferme Nkeng', price: '1,800 FCFA' },
  { id: 2, name: 'Organic Vegetable Basket', farmer: 'Ferme Bio Mballa', price: '15,000 FCFA' },
  { id: 3, name: 'Farm Eggs (30)', farmer: 'Poulailler Fotso', price: '4,500 FCFA' }
];

export const adminSummary = {
  totalUsers: 1248,
  farmers: 312,
  consumers: 936,
  activeOrders: 57,
  monthlyVolume: '8,900,000 FCFA'
};

export const adminRecentActivity = [
  { id: 1, type: 'Farmer Approved', actor: 'Admin', target: 'Ferme Bio Mballa', time: '5 min ago' },
  { id: 2, type: 'Order Placed', actor: 'Consumer', target: 'ORD-3045', time: '12 min ago' },
  { id: 3, type: 'Payout Processed', actor: 'System', target: 'Mama Ngo Fotso', time: '1 hour ago' },
  { id: 4, type: 'User Suspended', actor: 'Admin', target: 'Test Farmer', time: 'Yesterday' }
];

export const adminTopFarmers = [
  { id: 1, name: 'Ferme Bio Mballa', region: 'Centre', revenue: '2,100,000 FCFA' },
  { id: 2, name: 'Les Jardins de Mama Ngo', region: 'Ouest', revenue: '1,760,000 FCFA' },
  { id: 3, name: 'Ferme Nkeng', region: 'Littoral', revenue: '1,430,000 FCFA' }
];


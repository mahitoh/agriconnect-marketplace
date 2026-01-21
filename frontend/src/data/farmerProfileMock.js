// Mock data for Farmer Profile page
// This file will be replaced with API calls when backend is connected

// Complete farmers database with products and reviews
export const farmersDatabase = {
  1: {
    id: 1,
    name: 'Jean-Pierre Mballa',
    farmName: 'Ferme Bio Mballa',
    location: 'Yaoundé, Centre Region',
    memberSince: 'March 2024',
    rating: 4.9,
    totalReviews: 234,
    totalProducts: 45,
    totalOrders: 892,
    yearsExperience: 12,
    responseTime: '< 2 hours',
    coverImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=400&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop',
    badges: ['Organic', 'Sustainable', 'Non-GMO', 'Verified'],
    bio: 'Third-generation farmer committed to organic agriculture and sustainable farming practices. Our family has been cultivating this land for over 30 years, and we take pride in producing the freshest, highest-quality vegetables and fruits without the use of harmful pesticides or chemicals. We believe in working with nature, not against it, to create products that are not only delicious but also beneficial for your health and the environment.',
    philosophy: 'At Ferme Bio Mballa, we practice regenerative farming techniques that improve soil health, conserve water, and promote biodiversity. Every product we grow is a testament to our commitment to quality and sustainability.',
    certifications: ['Organic Certification', 'Sustainable Farming Practice', 'Local Farmers Association Member'],
    products: [
      { id: 1, name: 'Organic Vegetable Basket', category: 'Vegetables', price: 15000, stock: 45, sales: 234, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&h=300&fit=crop', rating: 4.8 },
      { id: 2, name: 'Fresh Tomatoes (5kg)', category: 'Vegetables', price: 8500, stock: 120, sales: 456, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop', rating: 4.9 },
      { id: 3, name: 'Organic Lettuce Bundle', category: 'Vegetables', price: 3500, stock: 80, sales: 189, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop', rating: 4.7 },
      { id: 4, name: 'Mixed Fruit Basket', category: 'Fruits', price: 12000, stock: 35, sales: 298, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop', rating: 5.0 },
      { id: 5, name: 'Fresh Carrots (3kg)', category: 'Vegetables', price: 4500, stock: 95, sales: 367, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop', rating: 4.8 },
      { id: 6, name: 'Organic Bell Peppers', category: 'Vegetables', price: 6000, stock: 60, sales: 178, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop', rating: 4.6 }
    ],
    reviews: [
      { id: 1, author: 'Marie Nguema', rating: 5, date: '2026-01-15', comment: 'Amazing quality vegetables! Fresh and organic. Will definitely order again.', avatar: 'MN' },
      { id: 2, author: 'Pierre Kamga', rating: 5, date: '2026-01-12', comment: 'Best farmer on the platform. Products always arrive fresh and well-packaged.', avatar: 'PK' },
      { id: 3, author: 'Aminata Sow', rating: 4, date: '2026-01-08', comment: 'Great quality products. Delivery was a bit delayed but worth the wait.', avatar: 'AS' },
      { id: 4, author: 'Jean Tchoua', rating: 5, date: '2026-01-05', comment: 'Outstanding! The vegetables taste so much better than store-bought.', avatar: 'JT' }
    ]
  },
  2: {
    id: 2,
    name: 'Mama Ngo Fotso',
    farmName: 'Les Jardins de Mama Ngo',
    location: 'Bafoussam, Ouest Region',
    memberSince: 'June 2024',
    rating: 4.8,
    totalReviews: 189,
    totalProducts: 32,
    totalOrders: 654,
    yearsExperience: 8,
    responseTime: '< 1 hour',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&h=400&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=200&h=200&fit=crop',
    badges: ['Non-GMO', 'Farmer', 'Verified'],
    bio: 'Passionate about regenerative agriculture and animal welfare. Every product is grown with love and care, ensuring the highest quality for our customers. I started farming to provide healthy food for my family and community.',
    philosophy: 'We believe that farming should work in harmony with nature. Our methods prioritize soil health, animal welfare, and community well-being over profit maximization.',
    certifications: ['Non-GMO Verified', 'Animal Welfare Certified', 'Community Supported Agriculture'],
    products: [
      { id: 1, name: 'Farm Fresh Eggs (30)', category: 'Poultry', price: 4500, stock: 200, sales: 567, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', rating: 4.9 },
      { id: 2, name: 'Organic Potatoes (5kg)', category: 'Vegetables', price: 3500, stock: 150, sales: 345, image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber6a?w=300&h=300&fit=crop', rating: 4.7 },
      { id: 3, name: 'Fresh Cassava (10kg)', category: 'Tubers', price: 5000, stock: 80, sales: 234, image: 'https://images.unsplash.com/photo-1591189824344-271d6a7e2e21?w=300&h=300&fit=crop', rating: 4.8 },
      { id: 4, name: 'Plantain Bunch', category: 'Fruits', price: 2500, stock: 100, sales: 412, image: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=300&h=300&fit=crop', rating: 4.9 }
    ],
    reviews: [
      { id: 1, author: 'Claude Atangana', rating: 5, date: '2026-01-14', comment: 'Mama Ngo has the freshest eggs in town! My family loves them.', avatar: 'CA' },
      { id: 2, author: 'Sophie Njoya', rating: 5, date: '2026-01-10', comment: 'Excellent quality and very friendly service. Highly recommend!', avatar: 'SN' },
      { id: 3, author: 'Emmanuel Fon', rating: 4, date: '2026-01-06', comment: 'Good products, fair prices. The cassava was perfect for our family meal.', avatar: 'EF' }
    ]
  },
  3: {
    id: 3,
    name: 'Paul Nkeng',
    farmName: 'Ferme Nkeng',
    location: 'Douala, Littoral Region',
    memberSince: 'January 2024',
    rating: 4.7,
    totalReviews: 156,
    totalProducts: 58,
    totalOrders: 723,
    yearsExperience: 15,
    responseTime: '< 3 hours',
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&h=400&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop',
    badges: ['Organic', 'Local', 'Verified'],
    bio: 'Specializing in fresh vegetables and fruits. We use traditional farming methods combined with modern techniques to deliver the best products. With 15 years of experience, we know what our customers want.',
    philosophy: 'Quality over quantity. Every product that leaves our farm meets our strict standards. We believe in supporting the local economy and providing employment opportunities for our community.',
    certifications: ['Organic Certification', 'Local Produce Award Winner', 'Export Quality Standard'],
    products: [
      { id: 1, name: 'Ripe Fruit Basket', category: 'Fruits', price: 3500, stock: 60, sales: 289, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop', rating: 4.9 },
      { id: 2, name: 'Organic Pineapple', category: 'Fruits', price: 2000, stock: 80, sales: 445, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=300&fit=crop', rating: 4.8 },
      { id: 3, name: 'Fresh Mangoes (5)', category: 'Fruits', price: 3000, stock: 120, sales: 512, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop', rating: 4.7 },
      { id: 4, name: 'Avocados (6 pack)', category: 'Fruits', price: 4000, stock: 90, sales: 367, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop', rating: 4.8 },
      { id: 5, name: 'Organic Spinach Bundle', category: 'Vegetables', price: 2500, stock: 70, sales: 234, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', rating: 4.6 }
    ],
    reviews: [
      { id: 1, author: 'Francois Tabi', rating: 5, date: '2026-01-13', comment: 'The best fruits in Douala! Always fresh and perfectly ripe.', avatar: 'FT' },
      { id: 2, author: 'Grace Mbock', rating: 4, date: '2026-01-09', comment: 'Good variety of products. The avocados were excellent!', avatar: 'GM' },
      { id: 3, author: 'Martin Essomba', rating: 5, date: '2026-01-04', comment: 'Paul is a trustworthy farmer. His products never disappoint.', avatar: 'ME' }
    ]
  }
};

// Helper function to get farmer by ID
export const getFarmerById = (id) => {
  return farmersDatabase[id] || null;
};

// For backward compatibility
export const farmerMock = farmersDatabase[1];
export const farmerProductsMock = farmersDatabase[1].products;
export const farmerReviewsMock = farmersDatabase[1].reviews;

// Rating distribution for reviews tab
export const ratingDistribution = [
  { stars: 5, percentage: 85 },
  { stars: 4, percentage: 12 },
  { stars: 3, percentage: 3 },
  { stars: 2, percentage: 0 },
  { stars: 1, percentage: 0 }
];

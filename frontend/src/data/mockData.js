// Mock data for UI development (no backend connection yet)

export const stats = [
  { number: '2,500+', label: 'Farmers' },
  { number: '50K+', label: 'Deliveries' },
  { number: '100%', label: 'Transparent' }
];

export const features = [
  {
    title: 'Direct From Farmers',
    description: 'Buy directly from verified local producers. No middlemen involved.'
  },
  {
    title: 'Transparent Prices',
    description: 'See exactly where your money goes. 85% goes directly back to farmers.'
  },
  {
    title: 'Verified Producers',
    description: 'Every farm is personally inspected and verified before joining the platform.'
  },
  {
    title: 'Mobile Payments',
    description: 'Pay easily using MTN Mobile Money or cash on delivery.'
  }
];

export const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&h=350&fit=crop',
    badge: 'Popular',
    badgeColor: '#2d5f3f',
    rating: '4.9',
    reviews: '128',
    name: 'Organic Vegetable Basket',
    farmer: 'Ferme Mballa',
    location: 'Yaoundé, Centre',
    price: '15 000 FCFA',
    oldPrice: '18 000 FCFA'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=350&fit=crop',
    badge: 'Fresh',
    badgeColor: '#ef5350',
    rating: '4.8',
    reviews: '89',
    name: 'Farm Eggs (30)',
    farmer: 'Poulailler Fotso',
    location: 'Bafoussam, Ouest',
    price: '4 500 FCFA',
    oldPrice: null
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&h=350&fit=crop',
    badge: 'Bio',
    badgeColor: '#66bb6a',
    rating: '4.9',
    reviews: '156',
    name: 'Ripe Fruit Basket',
    farmer: 'Les Jardins',
    location: 'Douala, Littoral',
    price: '3 500 FCFA',
    oldPrice: null
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&h=350&fit=crop',
    badge: 'Popular',
    badgeColor: '#2d5f3f',
    rating: '4.7',
    reviews: '92',
    name: 'Fresh Tomatoes (5kg)',
    farmer: 'Ferme Bio Mballa',
    location: 'Yaoundé, Centre',
    price: '2 500 FCFA',
    oldPrice: null
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=350&fit=crop',
    badge: 'Fresh',
    badgeColor: '#ef5350',
    rating: '4.8',
    reviews: '67',
    name: 'Organic Carrots (3kg)',
    farmer: 'Les Jardins',
    location: 'Douala, Littoral',
    price: '3 200 FCFA',
    oldPrice: '3 800 FCFA'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&h=350&fit=crop',
    badge: 'Bio',
    badgeColor: '#66bb6a',
    rating: '4.9',
    reviews: '134',
    name: 'Banana Bunch',
    farmer: 'Poulailler Fotso',
    location: 'Bafoussam, Ouest',
    price: '1 800 FCFA',
    oldPrice: null
  }
];

export const steps = [
  {
    title: 'Browse & Discover',
    description: 'Explore fresh products from verified farmers in your region.'
  },
  {
    title: 'Order & Pay',
    description: 'Add to cart and pay via MTN Mobile Money or cash on delivery.'
  },
  {
    title: 'Receive & Enjoy',
    description: 'Motorcycle delivery brings your fresh products within 24-48 hours.'
  }
];

export const farmers = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=300&h=350&fit=crop',
    rating: '4.9',
    reviews: '234',
    name: 'Jean-Pierre Mballa',
    farm: 'Ferme Bio Mballa',
    location: 'Yaoundé, Centre',
    bio: 'Third-generation farmer committed to organic agriculture. Our family has been cultivating this land for over 30 years, focusing on sustainable practices and quality produce.',
    badges: ['Bio', 'Sustainable'],
    years: '12 years',
    products: '45 products',
    btnStyle: 'outline'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&h=350&fit=crop',
    rating: '4.8',
    reviews: '189',
    name: 'Mama Ngo Fotso',
    farm: 'Les Jardins de Mama Ngo',
    location: 'Bafoussam, Ouest',
    bio: 'Passionate about regenerative agriculture and animal welfare. Every product is grown with love and care, ensuring the highest quality for our customers.',
    badges: ['Farmer', 'Non-GMO'],
    years: '8 years',
    products: '32 products',
    btnStyle: 'primary'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=300&h=350&fit=crop',
    rating: '4.7',
    reviews: '156',
    name: 'Paul Nkeng',
    farm: 'Ferme Nkeng',
    location: 'Douala, Littoral',
    bio: 'Specializing in fresh vegetables and fruits. We use traditional farming methods combined with modern techniques to deliver the best products.',
    badges: ['Organic', 'Local'],
    years: '15 years',
    products: '58 products',
    btnStyle: 'outline'
  }
];

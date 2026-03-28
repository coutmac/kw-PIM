const prisma = require('./db');

async function seed() {
  const products = [
    {
      name: 'Wireless Headphones',
      sku: 'WH001',
      price: '99.99',
      stock: 50,
      rawDescription: 'High quality wireless headphones with noise cancellation',
      attributes: JSON.stringify([{ name: 'Color', value: 'Black' }, { name: 'Battery Life', value: '20 hours' }]),
      category: 'Electronics',
      imageUrl: 'https://example.com/headphones.jpg'
    },
    {
      name: 'Running Shoes',
      sku: 'RS002',
      price: '129.99',
      stock: 30,
      rawDescription: 'Comfortable running shoes for all terrains',
      attributes: JSON.stringify([{ name: 'Size', value: '10' }, { name: 'Material', value: 'Mesh' }]),
      category: 'Fitness',
      imageUrl: 'https://example.com/shoes.jpg'
    },
    {
      name: 'Smart Watch',
      sku: 'SW003',
      price: '199.99',
      stock: 20,
      rawDescription: 'Feature-rich smart watch with health tracking',
      attributes: JSON.stringify([{ name: 'Screen Size', value: '1.5 inches' }, { name: 'Water Resistance', value: '50m' }]),
      category: 'Electronics',
      imageUrl: 'https://example.com/watch.jpg'
    },
    {
      name: 'Yoga Mat',
      sku: 'YM004',
      price: '39.99',
      stock: 100,
      rawDescription: 'Non-slip yoga mat for all yoga practices',
      attributes: JSON.stringify([{ name: 'Thickness', value: '6mm' }, { name: 'Material', value: 'TPE' }]),
      category: 'Fitness',
      imageUrl: 'https://example.com/mat.jpg'
    },
    {
      name: 'Coffee Maker',
      sku: 'CM005',
      price: '79.99',
      stock: 40,
      rawDescription: 'Automatic coffee maker with programmable timer',
      attributes: JSON.stringify([{ name: 'Capacity', value: '12 cups' }, { name: 'Features', value: 'Programmable' }]),
      category: 'Home',
      imageUrl: 'https://example.com/coffee.jpg'
    },
    {
      name: 'Bluetooth Speaker',
      sku: 'BS006',
      price: '49.99',
      stock: 60,
      rawDescription: 'Portable Bluetooth speaker with waterproof design',
      attributes: JSON.stringify([{ name: 'Battery Life', value: '10 hours' }, { name: 'Waterproof', value: 'IPX7' }]),
      category: 'Electronics',
      imageUrl: 'https://example.com/speaker.jpg'
    },
    {
      name: 'Dumbbells Set',
      sku: 'DS007',
      price: '89.99',
      stock: 25,
      rawDescription: 'Adjustable dumbbells set for home workouts',
      attributes: JSON.stringify([{ name: 'Weight Range', value: '5-25 lbs' }, { name: 'Material', value: 'Cast Iron' }]),
      category: 'Fitness',
      imageUrl: 'https://example.com/dumbbells.jpg'
    },
    {
      name: 'Kitchen Blender',
      sku: 'KB008',
      price: '59.99',
      stock: 35,
      rawDescription: 'High-speed blender for smoothies and soups',
      attributes: JSON.stringify([{ name: 'Power', value: '1000W' }, { name: 'Capacity', value: '72 oz' }]),
      category: 'Home',
      imageUrl: 'https://example.com/blender.jpg'
    },
    {
      name: 'Wireless Mouse',
      sku: 'WM009',
      price: '29.99',
      stock: 80,
      rawDescription: 'Ergonomic wireless mouse with long battery life',
      attributes: JSON.stringify([{ name: 'DPI', value: '1600' }, { name: 'Battery Life', value: '12 months' }]),
      category: 'Electronics',
      imageUrl: 'https://example.com/mouse.jpg'
    },
    {
      name: 'Wall Art',
      sku: 'WA010',
      price: '24.99',
      stock: 45,
      rawDescription: 'Modern wall art print for home decoration',
      attributes: JSON.stringify([{ name: 'Size', value: '24x36 inches' }, { name: 'Material', value: 'Canvas' }]),
      category: 'Home',
      imageUrl: 'https://example.com/art.jpg'
    }
  ];
  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.error('Seeded 10 products');
}

seed().catch(console.error).finally(() => process.exit());
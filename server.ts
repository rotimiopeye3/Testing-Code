import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Product Data (Moved to server for real API simulation)
  const PRODUCTS = [
    {
      id: '1',
      name: 'Air Max Pulse',
      brand: 'Nike',
      price: 160,
      description: 'A tough, vacuum-sealed look with comfort from the future.',
      category: 'Men',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11, 12],
      rating: 4.8,
      isFeatured: true
    },
    {
      id: '2',
      name: 'Ultraboost Light',
      brand: 'Adidas',
      price: 190,
      description: 'Experience epic energy with the new Ultraboost Light.',
      category: 'Running',
      images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10],
      rating: 4.9
    },
    {
      id: '3',
      name: 'Classic Leather',
      brand: 'Reebok',
      price: 85,
      description: 'A timeless silhouette for everyday style.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11],
      rating: 4.5
    },
    {
      id: '4',
      name: 'Fresh Foam 1080',
      brand: 'New Balance',
      price: 165,
      description: 'Premium cushioning for your daily runs.',
      category: 'Running',
      images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000'],
      sizes: [8, 9, 10, 11, 12],
      rating: 4.7
    },
    {
      id: '5',
      name: 'Forum Low',
      brand: 'Adidas',
      price: 100,
      description: 'More than just a shoe, it\'s a statement.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11],
      rating: 4.6
    },
    {
      id: '6',
      name: 'Zoom Fly 5',
      brand: 'Nike',
      price: 170,
      description: 'Bridge the gap between your weekend training run and race day.',
      category: 'Running',
      images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000'],
      sizes: [8, 9, 10, 11],
      rating: 4.8
    },
    {
      id: '7',
      name: 'Old Skool',
      brand: 'Vans',
      price: 70,
      description: 'The classic skate shoe that started it all.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10, 11, 12],
      rating: 4.4
    },
    {
      id: '8',
      name: 'Chuck Taylor All Star',
      brand: 'Converse',
      price: 65,
      description: 'The most iconic sneaker in the world.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000'],
      sizes: [5, 6, 7, 8, 9, 10, 11, 12],
      rating: 4.3
    },
    {
      id: '9',
      name: 'Air Jordan 1 Retro',
      brand: 'Jordan',
      price: 180,
      description: 'The shoe that started it all. A timeless classic.',
      category: 'Men',
      images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11, 12, 13],
      rating: 4.9,
      isFeatured: true
    },
    {
      id: '10',
      name: 'Yeezy Boost 350',
      brand: 'Adidas',
      price: 220,
      description: 'Innovative design meets ultimate comfort.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10, 11],
      rating: 4.8
    },
    {
      id: '11',
      name: 'Gel-Kayano 29',
      brand: 'Asics',
      price: 160,
      description: 'Advanced stability for long-distance running.',
      category: 'Running',
      images: ['https://images.unsplash.com/photo-1605405748313-a416a1b84491?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11, 12],
      rating: 4.7
    },
    {
      id: '12',
      name: 'Suede Classic',
      brand: 'Puma',
      price: 75,
      description: 'The original street style icon.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1537261131936-3cdff36a1bc9?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10, 11],
      rating: 4.4
    },
    {
      id: '13',
      name: 'Air Force 1',
      brand: 'Nike',
      price: 110,
      description: 'The legend lives on in the Nike Air Force 1.',
      category: 'Men',
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000'],
      sizes: [7, 8, 9, 10, 11, 12],
      rating: 4.9
    },
    {
      id: '14',
      name: 'NMD_R1',
      brand: 'Adidas',
      price: 150,
      description: 'Streetwear shoes with a tech-inspired look.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1512374382149-4332c6c021f1?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10, 11],
      rating: 4.6
    },
    {
      id: '15',
      name: 'Sk8-Hi',
      brand: 'Vans',
      price: 80,
      description: 'The legendary high top lace-up with padded collars.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000'],
      sizes: [6, 7, 8, 9, 10, 11, 12],
      rating: 4.5
    },
    {
      id: '16',
      name: 'Air Max 270',
      brand: 'Nike',
      price: 150,
      description: 'Big air for big comfort.',
      category: 'Women',
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000'],
      sizes: [5, 6, 7, 8, 9],
      rating: 4.8,
      isNewRelease: true
    },
    {
      id: '17',
      name: 'Stan Smith',
      brand: 'Adidas',
      price: 95,
      description: 'Timeless style, now more sustainable.',
      category: 'Women',
      images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000'],
      sizes: [5, 6, 7, 8],
      rating: 4.7
    },
    {
      id: '18',
      name: 'Dunk Low',
      brand: 'Nike',
      price: 110,
      description: 'The basketball icon of the 80s returns.',
      category: 'Kids',
      images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000'],
      sizes: [3, 4, 5, 6],
      rating: 4.9,
      isNewRelease: true
    },
    {
      id: '19',
      name: 'Superstar Kids',
      brand: 'Adidas',
      price: 70,
      description: 'The classic shell-toe for the next generation.',
      category: 'Kids',
      images: ['https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000'],
      sizes: [2, 3, 4, 5],
      rating: 4.6
    },
    {
      id: '20',
      name: 'Metcon 8',
      brand: 'Nike',
      price: 130,
      description: 'The gold standard for weight training.',
      category: 'Shoes',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'],
      sizes: [8, 9, 10, 11, 12],
      rating: 4.7,
      isNewRelease: true
    },
    {
      id: '21',
      name: 'Tech Fleece Hoodie',
      brand: 'Nike',
      price: 110,
      description: 'Lightweight warmth for everyday wear.',
      category: 'Clothing',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000'],
      rating: 4.8,
      isFeatured: true,
      isNewRelease: true
    },
    {
      id: '22',
      name: 'Seamaster Aqua Terra',
      brand: 'Omega',
      price: 5500,
      description: 'A tribute to OMEGA\'s maritime heritage.',
      category: 'Watch',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000'],
      rating: 5.0,
      isFeatured: true
    },
    {
      id: '23',
      name: 'Performance Singlet',
      brand: 'Under Armour',
      price: 35,
      description: 'Breathable fabric for intense workouts.',
      category: 'Singlet',
      images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000'],
      rating: 4.5,
      isNewRelease: true
    },
    {
      id: '24',
      name: 'Cotton Stretch Boxers',
      brand: 'Calvin Klein',
      price: 45,
      description: 'Classic comfort in a 3-pack.',
      category: 'Boxers',
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000'],
      rating: 4.9,
      isFeatured: true
    }
  ];

  // API Routes
  app.get("/api/products", (req, res) => {
    const { category, brand, sort } = req.query;
    let filtered = [...PRODUCTS];

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
    }

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    res.json(filtered);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

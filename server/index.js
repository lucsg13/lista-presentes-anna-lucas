import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// AUTHENTICATION
// ==========================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const AUTH_TOKEN = 'admin-token-secret-123';

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${AUTH_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: AUTH_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ==========================================
// PRESENTS ROUTES
// ==========================================

// Get all presents
app.get('/api/presents', async (req, res) => {
  try {
    const snapshot = await db.collection('presents').get();
    const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a present (with optional URL scraping for image)
app.post('/api/presents', requireAuth, async (req, res) => {
  let { name, price, link, image_url } = req.body;

  // Attempt to scrape image if link provided but no image
  if (link && !image_url) {
    try {
      // Use native fetch to get HTML
      const response = await fetch(link, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Look for Open Graph image
      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage) {
        image_url = ogImage;
      } else {
        // Fallback: look for the first decent sized image or product image
        const img = $('img').first().attr('src');
        if (img && img.startsWith('http')) {
          image_url = img;
        }
      }
    } catch (err) {
      console.error('Failed to scrape image:', err.message);
      // Proceed without image
    }
  }

  try {
    const presentData = { name, price, link, image_url: image_url || '' };
    const docRef = await db.collection('presents').add(presentData);
    res.json({ id: docRef.id, ...presentData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a present
app.put('/api/presents/:id', requireAuth, async (req, res) => {
  const { name, price, link, image_url } = req.body;
  try {
    await db.collection('presents').doc(req.params.id).update({ name, price, link, image_url });
    res.json({ updated: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a present
app.delete('/api/presents/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('presents').doc(req.params.id).delete();
    res.json({ deleted: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// RSVP ROUTES
// ==========================================

// Get all RSVPs
app.get('/api/rsvps', requireAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('rsvps').orderBy('created_at', 'desc').get();
    const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an RSVP
app.post('/api/rsvps', async (req, res) => {
  const { name, email, phone, message, status, companion, companion_name } = req.body;
  try {
    const docRef = await db.collection('rsvps').add({
      name, email, phone, message, status, companion, companion_name,
      created_at: new Date().toISOString()
    });
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an RSVP
app.delete('/api/rsvps/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('rsvps').doc(req.params.id).delete();
    res.json({ deleted: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

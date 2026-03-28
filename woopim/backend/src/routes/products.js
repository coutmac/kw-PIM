const express = require('express');
const prisma = require('../db');
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { syncLogs: true }
    });
    res.json(products.map(p => ({ ...p, attributes: JSON.parse(p.attributes) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { syncLogs: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ ...product, attributes: JSON.parse(product.attributes) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { name, sku, price, stock = 0, rawDescription, attributes = [], category, imageUrl } = req.body;
    if (!name || !sku || !price) return res.status(400).json({ error: 'Name, SKU, and price are required' });
    if (stock < 0) return res.status(400).json({ error: 'Stock must be >= 0' });
    if (!Array.isArray(attributes)) return res.status(400).json({ error: 'Attributes must be an array' });
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) return res.status(409).json({ error: 'SKU already exists' });
    const product = await prisma.product.create({
      data: { name, sku, price, stock, rawDescription, attributes: JSON.stringify(attributes), category, imageUrl }
    });
    res.json({ ...product, attributes: JSON.parse(product.attributes) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { name, sku, price, stock, rawDescription, attributes, category, imageUrl } = req.body;
    if (!name || !sku || !price) return res.status(400).json({ error: 'Name, SKU, and price are required' });
    if (stock < 0) return res.status(400).json({ error: 'Stock must be >= 0' });
    if (!Array.isArray(attributes)) return res.status(400).json({ error: 'Attributes must be an array' });
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing && existing.id !== parseInt(req.params.id)) return res.status(409).json({ error: 'SKU already exists' });
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, sku, price, stock, rawDescription, attributes: JSON.stringify(attributes), category, imageUrl, syncStatus: 'PENDING', syncError: null }
    });
    res.json({ ...product, attributes: JSON.parse(product.attributes) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /stats
router.get('/stats', async (req, res) => {
  try {
    const total = await prisma.product.count();
    const synced = await prisma.product.count({ where: { syncStatus: 'SYNCED' } });
    const pending = await prisma.product.count({ where: { syncStatus: 'PENDING' } });
    const failed = await prisma.product.count({ where: { syncStatus: 'FAILED' } });
    res.json({ total, synced, pending, failed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const prisma = require('../db');
const mockWoocommerce = require('../services/mockWoocommerce');
const router = express.Router();

// POST /api/sync/:id
router.post('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const result = await mockWoocommerce.syncProduct(product);
    const action = product.wcProductId ? 'UPDATE' : 'CREATE';
    if (result.success) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          syncStatus: 'SYNCED',
          wcProductId: result.id.toString(),
          lastSyncedAt: new Date(),
          syncError: null
        }
      });
      await prisma.syncLog.create({
        data: {
          productId: product.id,
          action,
          wcProductId: result.id.toString(),
          message: 'Synced successfully'
        }
      });
      res.json({ message: 'Synced successfully' });
    } else {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          syncStatus: 'FAILED',
          syncError: result.error
        }
      });
      await prisma.syncLog.create({
        data: {
          productId: product.id,
          action: 'FAILED',
          message: result.error
        }
      });
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sync/all
router.post('/all', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { syncStatus: { in: ['PENDING', 'FAILED'] } } });
    const results = [];
    for (const product of products) {
      const result = await mockWoocommerce.syncProduct(product);
      const action = product.wcProductId ? 'UPDATE' : 'CREATE';
      if (result.success) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            syncStatus: 'SYNCED',
            wcProductId: result.id.toString(),
            lastSyncedAt: new Date(),
            syncError: null
          }
        });
        await prisma.syncLog.create({
          data: {
            productId: product.id,
            action,
            wcProductId: result.id.toString(),
            message: 'Synced successfully'
          }
        });
        results.push({ id: product.id, success: true });
      } else {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            syncStatus: 'FAILED',
            syncError: result.error
          }
        });
        await prisma.syncLog.create({
          data: {
            productId: product.id,
            action: 'FAILED',
            message: result.error
          }
        });
        results.push({ id: product.id, success: false, error: result.error });
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sync/logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await prisma.syncLog.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
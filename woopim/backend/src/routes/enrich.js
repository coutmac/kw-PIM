const express = require('express');
const prisma = require('../db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const attrs = JSON.parse(product.attributes);
    const prompt = `Write a 3-sentence SEO product description for:
Product: ${product.name}
Category: ${product.category || 'N/A'}
Attributes: ${JSON.stringify(attrs)}
Notes: ${product.rawDescription || 'N/A'}
Return only the description.`;
    const result = await model.generateContent(prompt);
    const aiDescription = result.response.text().trim();
    await prisma.product.update({
      where: { id: product.id },
      data: { aiDescription }
    });
    res.json({ aiDescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const enrichRouter = require('./routes/enrich');
const syncRouter = require('./routes/sync');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/enrich', enrichRouter);
app.use('/api/sync', syncRouter);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.error(`Server running on port ${PORT}`);
});
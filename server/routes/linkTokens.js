/**
 * Route for creating a Plaid Link token
 */

const { asyncWrapper } = require('../middleware');
const express = require('express');
const plaid = require('../plaid');

const router = express.Router();

// GET /link-token/create
// Full URL: https://project-1-vjcg.onrender.com/link-token/create
router.get('/create', asyncWrapper(async (req, res) => {
  try {
    const linkTokenParams = {
      user: {
        // any fixed test id is fine for now
        client_user_id: 'test-user',
      },
      client_name: 'EndEasy',
      products: ['transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    };

    const createResponse = await plaid.linkTokenCreate(linkTokenParams);
    res.json(createResponse.data);
  } catch (err) {
    console.error('Error creating link token (GET /link-token/create)', err);
    res.status(500).json({ error: err.message || 'link token error' });
  }
}));

module.exports = router;

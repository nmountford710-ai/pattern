/**
 * Routes for Plaid Link token creation
 */

const { asyncWrapper } = require('../middleware');
const express = require('express');
const plaid = require('../plaid');

const router = express.Router();

/**
 * POST /link-token
 * Can be used later by a frontend that sends POST requests.
 * Full URL: https://project-1-vjcg.onrender.com/link-token
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const userId = req.body.userId || 'test-user';

    const request = {
      user: { client_user_id: userId },
      client_name: 'EndEasy',
      products: ['transactions'],
      language: 'en',
      country_codes: ['US', 'CA'],
    };

    const response = await plaid.linkTokenCreate(request);
    res.json(response.data);
  })
);

/**
 * GET /link-token/create
 * This is the simple route you can hit from the browser or Softr.
 * Full URL: https://project-1-vjcg.onrender.com/link-token/create
 */
router.get(
  '/create',
  asyncWrapper(async (req, res) => {
    try {
      const request = {
        user: { client_user_id: 'test-user' },
        client_name: 'EndEasy',
        products: ['transactions'],
        language: 'en',
        country_codes: ['US', 'CA'],
      };

      const response = await plaid.linkTokenCreate(request);
      res.json(response.data);
    } catch (err) {
      console.error('Error creating link token (GET /link-token/create)', err);
      res.status(500).json({
        error: err.message || 'link token error',
      });
    }
  })
);

module.exports = router;

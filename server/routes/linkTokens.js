/**
 * Routes for Plaid Link token creation
 */

const { asyncWrapper } = require('../middleware');
const express = require('express');
const plaid = require('../plaid');

const router = express.Router();

/**
 * POST /link-token
 * Full URL: https://project-1-vjcg.onrender.com/link-token
 * (You can use this later from a frontend that sends POST requests.)
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const userId = req.body?.userId || 'test-user';

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
 * This is the one you call from Softr or the browser.
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
      // Log full Plaid error to Render logs
      console.error(
        'Error creating link token (GET /link-token/create)',
        err.response?.data || err
      );

      // Send useful error back to browser so you can see what’s wrong
      res.status(500).json({
        error: err.response?.data || err.message || 'link token error',
      });
    }
  })
);

module.exports = router;

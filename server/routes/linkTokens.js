/**
 * Defines the route for Plaid Link token creation.
 */

const { asyncWrapper } = require('../middleware');
const express = require('express');
const plaid = require('../plaid');

const {
  PLAID_SANDBOX_REDIRECT_URI,
  PLAID_PRODUCTION_REDIRECT_URI,
  PLAID_ENV,
  PLAID_WEBHOOK_URL,
} = process.env;

// Choose redirect URL based on environment (optional)
const redirect_uri =
  PLAID_ENV === 'sandbox'
    ? PLAID_SANDBOX_REDIRECT_URI
    : PLAID_PRODUCTION_REDIRECT_URI;

const router = express.Router();

/**
 * Helper to build link token params for a user
 */
function buildLinkTokenParams(userId) {
  const params = {
    user: {
      // Any fixed id is fine for now
      client_user_id: userId || 'test-user',
    },
    client_name: 'EndEasy',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
  };

  if (PLAID_WEBHOOK_URL) {
    params.webhook = PLAID_WEBHOOK_URL;
  }

  if (redirect_uri && redirect_uri.indexOf('http') === 0) {
    params.redirect_uri = redirect_uri;
  }

  return params;
}

/**
 * POST /link-token   (optional, if you ever want POST)
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const { userId } = req.body || {};
      const linkTokenParams = buildLinkTokenParams(userId);

      const createResponse = await plaid.linkTokenCreate(linkTokenParams);

      return res.json(createResponse.data);
    } catch (err) {
      console.error('Plaid link token error (POST /link-token):', err);

      if (err.response && err.response.data) {
        return res.status(500).json(err.response.data);
      }

      return res.status(500).json({ error: err.message || 'link token error' });
    }
  })
);

/**
 * GET /link-token/create  (this is the one you’re calling from the browser)
 */
router.get(
  '/create',
  asyncWrapper(async (req, res) => {
    try {
      const linkTokenParams = buildLinkTokenParams('test-user');

      const createResponse = await plaid.linkTokenCreate(linkTokenParams);

      return res.json(createResponse.data);
    } catch (err) {
      console.error('Plaid link token error (GET /link-token/create):', err);

      if (err.response && err.response.data) {
        return res.status(500).json(err.response.data);
      }

      return res.status(500).json({ error: err.message || 'link token error' });
    }
  })
);

module.exports = router;

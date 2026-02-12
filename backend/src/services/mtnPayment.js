const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const SANDBOX_URL = 'https://sandbox.momodeveloper.mtn.com';

class MTNPaymentService {
  constructor() {
    this.subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
    this.baseUrl = process.env.MTN_BASE_URL || `${SANDBOX_URL}/collection/v1_0`;
    this.environment = process.env.MTN_ENVIRONMENT || 'sandbox';
    this.currency = process.env.MTN_CURRENCY || 'EUR';
    this.callbackUrl = process.env.MTN_CALLBACK_URL || '';
    this.apiUser = null;
    this.apiKey = null;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Step 1: Create API User (sandbox only)
   */
  async createApiUser() {
    const referenceId = uuidv4();
    try {
      await axios.post(
        `${SANDBOX_URL}/v1_0/apiuser`,
        { providerCallbackHost: 'localhost' },
        {
          headers: {
            'X-Reference-Id': referenceId,
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Content-Type': 'application/json'
          }
        }
      );
      this.apiUser = referenceId;
      console.log('✅ MTN API User created:', referenceId);
      return referenceId;
    } catch (error) {
      console.error('❌ Create API User failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Step 2: Create API Key for the user
   */
  async createApiKey() {
    if (!this.apiUser) await this.createApiUser();
    try {
      const response = await axios.post(
        `${SANDBOX_URL}/v1_0/apiuser/${this.apiUser}/apikey`,
        {},
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.subscriptionKey
          }
        }
      );
      this.apiKey = response.data.apiKey;
      console.log('✅ MTN API Key created');
      return this.apiKey;
    } catch (error) {
      console.error('❌ Create API Key failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Step 3: Get OAuth token
   */
  async getToken() {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    if (!this.apiUser || !this.apiKey) {
      await this.createApiKey();
    }

    try {
      const credentials = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
      const response = await axios.post(
        `${SANDBOX_URL}/collection/token/`,
        {},
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.subscriptionKey
          }
        }
      );
      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
      console.log('✅ MTN OAuth token obtained');
      return this.token;
    } catch (error) {
      console.error('❌ Get token failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Step 4: Request to Pay
   */
  async requestToPay(phoneNumber, amount, externalId) {
    const token = await this.getToken();
    const referenceId = uuidv4();

    try {
      await axios.post(
        `${SANDBOX_URL}/collection/v1_0/requesttopay`,
        {
          amount: amount.toString(),
          currency: this.currency,
          externalId: externalId || referenceId,
          payer: {
            partyIdType: 'MSISDN',
            partyId: phoneNumber
          },
          payerMessage: 'Payment for AgriConnect order',
          payeeNote: 'AgriConnect Marketplace'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'X-Callback-Url': this.callbackUrl || 'https://webhook.site/placeholder',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Payment request sent. Reference:', referenceId);
      return { success: true, referenceId };
    } catch (error) {
      console.error('❌ Request to pay failed:', error.response?.status, error.response?.data || error.message);
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Payment request failed',
        details: error.response?.data
      };
    }
  }

  /**
   * Step 5: Check payment status
   */
  async checkPaymentStatus(referenceId) {
    const token = await this.getToken();

    try {
      const response = await axios.get(
        `${SANDBOX_URL}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.subscriptionKey
          }
        }
      );

      console.log('📋 Payment status:', response.data.status, 'for', referenceId);
      return {
        status: response.data.status, // SUCCESSFUL, FAILED, PENDING, REJECTED, TIMEOUT
        amount: response.data.amount,
        currency: response.data.currency,
        payer: response.data.payer,
        reason: response.data.reason
      };
    } catch (error) {
      console.error('❌ Status check failed:', error.response?.data || error.message);
      throw {
        status: error.response?.status || 500,
        message: 'Failed to check payment status'
      };
    }
  }
}

// Singleton
module.exports = new MTNPaymentService();

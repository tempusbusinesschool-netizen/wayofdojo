// Subscription service for handling Stripe payments
const API = process.env.REACT_APP_BACKEND_URL + '/api';

export const subscriptionService = {
  // Get all subscription plans
  async getPlans() {
    const response = await fetch(`${API}/subscription-plans`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },

  // Start a trial (no card required)
  async startTrial(planId, token) {
    const response = await fetch(`${API}/subscriptions/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        plan_id: planId,
        origin_url: window.location.origin
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to start trial');
    }
    
    return response.json();
  },

  // Checkout with card (Stripe)
  async checkoutWithCard(planId, token) {
    const response = await fetch(`${API}/subscriptions/checkout-with-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        plan_id: planId,
        origin_url: window.location.origin
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create checkout session');
    }
    
    return response.json();
  },

  // Request a quote for large clubs
  async requestQuote(data) {
    const response = await fetch(`${API}/subscriptions/request-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to request quote');
    }
    
    return response.json();
  },

  // Check payment status
  async checkPaymentStatus(sessionId, token) {
    const response = await fetch(`${API}/subscriptions/check-status/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to check payment status');
    }
    
    return response.json();
  },

  // Get user's current subscription
  async getCurrentSubscription(token) {
    const response = await fetch(`${API}/subscriptions/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get subscription');
    }
    
    return response.json();
  },

  // Cancel subscription
  async cancelSubscription(token) {
    const response = await fetch(`${API}/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel subscription');
    }
    
    return response.json();
  }
};

export default subscriptionService;

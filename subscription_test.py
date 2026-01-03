#!/usr/bin/env python3
"""
Backend API Tests for Aikido Subscription and Onboarding System
Testing the new subscription endpoints and dojo registration
"""

import requests
import json
import sys
from datetime import datetime
import time

# Backend URL from frontend .env
BACKEND_URL = "https://aikido-progress-3.preview.emergentagent.com/api"

class SubscriptionTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.test_user_email = f"test_subscription_{int(time.time())}@example.com"
        self.test_user_password = "testpass123"
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_get_subscription_plans(self):
        """Test GET /api/subscription-plans - Should return 2 plans (ninja and dojo)"""
        try:
            response = self.session.get(f"{BACKEND_URL}/subscription-plans")
            
            if response.status_code == 200:
                plans = response.json()
                
                # Check if both plans exist
                ninja_plan = plans.get("ninja")
                dojo_plan = plans.get("dojo")
                
                if ninja_plan and dojo_plan:
                    # Verify ninja plan details
                    ninja_valid = (
                        ninja_plan.get("price") == 4.50 and
                        ninja_plan.get("trial_days") == 90 and
                        ninja_plan.get("commitment_months") == 0
                    )
                    
                    # Verify dojo plan details
                    dojo_valid = (
                        dojo_plan.get("price") == 65.00 and
                        dojo_plan.get("trial_days") == 10 and
                        dojo_plan.get("commitment_months") == 12
                    )
                    
                    if ninja_valid and dojo_valid:
                        self.log_result("GET /api/subscription-plans", True, 
                                      "Successfully retrieved both subscription plans with correct details",
                                      {"ninja_plan": ninja_plan, "dojo_plan": dojo_plan})
                        return plans
                    else:
                        self.log_result("GET /api/subscription-plans", False, 
                                      "Plans found but details are incorrect",
                                      {"ninja_plan": ninja_plan, "dojo_plan": dojo_plan})
                        return plans
                else:
                    self.log_result("GET /api/subscription-plans", False, 
                                  "Missing ninja or dojo plan",
                                  {"plans": plans})
                    return plans
            else:
                self.log_result("GET /api/subscription-plans", False, 
                              f"Failed to get subscription plans: {response.status_code}",
                              {"response": response.text})
                return {}
        except Exception as e:
            self.log_result("GET /api/subscription-plans", False, f"Error getting subscription plans: {str(e)}")
            return {}
    
    def test_register_dojo(self):
        """Test POST /api/auth/register-dojo - Register a new dojo with admin"""
        try:
            dojo_data = {
                "dojo_name": "Aikido Test Dojo",
                "dojo_city": "Lyon",
                "dojo_address": "123 rue Test",
                "dojo_phone": "04 12 34 56 78",
                "dojo_description": "Test dojo description",
                "first_name": "Jean",
                "last_name": "Sensei",
                "email": f"sensei_{int(time.time())}@testdojo.com",
                "password": "testpass123"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register-dojo", json=dojo_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    dojo_id = data.get("dojo_id")
                    trial_days = data.get("trial_days")
                    
                    if dojo_id and trial_days == 10:
                        self.log_result("POST /api/auth/register-dojo", True, 
                                      f"Successfully registered dojo with 10-day trial",
                                      {"dojo_id": dojo_id, "trial_days": trial_days, "response": data})
                        return {"dojo_id": dojo_id, "admin_email": dojo_data["email"], "admin_password": dojo_data["password"]}
                    else:
                        self.log_result("POST /api/auth/register-dojo", False, 
                                      "Dojo registered but missing dojo_id or incorrect trial_days",
                                      {"response": data})
                        return None
                else:
                    self.log_result("POST /api/auth/register-dojo", False, 
                                  f"Dojo registration failed: {data.get('message', 'Unknown error')}",
                                  {"response": data})
                    return None
            else:
                self.log_result("POST /api/auth/register-dojo", False, 
                              f"Failed to register dojo: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("POST /api/auth/register-dojo", False, f"Error registering dojo: {str(e)}")
            return None
    
    def register_test_user(self):
        """Register a test user for authentication tests"""
        try:
            user_data = {
                "first_name": "Test",
                "last_name": "User",
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=user_data)
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("token")
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                self.log_result("User Registration", True, "Successfully registered test user")
                return True
            else:
                self.log_result("User Registration", False, f"Failed to register user: {response.status_code}", 
                              {"response": response.text})
                return False
        except Exception as e:
            self.log_result("User Registration", False, f"User registration error: {str(e)}")
            return False
    
    def test_subscription_checkout(self):
        """Test POST /api/subscriptions/checkout - Create checkout for ninja plan"""
        if not self.auth_token:
            self.log_result("POST /api/subscriptions/checkout", False, "No authentication token available")
            return None
            
        try:
            checkout_data = {
                "plan_id": "ninja",
                "origin_url": "https://aikido-progress-3.preview.emergentagent.com"
            }
            
            response = self.session.post(f"{BACKEND_URL}/subscriptions/checkout", json=checkout_data)
            
            if response.status_code == 200:
                data = response.json()
                trial_started = data.get("trial_started")
                subscription = data.get("subscription")
                
                if trial_started and subscription:
                    subscription_id = subscription.get("id")
                    plan_name = subscription.get("plan")
                    status = subscription.get("status")
                    
                    if subscription_id and plan_name == "Ninja individuel" and status == "trialing":
                        self.log_result("POST /api/subscriptions/checkout", True, 
                                      "Successfully started 3-month trial for ninja plan",
                                      {"subscription": subscription, "message": data.get("message")})
                        return subscription
                    else:
                        self.log_result("POST /api/subscriptions/checkout", False, 
                                      "Trial started but subscription details are incorrect",
                                      {"subscription": subscription})
                        return subscription
                else:
                    self.log_result("POST /api/subscriptions/checkout", False, 
                                  "Checkout response missing trial_started or subscription",
                                  {"response": data})
                    return None
            else:
                self.log_result("POST /api/subscriptions/checkout", False, 
                              f"Failed to create checkout: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("POST /api/subscriptions/checkout", False, f"Error creating checkout: {str(e)}")
            return None
    
    def test_get_user_subscription(self):
        """Test GET /api/auth/subscription - Get user's subscription status"""
        if not self.auth_token:
            self.log_result("GET /api/auth/subscription", False, "No authentication token available")
            return None
            
        try:
            response = self.session.get(f"{BACKEND_URL}/auth/subscription")
            
            if response.status_code == 200:
                data = response.json()
                has_subscription = data.get("has_subscription")
                subscription = data.get("subscription")
                
                if has_subscription and subscription:
                    status = subscription.get("status")
                    plan_name = subscription.get("plan_name")
                    
                    if status == "trialing" and plan_name == "Ninja individuel":
                        self.log_result("GET /api/auth/subscription", True, 
                                      "Successfully retrieved user subscription status",
                                      {"has_subscription": has_subscription, "subscription": subscription})
                        return subscription
                    else:
                        self.log_result("GET /api/auth/subscription", False, 
                                      "Subscription found but status or plan incorrect",
                                      {"subscription": subscription})
                        return subscription
                elif not has_subscription:
                    self.log_result("GET /api/auth/subscription", True, 
                                  "No subscription found (expected for new user)",
                                  {"has_subscription": has_subscription})
                    return None
                else:
                    self.log_result("GET /api/auth/subscription", False, 
                                  "has_subscription is true but subscription is missing",
                                  {"response": data})
                    return None
            else:
                self.log_result("GET /api/auth/subscription", False, 
                              f"Failed to get subscription: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("GET /api/auth/subscription", False, f"Error getting subscription: {str(e)}")
            return None
    
    def test_login_dojo_admin(self, admin_email, admin_password):
        """Test login with dojo admin credentials"""
        try:
            login_data = {
                "email": admin_email,
                "password": admin_password
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                token = data.get("token")
                user = data.get("user")
                
                if token and user:
                    self.log_result("Dojo Admin Login", True, 
                                  f"Successfully logged in dojo admin: {user.get('email')}",
                                  {"user": user})
                    return token
                else:
                    self.log_result("Dojo Admin Login", False, 
                                  "Login response missing token or user",
                                  {"response": data})
                    return None
            else:
                self.log_result("Dojo Admin Login", False, 
                              f"Failed to login dojo admin: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("Dojo Admin Login", False, f"Error logging in dojo admin: {str(e)}")
            return None
    
    def run_all_tests(self):
        """Run all subscription system tests"""
        print("🧪 Starting Subscription & Onboarding Backend API Tests")
        print("=" * 60)
        
        # Test 1: Get subscription plans
        plans = self.test_get_subscription_plans()
        
        # Test 2: Register dojo
        dojo_info = self.test_register_dojo()
        
        # Test 3: Register test user for subscription tests
        if self.register_test_user():
            # Test 4: Get subscription status (should be none initially)
            initial_subscription = self.test_get_user_subscription()
            
            # Test 5: Create subscription checkout
            subscription = self.test_subscription_checkout()
            
            # Test 6: Get subscription status again (should show trial)
            final_subscription = self.test_get_user_subscription()
        
        # Test 7: Login with dojo admin (if dojo was created)
        if dojo_info:
            admin_token = self.test_login_dojo_admin(dojo_info["admin_email"], dojo_info["admin_password"])
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 Test Summary")
        print("=" * 60)
        
        passed = sum(1 for r in self.test_results if r["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Show failed tests
        failed_tests = [r for r in self.test_results if not r["success"]]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
        
        return passed == total

if __name__ == "__main__":
    tester = SubscriptionTester()
    success = tester.run_all_tests()
    
    # Save results to file
    with open("/app/subscription_test_results.json", "w") as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/subscription_test_results.json")
    
    sys.exit(0 if success else 1)
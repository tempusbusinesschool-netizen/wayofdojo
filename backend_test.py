#!/usr/bin/env python3
"""
Backend API Tests for Aikido Gamification System
Testing the gamification endpoints and integration
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://aikido-path-1.preview.emergentagent.com/api"

# Test credentials
ADMIN_PASSWORD = "aikido2024"
SUPER_ADMIN_PASSWORD = "superaikido2024"

# Test user credentials for gamification testing
TEST_USER_EMAIL = "test@aikido.fr"
TEST_USER_PASSWORD = "test123"

class GamificationTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
        self.test_results = []
        
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
    
    def register_or_login_test_user(self):
        """Register or login the test user"""
        try:
            # First try to login
            response = self.session.post(f"{BACKEND_URL}/auth/login", json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            })
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("token")
                self.user_id = data.get("user", {}).get("id")
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                self.log_result("User Login", True, f"Successfully logged in test user: {TEST_USER_EMAIL}")
                return True
            
            # If login fails, try to register
            elif response.status_code == 401:
                register_response = self.session.post(f"{BACKEND_URL}/auth/register", json={
                    "first_name": "Test",
                    "last_name": "Aikido",
                    "email": TEST_USER_EMAIL,
                    "password": TEST_USER_PASSWORD
                })
                
                if register_response.status_code == 200:
                    data = register_response.json()
                    self.auth_token = data.get("token")
                    self.user_id = data.get("user", {}).get("id")
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_result("User Registration", True, f"Successfully registered test user: {TEST_USER_EMAIL}")
                    return True
                else:
                    self.log_result("User Registration", False, f"Failed to register: {register_response.status_code}", 
                                  {"response": register_response.text})
                    return False
            else:
                self.log_result("User Authentication", False, f"Failed to authenticate: {response.status_code}", 
                              {"response": response.text})
                return False
        except Exception as e:
            self.log_result("User Authentication", False, f"Authentication error: {str(e)}")
            return False
    
    def test_get_daily_challenges(self):
        """Test GET /api/gamification/daily-challenges - Should return list of 5 daily challenges"""
        try:
            response = self.session.get(f"{BACKEND_URL}/gamification/daily-challenges")
            
            if response.status_code == 200:
                challenges = response.json()
                
                if isinstance(challenges, list) and len(challenges) >= 5:
                    self.log_result("GET /api/gamification/daily-challenges", True, 
                                  f"Successfully retrieved {len(challenges)} daily challenges",
                                  {"challenges_count": len(challenges), "challenges": challenges[:3]})  # Show first 3
                    return challenges
                else:
                    self.log_result("GET /api/gamification/daily-challenges", False, 
                                  f"Expected at least 5 challenges, got {len(challenges) if isinstance(challenges, list) else 'non-list'}",
                                  {"response": challenges})
                    return challenges if isinstance(challenges, list) else []
            else:
                self.log_result("GET /api/gamification/daily-challenges", False, 
                              f"Failed to get daily challenges: {response.status_code}",
                              {"response": response.text})
                return []
        except Exception as e:
            self.log_result("GET /api/gamification/daily-challenges", False, f"Error getting daily challenges: {str(e)}")
            return []
    
    def test_get_user_stats(self):
        """Test GET /api/gamification/stats/{user_id} - Should return user stats"""
        if not self.user_id:
            self.log_result("GET /api/gamification/stats/{user_id}", False, "No user ID available")
            return None
            
        try:
            response = self.session.get(f"{BACKEND_URL}/gamification/stats/{self.user_id}")
            
            if response.status_code == 200:
                stats = response.json()
                
                # Check required fields
                required_fields = ["user_id", "total_xp", "level", "completed_challenges", "badges"]
                missing_fields = [field for field in required_fields if field not in stats]
                
                if not missing_fields:
                    self.log_result("GET /api/gamification/stats/{user_id}", True, 
                                  f"Successfully retrieved user stats. XP: {stats.get('total_xp', 0)}, Level: {stats.get('level', 1)}",
                                  {"stats": stats})
                    return stats
                else:
                    self.log_result("GET /api/gamification/stats/{user_id}", False, 
                                  f"Missing required fields: {missing_fields}",
                                  {"stats": stats, "missing_fields": missing_fields})
                    return stats
            else:
                self.log_result("GET /api/gamification/stats/{user_id}", False, 
                              f"Failed to get user stats: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("GET /api/gamification/stats/{user_id}", False, f"Error getting user stats: {str(e)}")
            return None
    
    def test_complete_challenge(self, challenge_id="attention", challenge_name="Test Challenge"):
        """Test POST /api/gamification/challenge/complete - Should complete a challenge and award XP"""
        if not self.user_id:
            self.log_result("POST /api/gamification/challenge/complete", False, "No user ID available")
            return None
            
        try:
            # Get current stats before completing challenge
            current_stats = self.test_get_user_stats()
            current_xp = current_stats.get("total_xp", 0) if current_stats else 0
            
            challenge_data = {
                "challenge_id": challenge_id,
                "challenge_type": "daily",
                "challenge_name": challenge_name,
                "xp_reward": 15,
                "needs_parent_validation": False
            }
            
            response = self.session.post(f"{BACKEND_URL}/gamification/challenge/complete", json=challenge_data)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    # Verify XP was awarded
                    new_stats = self.test_get_user_stats()
                    new_xp = new_stats.get("total_xp", 0) if new_stats else 0
                    xp_gained = new_xp - current_xp
                    
                    self.log_result("POST /api/gamification/challenge/complete", True, 
                                  f"Successfully completed challenge '{challenge_name}'. XP gained: {xp_gained}",
                                  {"challenge_id": challenge_id, "xp_gained": xp_gained, "result": result})
                    return result
                else:
                    self.log_result("POST /api/gamification/challenge/complete", False, 
                                  f"Challenge completion failed: {result.get('message', 'Unknown error')}",
                                  {"result": result})
                    return result
            else:
                self.log_result("POST /api/gamification/challenge/complete", False, 
                              f"Failed to complete challenge: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("POST /api/gamification/challenge/complete", False, f"Error completing challenge: {str(e)}")
            return None
    
    def test_mark_attendance(self):
        """Test POST /api/gamification/attendance - Should mark attendance and award XP"""
        if not self.user_id:
            self.log_result("POST /api/gamification/attendance", False, "No user ID available")
            return None
            
        try:
            # Get current stats before marking attendance
            current_stats = self.test_get_user_stats()
            current_xp = current_stats.get("total_xp", 0) if current_stats else 0
            current_attendance = current_stats.get("attendance_count", 0) if current_stats else 0
            
            attendance_data = {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "attended": True,
                "session_type": "regular_training",
                "notes": "Test attendance for gamification system"
            }
            
            response = self.session.post(f"{BACKEND_URL}/gamification/attendance", json=attendance_data)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    # Verify XP and attendance count were updated
                    new_stats = self.test_get_user_stats()
                    new_xp = new_stats.get("total_xp", 0) if new_stats else 0
                    new_attendance = new_stats.get("attendance_count", 0) if new_stats else 0
                    
                    xp_gained = new_xp - current_xp
                    attendance_gained = new_attendance - current_attendance
                    
                    self.log_result("POST /api/gamification/attendance", True, 
                                  f"Successfully marked attendance. XP gained: {xp_gained}, Attendance count: +{attendance_gained}",
                                  {"xp_gained": xp_gained, "attendance_gained": attendance_gained, "result": result})
                    return result
                else:
                    self.log_result("POST /api/gamification/attendance", False, 
                                  f"Attendance marking failed: {result.get('message', 'Unknown error')}",
                                  {"result": result})
                    return result
            else:
                self.log_result("POST /api/gamification/attendance", False, 
                              f"Failed to mark attendance: {response.status_code}",
                              {"response": response.text})
                return None
        except Exception as e:
            self.log_result("POST /api/gamification/attendance", False, f"Error marking attendance: {str(e)}")
            return None
    
    def test_multiple_challenges(self):
        """Test completing multiple different challenges"""
        challenges_to_test = [
            {"id": "tai_sabaki", "name": "Tai Sabaki Practice"},
            {"id": "respect_salut", "name": "Perfect Bow"},
            {"id": "attention_regarder", "name": "Attentive Observation"}
        ]
        
        completed_challenges = []
        
        for challenge in challenges_to_test:
            result = self.test_complete_challenge(challenge["id"], challenge["name"])
            if result and result.get("success"):
                completed_challenges.append(challenge["id"])
        
        if len(completed_challenges) >= 2:
            self.log_result("Multiple Challenge Completion", True, 
                          f"Successfully completed {len(completed_challenges)} different challenges",
                          {"completed_challenges": completed_challenges})
        else:
            self.log_result("Multiple Challenge Completion", False, 
                          f"Only completed {len(completed_challenges)} challenges, expected at least 2",
                          {"completed_challenges": completed_challenges})
        
        return completed_challenges
    
    def run_gamification_tests(self):
        """Run all gamification system tests"""
        print("🎮 Starting Gamification System Backend API Tests")
        print("=" * 60)
        
        # Step 1: Authenticate test user
        if not self.register_or_login_test_user():
            print("❌ Cannot proceed without authentication")
            return False
        
        print(f"🔑 Authenticated as user ID: {self.user_id}")
        print("-" * 60)
        
        # Step 2: Test daily challenges endpoint
        challenges = self.test_get_daily_challenges()
        
        # Step 3: Test user stats endpoint (initial state)
        initial_stats = self.test_get_user_stats()
        if initial_stats:
            print(f"📊 Initial Stats - XP: {initial_stats.get('total_xp', 0)}, Level: {initial_stats.get('level', 1)}")
        
        # Step 4: Test challenge completion
        self.test_complete_challenge("attention", "Attention Challenge Test")
        
        # Step 5: Test attendance marking
        self.test_mark_attendance()
        
        # Step 6: Test multiple challenge completions
        self.test_multiple_challenges()
        
        # Step 7: Get final stats to verify progression
        final_stats = self.test_get_user_stats()
        if final_stats and initial_stats:
            xp_gained = final_stats.get("total_xp", 0) - initial_stats.get("total_xp", 0)
            print(f"📈 Final Stats - XP: {final_stats.get('total_xp', 0)} (+{xp_gained}), Level: {final_stats.get('level', 1)}")
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 Gamification Test Summary")
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
        else:
            print("\n🎉 All gamification tests passed!")
        
        return passed == total
        return passed == total

if __name__ == "__main__":
    tester = GamificationTester()
    success = tester.run_gamification_tests()
    
    # Save results to file
    with open("/app/gamification_test_results.json", "w") as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/gamification_test_results.json")
    
    sys.exit(0 if success else 1)
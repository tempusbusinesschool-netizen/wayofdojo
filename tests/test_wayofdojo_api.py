"""
WayofDojo API Tests
Tests for login, admin stats, admin users, and stages functionality
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dojoapp.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "testninja2@ninja.com"
TEST_PASSWORD = "Password123!"


class TestAuthAPI:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True, "Login response should have success=True"
        assert "token" in data, "Login response should contain token"
        assert "user" in data, "Login response should contain user"
        assert data["user"]["email"] == TEST_EMAIL, "User email should match"
        
        # Store token for other tests
        pytest.auth_token = data["token"]
        pytest.user_data = data["user"]
        print(f"Login successful for user: {data['user']['firstName']} {data['user']['lastName']}")
        print(f"User role: {data['user'].get('role', 'user')}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "invalid@test.com", "password": "wrongpassword"},
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 401 or error response
        assert response.status_code in [401, 400, 200], f"Unexpected status: {response.status_code}"
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == False or "error" in data, "Should indicate login failure"
    
    def test_get_current_user(self):
        """Test getting current user info"""
        # First login to get token
        login_response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        token = login_response.json().get("token")
        
        if not token:
            pytest.skip("No token available")
        
        response = requests.get(
            f"{BASE_URL}/next-api/auth/me",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        
        assert response.status_code == 200, f"Get current user failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True, "Response should have success=True"
        assert "user" in data, "Response should contain user"
        print(f"Current user: {data['user'].get('firstName')} - Role: {data['user'].get('role')}")


class TestAdminStatsAPI:
    """Admin statistics endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get token before each test"""
        login_response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        data = login_response.json()
        self.token = data.get("token")
        self.user_role = data.get("user", {}).get("role")
    
    def test_admin_stats_access(self):
        """Test admin stats endpoint access"""
        if not self.token:
            pytest.skip("No token available")
        
        response = requests.get(
            f"{BASE_URL}/next-api/admin/stats",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        # Should be accessible for admin/super_admin
        if self.user_role in ['admin', 'super_admin']:
            assert response.status_code == 200, f"Admin stats should be accessible: {response.text}"
            data = response.json()
            
            assert data.get("success") == True, "Response should have success=True"
            assert "stats" in data, "Response should contain stats"
            
            stats = data["stats"]
            print(f"Total users: {stats.get('totalUsers')}")
            print(f"New users this week: {stats.get('newUsersThisWeek')}")
            print(f"Active users: {stats.get('activeUsers')}")
        else:
            assert response.status_code in [401, 403], "Non-admin should be denied access"
    
    def test_admin_stats_content(self):
        """Test admin stats response content"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        response = requests.get(
            f"{BASE_URL}/next-api/admin/stats",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        stats = data.get("stats", {})
        
        # Check required fields
        required_fields = ["totalUsers", "newUsersThisWeek", "activeUsers", "usersByRole", "usersByProfile"]
        for field in required_fields:
            assert field in stats, f"Stats should contain {field}"
        
        # Validate data types
        assert isinstance(stats["totalUsers"], int), "totalUsers should be integer"
        assert isinstance(stats["newUsersThisWeek"], int), "newUsersThisWeek should be integer"
        assert isinstance(stats["activeUsers"], int), "activeUsers should be integer"
        assert isinstance(stats["usersByRole"], dict), "usersByRole should be dict"


class TestAdminUsersAPI:
    """Admin users management endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get token before each test"""
        login_response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        data = login_response.json()
        self.token = data.get("token")
        self.user_role = data.get("user", {}).get("role")
    
    def test_get_users_list(self):
        """Test getting users list"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        response = requests.get(
            f"{BASE_URL}/next-api/admin/users",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        assert response.status_code == 200, f"Get users failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True, "Response should have success=True"
        assert "users" in data, "Response should contain users"
        assert isinstance(data["users"], list), "Users should be a list"
        
        if len(data["users"]) > 0:
            user = data["users"][0]
            required_fields = ["id", "email", "firstName", "lastName", "role"]
            for field in required_fields:
                assert field in user, f"User should have {field}"
        
        print(f"Found {len(data['users'])} users")
    
    def test_search_users(self):
        """Test searching users"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        response = requests.get(
            f"{BASE_URL}/next-api/admin/users?search=test",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        assert response.status_code == 200, f"Search users failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "users" in data
        print(f"Search 'test' returned {len(data['users'])} users")
    
    def test_unauthorized_access(self):
        """Test that unauthenticated requests are denied"""
        response = requests.get(
            f"{BASE_URL}/next-api/admin/users",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code in [401, 403], "Unauthenticated request should be denied"


class TestStagesData:
    """Tests for stages data (MOCKED - data is static in frontend)"""
    
    def test_stages_page_loads(self):
        """Test that stages page is accessible"""
        response = requests.get(f"{BASE_URL}/fr/aikido/stages")
        assert response.status_code == 200, "Stages page should load"
        print("Stages page loads successfully")
    
    def test_stages_mock_data_note(self):
        """Note: Stages data is MOCKED in frontend"""
        print("NOTE: Stages data is MOCKED with static MOCK_STAGES array in stages/page.tsx")
        print("No backend API for stages - data is hardcoded in frontend component")
        assert True  # This is just a documentation test


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

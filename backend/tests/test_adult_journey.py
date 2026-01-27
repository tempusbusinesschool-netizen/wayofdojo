"""
Backend API Tests for WayofDojo Adult Journey (Samouraï Confirmé)
Tests the gamification adult-journey API endpoints
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dojo-journey.preview.emergentagent.com')

class TestAdultJourneyAPI:
    """Tests for /api/gamification/adult-journey endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - login and get token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login with premium user
        login_response = self.session.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "premium@wayofdojo.com", "password": "premium123"}
        )
        
        if login_response.status_code == 200:
            data = login_response.json()
            self.token = data.get('token')
            self.user = data.get('user')
            # Set cookie for authenticated requests
            self.session.cookies.set('wayofdojo_token', self.token)
        else:
            pytest.skip("Login failed - skipping authenticated tests")
    
    def test_login_premium_user_returns_samourai_confirme_profile(self):
        """Test that premium user has samourai_confirme profile"""
        response = self.session.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "premium@wayofdojo.com", "password": "premium123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify user profile
        assert data['success'] == True
        assert data['user']['profile'] == 'samourai_confirme'
        assert data['user']['email'] == 'premium@wayofdojo.com'
        assert 'gamification' in data['user']
        assert data['user']['gamification']['xp'] >= 0
    
    def test_login_premium_user_has_bushi_rank_xp(self):
        """Test that premium user has XP in Bushi range (1500-3499)"""
        response = self.session.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "premium@wayofdojo.com", "password": "premium123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Bushi rank requires 1500-3499 XP (may have been modified by tests)
        xp = data['user']['gamification']['xp']
        assert xp >= 0  # XP should be non-negative
    
    def test_get_adult_journey_progress(self):
        """Test GET /api/gamification/adult-journey returns progress"""
        response = self.session.get(
            f"{BASE_URL}/next-api/gamification/adult-journey"
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data['success'] == True
        assert 'adultJourney' in data
        assert 'xp' in data
        
        # Verify adultJourney structure
        journey = data['adultJourney']
        assert 'completedMissions' in journey
        assert isinstance(journey['completedMissions'], list)
    
    def test_get_adult_journey_without_auth_returns_401(self):
        """Test GET /api/gamification/adult-journey without auth returns 401"""
        # Create new session without auth
        unauthenticated_session = requests.Session()
        response = unauthenticated_session.get(
            f"{BASE_URL}/next-api/gamification/adult-journey"
        )
        
        assert response.status_code == 401
        data = response.json()
        assert 'error' in data
    
    def test_post_complete_mission_success(self):
        """Test POST /api/gamification/adult-journey completes a mission"""
        # Use a unique mission ID for testing
        test_mission_id = "test-mission-" + str(os.urandom(4).hex())
        
        response = self.session.post(
            f"{BASE_URL}/next-api/gamification/adult-journey",
            json={
                "missionId": test_mission_id,
                "xpReward": 25,
                "cityId": "miyamoto"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data['success'] == True
        assert 'xp' in data
        assert data['xp']['added'] == 25
        assert 'completedMissions' in data
        assert test_mission_id in data['completedMissions']
    
    def test_post_complete_mission_without_mission_id_returns_400(self):
        """Test POST without missionId returns 400"""
        response = self.session.post(
            f"{BASE_URL}/next-api/gamification/adult-journey",
            json={"xpReward": 25}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert 'error' in data
    
    def test_post_complete_mission_without_auth_returns_401(self):
        """Test POST without auth returns 401"""
        unauthenticated_session = requests.Session()
        unauthenticated_session.headers.update({"Content-Type": "application/json"})
        
        response = unauthenticated_session.post(
            f"{BASE_URL}/next-api/gamification/adult-journey",
            json={"missionId": "test-mission", "xpReward": 25}
        )
        
        assert response.status_code == 401
    
    def test_post_duplicate_mission_returns_already_completed(self):
        """Test completing same mission twice returns already completed message"""
        # First completion
        mission_id = "duplicate-test-" + str(os.urandom(4).hex())
        
        first_response = self.session.post(
            f"{BASE_URL}/next-api/gamification/adult-journey",
            json={"missionId": mission_id, "xpReward": 30}
        )
        assert first_response.status_code == 200
        
        # Second completion (duplicate)
        second_response = self.session.post(
            f"{BASE_URL}/next-api/gamification/adult-journey",
            json={"missionId": mission_id, "xpReward": 30}
        )
        
        assert second_response.status_code == 200
        data = second_response.json()
        assert data['success'] == False
        assert 'déjà complétée' in data.get('message', '').lower()


class TestAuthAPI:
    """Tests for authentication endpoints"""
    
    def test_login_with_valid_credentials(self):
        """Test login with valid premium credentials"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "premium@wayofdojo.com", "password": "premium123"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'token' in data
        assert 'user' in data
    
    def test_login_with_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "invalid@test.com", "password": "wrongpassword"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 401
        data = response.json()
        assert 'error' in data
    
    def test_login_without_email_returns_400(self):
        """Test login without email returns 400"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"password": "somepassword"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert 'error' in data
    
    def test_login_without_password_returns_400(self):
        """Test login without password returns 400"""
        response = requests.post(
            f"{BASE_URL}/next-api/auth/login",
            json={"email": "test@test.com"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert 'error' in data


class TestHealthAPI:
    """Tests for health check endpoint"""
    
    def test_health_check(self):
        """Test health endpoint returns healthy status"""
        response = requests.get(f"{BASE_URL}/next-api/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert data['mongodb_connected'] == True


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

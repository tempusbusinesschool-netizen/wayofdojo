"""
WayofDojo API Tests - Iteration 11
Tests for:
- Stages API (GET, POST, seed)
- Progression page
- Badges page
- Framer Motion animations
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dojoapp.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "testninja2@ninja.com"
TEST_PASSWORD = "Password123!"


class TestStagesAPI:
    """Stages API endpoint tests - GET /api/stages"""
    
    def test_get_stages_list(self):
        """Test GET /api/stages - public endpoint"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Get stages failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True, "Response should have success=True"
        assert "stages" in data, "Response should contain stages"
        assert isinstance(data["stages"], list), "Stages should be a list"
        
        # Verify stages were seeded (should have 6 stages)
        assert len(data["stages"]) >= 6, f"Expected at least 6 stages, got {len(data['stages'])}"
        
        print(f"Found {len(data['stages'])} stages")
        
        # Verify stage structure
        if len(data["stages"]) > 0:
            stage = data["stages"][0]
            required_fields = ["id", "title", "description", "date", "location", "city", "sensei", "level", "price"]
            for field in required_fields:
                assert field in stage, f"Stage should have {field}"
            print(f"First stage: {stage['title']} - {stage['city']}")
    
    def test_get_stages_with_level_filter(self):
        """Test GET /api/stages with level filter"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido&level=debutant",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Get stages with filter failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "stages" in data
        
        # All stages should be debutant or tous
        for stage in data["stages"]:
            assert stage["level"] in ["debutant", "tous"], f"Stage level should be debutant or tous, got {stage['level']}"
        
        print(f"Found {len(data['stages'])} stages for debutant level")
    
    def test_get_stages_featured(self):
        """Test GET /api/stages with featured filter"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido&featured=true",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Get featured stages failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "stages" in data
        
        # All stages should be featured
        for stage in data["stages"]:
            assert stage.get("isFeatured") == True, "Stage should be featured"
        
        print(f"Found {len(data['stages'])} featured stages")
    
    def test_get_stages_pagination(self):
        """Test GET /api/stages pagination"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido&page=1&limit=2",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Get stages pagination failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "pagination" in data, "Response should contain pagination"
        
        pagination = data["pagination"]
        assert "page" in pagination
        assert "limit" in pagination
        assert "total" in pagination
        assert "pages" in pagination
        
        print(f"Pagination: page {pagination['page']}/{pagination['pages']}, total {pagination['total']}")


class TestStagesAPIById:
    """Stages API endpoint tests - GET /api/stages/[id]"""
    
    def test_get_stage_by_id(self):
        """Test GET /api/stages/[id] - get single stage"""
        # First get list to get an ID
        list_response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido",
            headers={"Content-Type": "application/json"}
        )
        
        assert list_response.status_code == 200
        stages = list_response.json().get("stages", [])
        
        if len(stages) == 0:
            pytest.skip("No stages available")
        
        stage_id = stages[0]["id"]
        
        # Get single stage
        response = requests.get(
            f"{BASE_URL}/next-api/stages/{stage_id}",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Get stage by ID failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "stage" in data
        assert data["stage"]["id"] == stage_id
        
        print(f"Got stage: {data['stage']['title']}")
    
    def test_get_stage_not_found(self):
        """Test GET /api/stages/[id] with invalid ID"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages/000000000000000000000000",
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 404 or error
        assert response.status_code in [404, 500], f"Expected 404 or 500, got {response.status_code}"


class TestStagesAdminAPI:
    """Stages Admin API tests - POST /api/stages (admin only)"""
    
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
    
    def test_create_stage_admin(self):
        """Test POST /api/stages - create stage (admin only)"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        new_stage = {
            "title": "TEST Stage - À supprimer",
            "description": "Stage de test créé par les tests automatisés",
            "date": "2025-12-01",
            "location": "Test Location",
            "city": "Test City",
            "sensei": "Test Sensei",
            "level": "tous",
            "maxParticipants": 10,
            "price": 0,
            "status": "draft",
            "sport": "aikido"
        }
        
        response = requests.post(
            f"{BASE_URL}/next-api/stages",
            json=new_stage,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        assert response.status_code == 201, f"Create stage failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert "stage" in data
        assert data["stage"]["title"] == new_stage["title"]
        
        print(f"Created stage: {data['stage']['id']}")
        
        # Clean up - delete the test stage
        if data["stage"].get("id"):
            delete_response = requests.delete(
                f"{BASE_URL}/next-api/stages/{data['stage']['id']}",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.token}"
                }
            )
            print(f"Cleanup: deleted test stage, status {delete_response.status_code}")
    
    def test_create_stage_unauthorized(self):
        """Test POST /api/stages without auth - should fail"""
        new_stage = {
            "title": "Unauthorized Stage",
            "description": "Should not be created",
            "date": "2025-12-01",
            "location": "Test",
            "city": "Test",
            "sensei": "Test"
        }
        
        response = requests.post(
            f"{BASE_URL}/next-api/stages",
            json=new_stage,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_create_stage_missing_fields(self):
        """Test POST /api/stages with missing required fields"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        incomplete_stage = {
            "title": "Incomplete Stage"
            # Missing required fields
        }
        
        response = requests.post(
            f"{BASE_URL}/next-api/stages",
            json=incomplete_stage,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        assert response.status_code == 400, f"Expected 400 for missing fields, got {response.status_code}"


class TestStagesSeedAPI:
    """Stages Seed API tests - POST /api/stages/seed (admin only)"""
    
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
    
    def test_seed_stages_already_exists(self):
        """Test POST /api/stages/seed when stages already exist"""
        if not self.token or self.user_role not in ['admin', 'super_admin']:
            pytest.skip("Admin access required")
        
        response = requests.post(
            f"{BASE_URL}/next-api/stages/seed",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        )
        
        # Should return success=false since stages already exist
        assert response.status_code == 200, f"Seed stages failed: {response.text}"
        data = response.json()
        
        # Either success=false (stages exist) or success=true (seeded)
        if data.get("success") == False:
            assert "existingCount" in data or "message" in data
            print(f"Stages already exist: {data.get('message', data.get('existingCount'))}")
        else:
            print(f"Seeded {data.get('count', 0)} stages")
    
    def test_seed_stages_unauthorized(self):
        """Test POST /api/stages/seed without auth - should fail"""
        response = requests.post(
            f"{BASE_URL}/next-api/stages/seed",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"


class TestProgressionPage:
    """Tests for Progression page accessibility"""
    
    def test_progression_page_loads(self):
        """Test that progression page is accessible"""
        response = requests.get(f"{BASE_URL}/fr/aikido/progression")
        assert response.status_code == 200, f"Progression page should load, got {response.status_code}"
        print("Progression page loads successfully")
    
    def test_progression_page_content(self):
        """Test progression page contains expected content"""
        response = requests.get(f"{BASE_URL}/fr/aikido/progression")
        assert response.status_code == 200
        
        # Check for key content in HTML
        content = response.text.lower()
        # Page should contain progression-related content
        assert "progression" in content or "parcours" in content, "Page should contain progression content"
        print("Progression page content verified")


class TestBadgesPage:
    """Tests for Badges page accessibility"""
    
    def test_badges_page_loads(self):
        """Test that badges page is accessible"""
        response = requests.get(f"{BASE_URL}/fr/aikido/badges")
        assert response.status_code == 200, f"Badges page should load, got {response.status_code}"
        print("Badges page loads successfully")
    
    def test_badges_page_content(self):
        """Test badges page contains expected content"""
        response = requests.get(f"{BASE_URL}/fr/aikido/badges")
        assert response.status_code == 200
        
        # Check for key content in HTML
        content = response.text.lower()
        # Page should contain badges-related content
        assert "badge" in content or "collection" in content, "Page should contain badges content"
        print("Badges page content verified")


class TestStagesPageIntegration:
    """Tests for Stages page loading from API"""
    
    def test_stages_page_loads(self):
        """Test that stages page is accessible"""
        response = requests.get(f"{BASE_URL}/fr/aikido/stages")
        assert response.status_code == 200, f"Stages page should load, got {response.status_code}"
        print("Stages page loads successfully")
    
    def test_stages_api_data_matches_seed(self):
        """Verify API returns seeded data"""
        response = requests.get(
            f"{BASE_URL}/next-api/stages?sport=aikido",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        stages = data.get("stages", [])
        
        # Check for known seeded stages
        stage_titles = [s["title"] for s in stages]
        
        expected_titles = [
            "Stage National Printemps",
            "Stage Armes - Jo et Bokken",
            "Stage Débutants - Premiers Pas",
            "Stage International d'Été",
            "Stage Technique Avancée",
            "Stage Jeunes Ninjas"
        ]
        
        found_count = sum(1 for title in expected_titles if title in stage_titles)
        assert found_count >= 5, f"Expected at least 5 seeded stages, found {found_count}"
        
        print(f"Found {found_count}/6 expected seeded stages")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

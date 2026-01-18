"""
🎓 PASSAGES DE GRADES API TESTS
Tests for the FFAAA grade program API endpoints
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestGradesProgrammeAPI:
    """Tests for /api/grades/programme endpoints"""
    
    def test_get_all_grades_returns_6_kyu_grades(self):
        """GET /api/grades/programme should return list of 6 Kyu grades"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) == 6, f"Expected 6 grades, got {len(data)}"
        
        # Verify all expected grades are present
        grade_ids = [g['id'] for g in data]
        expected_ids = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu']
        for expected_id in expected_ids:
            assert expected_id in grade_ids, f"Missing grade: {expected_id}"
    
    def test_grades_have_required_fields(self):
        """Each grade should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ['id', 'nom', 'nom_japonais', 'couleur_ceinture', 
                          'delai_minimum', 'heures_minimum', 'nb_techniques', 
                          'nb_mouvements', 'categories']
        
        for grade in data:
            for field in required_fields:
                assert field in grade, f"Grade {grade.get('id', 'unknown')} missing field: {field}"
    
    def test_grades_ordered_correctly(self):
        """Grades should be ordered from 6e_kyu to 1er_kyu"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        assert response.status_code == 200
        
        data = response.json()
        expected_order = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu']
        actual_order = [g['id'] for g in data]
        
        assert actual_order == expected_order, f"Expected order {expected_order}, got {actual_order}"


class TestGradeDetailAPI:
    """Tests for /api/grades/programme/{grade_id} endpoint"""
    
    def test_get_6e_kyu_detail(self):
        """GET /api/grades/programme/6e_kyu should return detailed info"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/6e_kyu")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert data['id'] == '6e_kyu'
        assert data['nom'] == '6e Kyu'
        assert data['nom_japonais'] == '六級'
        assert data['couleur_ceinture'] == '#FFFFFF'  # White belt
        
        # Verify techniques and mouvements are present
        assert 'techniques' in data
        assert 'mouvements' in data
        assert isinstance(data['techniques'], list)
        assert isinstance(data['mouvements'], list)
        assert data['nb_techniques'] == len(data['techniques'])
        assert data['nb_mouvements'] == len(data['mouvements'])
    
    def test_get_1er_kyu_detail(self):
        """GET /api/grades/programme/1er_kyu should return detailed info"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/1er_kyu")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data['id'] == '1er_kyu'
        assert data['nom'] == '1er Kyu'
        assert data['couleur_ceinture'] == '#795548'  # Brown belt
        
        # 1er Kyu should have more techniques
        assert data['nb_techniques'] >= 20
    
    def test_grade_detail_has_all_fields(self):
        """Grade detail should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/6e_kyu")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ['id', 'nom', 'nom_japonais', 'couleur_ceinture',
                          'delai_minimum', 'heures_minimum', 'jours_minimum',
                          'objectifs', 'mouvements', 'techniques', 
                          'criteres_evaluation', 'nb_techniques', 'nb_mouvements',
                          'techniques_par_categorie', 'techniques_par_attaque']
        
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
    
    def test_techniques_have_required_fields(self):
        """Each technique should have required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/6e_kyu")
        assert response.status_code == 200
        
        data = response.json()
        technique_fields = ['id', 'nom', 'attaque', 'categorie']
        
        for technique in data['techniques']:
            for field in technique_fields:
                assert field in technique, f"Technique {technique.get('id', 'unknown')} missing field: {field}"
    
    def test_mouvements_have_required_fields(self):
        """Each mouvement should have required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/6e_kyu")
        assert response.status_code == 200
        
        data = response.json()
        mouvement_fields = ['id', 'nom', 'categorie']
        
        for mouvement in data['mouvements']:
            for field in mouvement_fields:
                assert field in mouvement, f"Mouvement {mouvement.get('id', 'unknown')} missing field: {field}"
    
    def test_invalid_grade_returns_404(self):
        """GET /api/grades/programme/invalid_grade should return 404"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/invalid_grade")
        
        assert response.status_code == 404


class TestCategoriesAPI:
    """Tests for /api/grades/categories endpoint"""
    
    def test_get_categories(self):
        """GET /api/grades/categories should return technique categories"""
        response = requests.get(f"{BASE_URL}/api/grades/categories")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, dict), "Response should be a dictionary"
        
        # Verify expected categories are present
        expected_categories = ['tachi_waza', 'suwari_waza', 'hanmi_handachi', 
                              'ushiro_waza', 'tanto_dori', 'jo_dori', 
                              'tachi_dori', 'jiyu_waza']
        
        for cat in expected_categories:
            assert cat in data, f"Missing category: {cat}"
    
    def test_categories_have_required_fields(self):
        """Each category should have required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/categories")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ['nom', 'nom_japonais', 'description', 'icone']
        
        for cat_id, cat_data in data.items():
            for field in required_fields:
                assert field in cat_data, f"Category {cat_id} missing field: {field}"


class TestAttaquesAPI:
    """Tests for /api/grades/attaques endpoint"""
    
    def test_get_attaques(self):
        """GET /api/grades/attaques should return attack types"""
        response = requests.get(f"{BASE_URL}/api/grades/attaques")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, dict), "Response should be a dictionary"
        
        # Verify some expected attacks are present
        expected_attacks = ['ai_hanmi_katate_dori', 'gyaku_hanmi_katate_dori', 
                           'shomen_uchi', 'yokomen_uchi']
        
        for attack in expected_attacks:
            assert attack in data, f"Missing attack: {attack}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

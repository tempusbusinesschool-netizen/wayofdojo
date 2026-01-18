"""
🎓 PASSAGES DE GRADES API TESTS
Tests for the FFAAA grade program API endpoints
Includes: 6 Kyu grades + 4 Dan grades (Shodan to Yondan)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestGradesProgrammeAPI:
    """Tests for /api/grades/programme endpoints - All grades"""
    
    def test_get_all_grades_returns_10_grades(self):
        """GET /api/grades/programme should return list of 10 grades (6 Kyu + 4 Dan)"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) == 10, f"Expected 10 grades (6 Kyu + 4 Dan), got {len(data)}"
        
        # Verify all expected grades are present
        grade_ids = [g['id'] for g in data]
        expected_ids = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu', 
                       'shodan', 'nidan', 'sandan', 'yondan']
        for expected_id in expected_ids:
            assert expected_id in grade_ids, f"Missing grade: {expected_id}"
    
    def test_grades_have_type_grade_field(self):
        """Each grade should have type_grade field (kyu or dan)"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        assert response.status_code == 200
        
        data = response.json()
        for grade in data:
            assert 'type_grade' in grade, f"Grade {grade.get('id', 'unknown')} missing type_grade field"
            assert grade['type_grade'] in ['kyu', 'dan'], f"Invalid type_grade: {grade['type_grade']}"
    
    def test_grades_have_required_fields(self):
        """Each grade should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ['id', 'nom', 'nom_japonais', 'couleur_ceinture', 
                          'delai_minimum', 'heures_minimum', 'nb_techniques', 
                          'nb_mouvements', 'categories', 'type_grade']
        
        for grade in data:
            for field in required_fields:
                assert field in grade, f"Grade {grade.get('id', 'unknown')} missing field: {field}"
    
    def test_grades_ordered_correctly(self):
        """Grades should be ordered from 6e_kyu to yondan"""
        response = requests.get(f"{BASE_URL}/api/grades/programme")
        assert response.status_code == 200
        
        data = response.json()
        expected_order = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu',
                         'shodan', 'nidan', 'sandan', 'yondan']
        actual_order = [g['id'] for g in data]
        
        assert actual_order == expected_order, f"Expected order {expected_order}, got {actual_order}"


class TestGradesTypeFilter:
    """Tests for /api/grades/programme?type= filter"""
    
    def test_filter_kyu_grades(self):
        """GET /api/grades/programme?type=kyu should return 6 Kyu grades"""
        response = requests.get(f"{BASE_URL}/api/grades/programme?type=kyu")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert len(data) == 6, f"Expected 6 Kyu grades, got {len(data)}"
        
        # Verify all are Kyu grades
        expected_kyu = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu']
        actual_ids = [g['id'] for g in data]
        assert actual_ids == expected_kyu, f"Expected {expected_kyu}, got {actual_ids}"
        
        # Verify type_grade is 'kyu' for all
        for grade in data:
            assert grade['type_grade'] == 'kyu', f"Grade {grade['id']} has wrong type_grade"
    
    def test_filter_dan_grades(self):
        """GET /api/grades/programme?type=dan should return 4 Dan grades"""
        response = requests.get(f"{BASE_URL}/api/grades/programme?type=dan")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert len(data) == 4, f"Expected 4 Dan grades, got {len(data)}"
        
        # Verify all are Dan grades
        expected_dan = ['shodan', 'nidan', 'sandan', 'yondan']
        actual_ids = [g['id'] for g in data]
        assert actual_ids == expected_dan, f"Expected {expected_dan}, got {actual_ids}"
        
        # Verify type_grade is 'dan' for all
        for grade in data:
            assert grade['type_grade'] == 'dan', f"Grade {grade['id']} has wrong type_grade"
    
    def test_dan_grades_have_black_belt(self):
        """All Dan grades should have black belt color"""
        response = requests.get(f"{BASE_URL}/api/grades/programme?type=dan")
        assert response.status_code == 200
        
        data = response.json()
        for grade in data:
            assert grade['couleur_ceinture'] == '#000000', f"Dan grade {grade['id']} should have black belt"


class TestDanGradeDetailAPI:
    """Tests for /api/grades/programme/{dan_grade_id} endpoints"""
    
    def test_get_shodan_detail(self):
        """GET /api/grades/programme/shodan should return Shodan details"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/shodan")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data['id'] == 'shodan'
        assert data['nom'] == 'Shodan'
        assert data['nom_japonais'] == '初段'
        assert data['couleur_ceinture'] == '#000000'  # Black belt
        assert data['heures_minimum'] == 300
        
        # Verify techniques and mouvements are present
        assert 'techniques' in data
        assert 'mouvements' in data
        assert isinstance(data['techniques'], list)
        assert isinstance(data['mouvements'], list)
        assert data['nb_techniques'] > 0
    
    def test_get_nidan_detail(self):
        """GET /api/grades/programme/nidan should return Nidan details"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/nidan")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data['id'] == 'nidan'
        assert data['nom'] == 'Nidan'
        assert data['nom_japonais'] == '弐段'
        assert data['heures_minimum'] == 500
    
    def test_get_sandan_detail(self):
        """GET /api/grades/programme/sandan should return Sandan details"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/sandan")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data['id'] == 'sandan'
        assert data['nom'] == 'Sandan'
        assert data['nom_japonais'] == '参段'
        assert data['heures_minimum'] == 700
    
    def test_get_yondan_detail(self):
        """GET /api/grades/programme/yondan should return Yondan details"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/yondan")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data['id'] == 'yondan'
        assert data['nom'] == 'Yondan'
        assert data['nom_japonais'] == '四段'
        assert data['heures_minimum'] == 1000
    
    def test_dan_grade_has_all_fields(self):
        """Dan grade detail should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/shodan")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ['id', 'nom', 'nom_japonais', 'couleur_ceinture',
                          'delai_minimum', 'heures_minimum', 'jours_minimum',
                          'objectifs', 'mouvements', 'techniques', 
                          'criteres_evaluation', 'nb_techniques', 'nb_mouvements',
                          'techniques_par_categorie', 'techniques_par_attaque']
        
        for field in required_fields:
            assert field in data, f"Missing field: {field}"


class TestKyuGradeDetailAPI:
    """Tests for /api/grades/programme/{kyu_grade_id} endpoints"""
    
    def test_get_6e_kyu_detail(self):
        """GET /api/grades/programme/6e_kyu should return detailed info"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/6e_kyu")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
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
    
    def test_invalid_grade_returns_404(self):
        """GET /api/grades/programme/invalid_grade should return 404"""
        response = requests.get(f"{BASE_URL}/api/grades/programme/invalid_grade")
        
        assert response.status_code == 404


class TestCategoriesAPI:
    """Tests for /api/grades/categories endpoint"""
    
    def test_get_categories(self):
        """GET /api/grades/categories should return technique categories"""
        response = requests.get(f"{BASE_URL}/api/grades/categories")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, dict), "Response should be a dictionary"
        
        # Verify expected categories are present
        expected_categories = ['tachi_waza', 'suwari_waza', 'hanmi_handachi', 
                              'ushiro_waza', 'tanto_dori', 'jo_dori', 
                              'tachi_dori', 'jiyu_waza']
        
        for cat in expected_categories:
            assert cat in data, f"Missing category: {cat}"


class TestAttaquesAPI:
    """Tests for /api/grades/attaques endpoint"""
    
    def test_get_attaques(self):
        """GET /api/grades/attaques should return attack types"""
        response = requests.get(f"{BASE_URL}/api/grades/attaques")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, dict), "Response should be a dictionary"
        
        # Verify some expected attacks are present
        expected_attacks = ['ai_hanmi_katate_dori', 'gyaku_hanmi_katate_dori', 
                           'shomen_uchi', 'yokomen_uchi']
        
        for attack in expected_attacks:
            assert attack in data, f"Missing attack: {attack}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

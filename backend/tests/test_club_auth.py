"""Tests for Club registration and login endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://gamified-build-1.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def unique_email():
    return f"uitest_{uuid.uuid4().hex[:8]}@wayofdojo.com"


@pytest.fixture(scope="module")
def unique_dojo_name():
    return f"Dojo UI Test {uuid.uuid4().hex[:6]}"


class TestClubAuth:
    def test_club_register_success(self, unique_email, unique_dojo_name):
        payload = {
            "dojo": {"name": unique_dojo_name, "city": "Paris"},
            "admin": {"firstName": "Test", "lastName": "User", "email": unique_email, "password": "test123"}
        }
        r = requests.post(f"{BASE_URL}/api/club/register", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert data["dojo"]["name"] == unique_dojo_name
        assert data["dojo"]["city"] == "Paris"

    def test_club_register_duplicate_email(self, unique_email, unique_dojo_name):
        payload = {
            "dojo": {"name": unique_dojo_name + "_2", "city": "Lyon"},
            "admin": {"firstName": "Test", "lastName": "User", "email": unique_email, "password": "test123"}
        }
        r = requests.post(f"{BASE_URL}/api/club/register", json=payload, timeout=30)
        assert r.status_code == 400

    def test_club_login_success(self, unique_email):
        r = requests.post(f"{BASE_URL}/api/club/login", json={"email": unique_email, "password": "test123"}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "token" in data and len(data["token"]) > 20
        assert data["admin"]["email"] == unique_email

    def test_club_login_wrong_password(self, unique_email):
        r = requests.post(f"{BASE_URL}/api/club/login", json={"email": unique_email, "password": "wrongpw"}, timeout=30)
        assert r.status_code == 401

    def test_club_login_unknown_email(self):
        r = requests.post(f"{BASE_URL}/api/club/login", json={"email": "nobody_xyz@nope.com", "password": "test123"}, timeout=30)
        assert r.status_code == 401

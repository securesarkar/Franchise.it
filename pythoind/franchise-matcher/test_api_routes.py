from __future__ import annotations

import unittest

from fastapi.testclient import TestClient

from app import app


class TestApiRoutes(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)
        cls.client.__enter__()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.client.__exit__(None, None, None)

    def test_health(self) -> None:
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})

    def test_match_by_known_email(self) -> None:
        response = self.client.post('/match', json={'email': 'shruti.mehta3484@gmail.com'})
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertIn('franchisee_name', body)
        self.assertIn('top_matches', body)
        self.assertGreater(len(body['top_matches']), 0)

    def test_match_by_profile(self) -> None:
        payload = {
            'first_name': 'Demo',
            'last_name': 'User',
            'email': 'demo@user.com',
            'asset_type': 'Retail Space',
            'liquid_asset_inr': 3500000,
            'preferred_industry': 'HORECA',
            'traits': ['Strategic Planner', 'Execution Specialist', 'Confident Leader'],
        }
        response = self.client.post('/match/profile', json=payload)
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body['franchisee_name'], 'Demo User')
        self.assertIn('top_matches', body)
        self.assertGreater(len(body['top_matches']), 0)


if __name__ == '__main__':
    unittest.main()

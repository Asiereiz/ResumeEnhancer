from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    # Attempt to hit the root or health endpoint
    # Since there isn't an explicit root endpoint defined in main.py, 
    # we'll expect a 404 for "/" but this confirms the app is running.
    # Alternatively, we can check a known working endpoint like docs
    response = client.get("/docs")
    assert response.status_code == 200

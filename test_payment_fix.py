import requests
import json
import time

url = "http://127.0.0.1:8000/api/v1/investments/payments/callback/"
# Create a valid payment reference first... this script assumes one doesn't exist or uses a dummy one that might fail 404
# But the goal is to pass validation of payload types.
# Even if reference is invalid, if we pass type checks, we should get "Invalid payment reference" (400) NOT "must be an integer" (400 validation error)

payload = {
    "payment_reference_id": "payment-uuid-123",
    "success": True,
    "gateway_payload": {
        "shares_requested": "10",  # String instead of int - this is what we fixed
        "project_id": "71b7d9e6-f29a-46e0-9899-f0dd317403a7",
        "investor_id": "8d4594d3-7a6c-430d-bfbe-d521316deba2",
        "txn_id": "tve123",
        "amount": "1000", # String instead of int/float
        "transaction_id": "gw-txn-00123",
        "currency": "USD",
        "status": "captured",
        "timestamp": "2026-01-27T10:00:00Z"
    }
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

import requests
try:
    resp = requests.get("http://localhost:8000/admin/")
    print(resp.status_code, resp.text[:100])
except Exception as e:
    print(e)

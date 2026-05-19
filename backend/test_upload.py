import requests

try:
    print("Testing upload...")
    files = {'uploaded_file': ('test.txt', b'Hello world', 'text/plain')}
    data = {'title': 'test.txt', 'file_type': 'txt'}
    resp = requests.post("http://127.0.0.1:8000/api/documents/upload/", files=files, data=data)
    print(resp.status_code, resp.text)
except Exception as e:
    print(f"Error: {e}")

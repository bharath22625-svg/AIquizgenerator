import requests

try:
    print("Testing generate quiz...")
    data = {'document_id': 3, 'difficulty': 'medium', 'number_of_questions': 2}
    resp = requests.post("http://127.0.0.1:8000/api/quizzes/generate/", json=data)
    print(resp.status_code, resp.text)
except Exception as e:
    print(f"Error: {e}")

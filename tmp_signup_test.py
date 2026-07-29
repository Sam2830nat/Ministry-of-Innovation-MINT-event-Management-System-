import json
import urllib.request
import urllib.error

url = 'http://localhost:4000/api/auth/signup'
body = {
    'fullName': 'Test User',
    'email': 'testuser+copilot@example.com',
    'password': 'Test1234!',
    'phone': '+251912345678',
    'roleName': 'Guest',
    'departmentId': ''
}

req = urllib.request.Request(
    url,
    data=json.dumps(body).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        print('STATUS', resp.status)
        print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    print(e.read().decode('utf-8'))
except Exception as exc:
    print('ERROR', exc)


# Various curl commands

- To get user info

```bash
curl -X GET http://localhost:8000/auth/user-info/ -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDE4MDMxLCJpYXQiOjE3NTEwMTIxNjUsImp0aSI6IjEyNGRhNDM2MDJmZTRiZWE4OWQ0M2Q2MGMyYWIxZWVlIiwidXNlcl9pZCI6MTd9.gltJ2kFJ7C1vDrarghS4FJfgY642JAGiEOnubuHyn78"
```

- To logout
```bash
curl -X POST http://localhost:8000/auth/logout/
```

- To login
```bash
curl -X POST http://localhost:8000/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"email": "nohbus.veollurma@gmail.com", "password": "rire"}'
```

- To obtain access and refresh tokens
```bash
curl -X POST http://localhost:8000/auth/token/ \
     -H "Content-Type: application/json" \
     -d '{"username":"nohbus","email": "nohbus.veollurma@gmail.com", "password": "rire"}'
```

- When access token expires

```bash
curl -X POST http://localhost:8000/auth/token/refresh/ -H "Content-Type: application/json" -d '{"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MTA5ODU2NSwiaWF0IjoxNzUxMDEyMTY1LCJqdGkiOiIwODMzNDIwMjM0ZjY0YmU4OWZkMDI0NDU3ZjBiMDRiNSIsInVzZXJfaWQiOjE3fQ.8VBRUoVxylKeL0_3AH_sCwnymwY5oHAM4DDN3WVdN54"}'
```

latest login response

```json
{"access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5ODE3ODE3LCJpYXQiOjE3NDk4MTYwMTcsImp0aSI6IjFkMTVmMDFkYWUzZjQ1MzI5NDVmM2YyZjNjNTIzZDQ2IiwidXNlcl9pZCI6NX0.z_Pkvi4UHA6dUd72WTy0KWIqZqq28Or0C5xbc-XgmMo","refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwMjQxNywiaWF0IjoxNzQ5ODE2MDE3LCJqdGkiOiJhNWEzN2RkNmNlZDE0ZjI2OWU2ZWRkOTE3M2EyMDliYSIsInVzZXJfaWQiOjV9.HfP-UdKuzXIaukAwHiUkmYFW7QMFHxGqBoo4-oGJLx8","user":{"id":5,"username":"nohbus","email":"nohbus.veollurma@gmail.com","first_name":"Nohbus","last_name":"Veollurma","is_staff":true,"is_superuser":false,"customer":{"id":4,"phone":"+998123456789","addresses":[{"id":4,"street":"Yunusabad","city":"Tashkent","state":"Tashkent","zip_code":"123-4567","country":"Uzbekistan","is_default":true}]}}}%
```

access token after refresh

```json
{"access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NzMwNjQ5LCJpYXQiOjE3NDk3MTE1MTgsImp0aSI6IjgzNTJjNTE2MGQ0ODRlMWU4YjIzMGI5NWI1MTU3YjE0IiwidXNlcl9pZCI6NX0.Em56DQgZTbbE_jfX0FOViHxTRZQAnLVXVXx-AchtU_c","access_expiration":"2025-06-12T12:17:29.474612Z"}
```

Toke not valid response example

```bash
curl -X POST http://localhost:8000/auth/token/refresh/ -H "Content-Type: application/json" -d '{"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MTA5ODU2NSwiaWF0IjoxNzUxMDEyMTY1LCJqdGkiOiIwODMzNDIwMjM0ZjY0YmU4OWZkMDI0NDU3ZjBiMDRiNSIsInVz"}'
{"detail":"Token is invalid or expired","code":"token_not_valid"}
```
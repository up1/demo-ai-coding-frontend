# Login page
* client routing = /login

## User Interface of login page
```
------------ Login page ------------------------
username : <text field with id/name/data_test_id=my_username> 
password : <text field with id/name/data_test_id=my_password> 

"Try login" button
```

## Validation rules
* username 
  * required
  * length 3-10 chareacters
  * A-Z and a-z only
* password 
  * required


## Flow
1. User fillin username and password
2. Press "Try login" button
3. Client side validation
   3.1 If fail then show error message !!
   3.2 If pass then Go to step 4
4. Call Login API from HTTPs protocol with Fetch API

## Specification of Login API
* POST https://dummyjson.com/auth/login
* Request headers
  * Content-Type:application/json
* Request body
```
{
    "username": "emilys",
    "password": "emilyspass"
}
```

### Success response with 200
```
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT accessToken (for backward compatibility) in response and cookies
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken in response and cookies
}
```



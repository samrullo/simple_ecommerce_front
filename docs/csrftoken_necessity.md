# When do I need csrftoken?

Whether you need to include the **CSRF token (csrftoken)** in your login request depends on your backend authentication setup.

### When **CSRF token** is **NOT required**:
1. **Token-Based Authentication (e.g., JWT, TokenAuth, OAuth)**
   - If your backend uses **token-based authentication** (e.g., Django REST Framework's TokenAuth or JWT authentication), then **CSRF protection is not required**.
   - The reason is that CSRF protection is primarily needed for **session-based authentication**, where the browser automatically includes cookies in requests.
   - In your case, you're logging in and storing the authentication key (`response.data.key`), which suggests **token-based authentication**. 
   - **If this is true, then you can safely remove the CSRF token from the headers.**

2. **If your backend does not use cookies for authentication**
   - If the authentication method relies only on **headers** (such as `Authorization: Token your_token_here` in subsequent requests), then CSRF is unnecessary.

---

### When **CSRF token** **IS required**:
1. **Session-Based Authentication (e.g., Django's built-in authentication)**
   - If your backend is using **Django session authentication**, then **CSRF protection is required** because Django's default session authentication relies on cookies.
   - In this case, **you must include the CSRF token** in requests that modify data (e.g., login, sign up, etc.).
   - Since you are retrieving the CSRF token with `getCookie("csrftoken")`, this suggests that **your backend might be using session authentication**.

---

### How to Decide?
- If your backend returns an **auth token (e.g., JWT, API key)** upon login and expects you to include it in `Authorization` headers for future requests, **you don't need a CSRF token**.
- If your backend uses **session authentication** and relies on cookies, **you must include the CSRF token**.

### What to do?
- **Check your backend authentication method.**
  - If it’s **TokenAuth or JWT**, remove `X-CSRFToken`.
  - If it’s **session-based authentication**, keep `X-CSRFToken`.

Let me know if you need help checking your backend configuration! 🚀
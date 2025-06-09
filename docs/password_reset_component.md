Awesome choice! A password visibility toggle improves UX significantly.

Here’s your updated `ResetPasswordConfirm.js` with:

✅ Eye icon toggle
✅ Visibility toggle for both password fields
✅ Font Awesome used for icons (can switch to any icon library)

---

### ✅ Updated `ResetPasswordConfirm.js` with Show/Hide Password Toggle

```js
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import { PASSWORD_RESET_CONFIRM } from "../ApiUtils/ApiEndpoints";
import { createResourceWithoutAuth } from "../ApiUtils/create_data";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const { setFlashMessages } = useContext(AppContext);
  const navigate = useNavigate();

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = newPassword1 === newPassword2;

  const handleReset = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!passwordsMatch) {
      setErrors({ new_password2: ["Passwords do not match."] });
      return;
    }

    setLoading(true);
    try {
      const data = {
        uid: uid,
        token: token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      };

      await createResourceWithoutAuth(PASSWORD_RESET_CONFIRM, data, "reset_password_confirm");

      setFlashMessages([
        {
          category: "success",
          message: "Password successfully reset! Please log in with your new password.",
        },
      ]);

      navigate("/login");
    } catch (error) {
      console.log("Reset password confirm error:", error);
      setErrors(error?.response?.data || { detail: "Unknown error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <div>
          <label>New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword1 ? "text" : "password"}
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword1((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <i className={`fa ${showPassword1 ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>
        </div>

        <div>
          <label>Confirm New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword2 ? "text" : "password"}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword2((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <i className={`fa ${showPassword2 ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>
        </div>

        {newPassword2.length > 0 && (
          <p
            className={passwordsMatch ? "text-success" : "text-danger"}
            style={{ marginTop: "0.5rem" }}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

        {errors &&
          Object.entries(errors).map(([key, val]) => (
            <p key={key} className="text-danger">
              {Array.isArray(val) ? val.join(", ") : val}
            </p>
          ))}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !passwordsMatch}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
```

---

### ✅ Requirements

To make the eye icons work, include **Font Awesome** in your HTML or app:

#### Option 1: Add to `public/index.html`

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>
```

#### Option 2: Install Font Awesome

```bash
npm install @fortawesome/fontawesome-free
```

Then import in your root `.js` or `.css`:

```js
import "@fortawesome/fontawesome-free/css/all.min.css";
```

---

Let me know if you'd prefer to use **Material UI**, **Heroicons**, or another icon library instead!

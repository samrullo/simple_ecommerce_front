# How to create context and use it in react
Q:show me best practice to create context providers and use them in react components eventually


Got it 👍 Let me show you a **best-practice workflow** for creating and using React Context Providers. I’ll break this down step-by-step, so it’s clear how you should structure them for scalability and clean code.

---

## 1. **Define Your Context**

Each context usually lives in its own file. This keeps concerns separated (auth, theme, cart, etc.).

Example: **`AuthContext.js`**

```jsx
import React, { createContext, useState, useEffect } from "react";

// 1. Create context
export const AuthContext = createContext();

// 2. Provider component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example: simulate fetching user from API or localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 2. **Consume Context in Components**

Use `useContext` hook to access the data inside your components.

```jsx
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserProfile;
```

---

## 3. **Combine Multiple Providers**

If you have several contexts (`AuthContext`, `ThemeContext`, `CartContext`), it’s best to **wrap them in a single root provider** for readability.

**`RootProvider.js`**

```jsx
import React from "react";
import { AuthContextProvider } from "./AuthContext";
import { ThemeContextProvider } from "./ThemeContext";
import { CartContextProvider } from "./CartContext";

const RootProvider = ({ children }) => (
  <AuthContextProvider>
    <ThemeContextProvider>
      <CartContextProvider>
        {children}
      </CartContextProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
);

export default RootProvider;
```

---

## 4. **Wrap Your App**

Now your `App.js` stays clean:

```jsx
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import RootProvider from "./contexts/RootProvider";
import MainPage from "./components/MainPage";

function App() {
  useEffect(() => {
    document.title = process.env.REACT_APP_SITE_TITLE || "Default Title";
  }, []);

  return (
    <BrowserRouter>
      <RootProvider>
        <MainPage />
      </RootProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Best Practices

1. **One file per context** (`AuthContext.js`, `ThemeContext.js`)
   → Keeps code modular and easy to maintain.
2. **Keep providers small**
   → Each provider should only manage one responsibility.
3. **Use a `RootProvider` wrapper**
   → Prevents `App.js` from becoming unreadable with too many nested providers.
4. **Memoize context values if needed** (`useMemo`)
   → Prevents unnecessary re-renders.

---

👉 Do you want me to show you how to **migrate your current `AppContextProvider` into this structure** (with `RootProvider`), so you’re ready for multiple contexts in the future?

# Relationship between context and context provider
Q: I am confused by the fact that AuthContext and AuthContextProvider are separate constants. Does react expect prefix of Provider to match exactly what we created with createContext()?


Great question 👍 — this trips up a lot of people when they’re first learning React Context.

The short answer is: **React does not care about the names** — you can call them whatever you like. The `Provider` you use in JSX comes from the `.Provider` property that React automatically attaches to whatever you created with `createContext()`.

---

### Step 1: What `createContext()` actually returns

When you do this:

```js
export const AuthContext = createContext();
```

`AuthContext` is an **object** with two important properties:

* `AuthContext.Provider`
* `AuthContext.Consumer`

That’s why later in your provider component you write:

```js
<AuthContext.Provider value={{ user, login, logout }}>
  {children}
</AuthContext.Provider>
```

---

### Step 2: Why we define `AuthContextProvider` separately

The `AuthContextProvider` is **just a React component** that wraps children in `AuthContext.Provider`.

```js
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

You could inline this everywhere, but it’s repetitive. That’s why people create a `AuthContextProvider` component — it’s just a naming convention, not something React enforces.

---

### Step 3: Do names have to match?

No ✅.

* `AuthContext` could be called `MyContext`.
* The provider component could be called `BananaProvider`.

As long as you’re doing:

```js
<MyContext.Provider value={...}>{children}</MyContext.Provider>
```

it will work fine.

But… naming `XContext` and `XContextProvider` is a **community convention**. It makes your code more predictable when someone else reads it.

---

✅ **Summary:**

* React doesn’t care about the `Provider` prefix or name matching.
* `createContext()` gives you an object with a `.Provider` property.
* We define `AuthContextProvider` separately just to avoid boilerplate and make code cleaner.

---

Would you like me to show you a **minimal example where we skip the `AuthContextProvider` wrapper** (just use `AuthContext.Provider` directly), so you can see the difference side by side?

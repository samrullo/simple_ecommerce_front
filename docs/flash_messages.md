# Flash messages
We introduce the section in Main component to display various flash messages issued by different parts of the application.


# Introducing keys to flash message rendering

To introduce a `key` attribute in your `map` function, you should ensure that each item has a unique identifier. If `flashMessages` is an array of objects that contain unique IDs, use those. If no such ID exists, and the array is stable, you can use the index as a fallback (though this is not ideal for dynamic lists).

Here’s how you can modify your code:

### 1. If Each Message Has a Unique ID
If each `flashMessage` object has an `id` field, use it as the `key`:
```jsx
flashMessages.map(({ id, category, message }) => (
  <div key={id} className={`alert alert-${category}`}>
    <p>{message}</p>
  </div>
))
```
This is the best practice as React relies on the `key` to efficiently update the DOM.

---

### 2. If No Unique ID is Available
If `flashMessages` doesn’t have unique identifiers, but is relatively static, you can use the index as a fallback:
```jsx
flashMessages.map(({ category, message }, index) => (
  <div key={index} className={`alert alert-${category}`}>
    <p>{message}</p>
  </div>
))
```
However, using the index is not ideal if the list can change (e.g., items being added or removed), as it can cause inefficient rendering.

If possible, update `flashMessages` to include a unique `id` for better performance and predictability.
# React Starter tempalte
This is a react starter template that can boost a typical react web app development.

This starter template will present an oversimplified web site that demonstrates

- How to fetch resources, render them and add new resource or edit resources. The app will demonstrate this using Products and Contacts. A resource in API development is a data item. You can think of ```resource``` as an object with attributes. For instance our Product resource will be an object with name and price attributes. Contact will be a resource with name and email attributes.

- How to use ```bootstrap``` to style your app
- How to use ```react-router-dom``` to simulate page navigation

# What to install
- npm install **react-router-dom**
- npm install **bootstrap**

# Starter app structure
Starter app will define 

- ```Navbar.js``` component that will serve as navigation bar. Navigation bar will have links like Products, Contacts, About Us links.
- ```MainPage``` will be an entry component and will contain ```Dashboard``` component at the start.
- ```AppRoutes.js``` component where we will define all application routes. "/" url will navigate to ```Dashboard``` component. "/products" to Products component, "/contacts" to ```Contacts``` and finally "/about" to ```AboutUs``` component
- We will define ```AppContext.js``` component to make app level variables accessible by any component.
- We will group ```Product``` component to render all products and its corresponding ```ProductNew``` and ```ProductEdit``` components under products folder. These 3 components will enable us to fetch and view a list of products, to create new products and to edit products.
- In a similar manner we will group ```Contact```, ```ContactNew``` and ```ContactEdit``` components under contacts folder.

# AppContext
Almost any application will need variables accessible across the whole application.
These can be things like whether the user is logged in, whether the app should render pages in dark or light mode.
To achieve this, you create two components ```AppContext``` and ```AppContextProvider```.
```AppContext``` is an object created with ```React.createContext()```.
Within ```AppContextProvider``` you define variables and functions that you want to make available throughout your whole application. ```AppContextProvider``` will wrap all other react components and passes context values to all of them.

```javascript
const AppContextProvider = ({props})=>{

    return <AppContext.Provider values={contextValues}>{children}</AppContext.Provider>
}
```

Then from within other components you can access app context values

```javascript
import AppContext from "path/to/AppContext"
import {useContext} from "react"

const SomeComponent = ()=>{
    const {myAppVariable, myAppFunction} = useContext(AppContext)
}
```

# Starter app Data model
To make it a bit interesting we will define ```Product``` model which will have columns like name, price.
Then we will define ```Contact``` model that will have columns like name, email.

# Routes
We can define routes as below

```javascript
<Router>    
    <Route path="/" element={<Outlet/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="/products" element={<Products/>}>
            <Route path="new" element={<ProductNew/>}>
            <Route path="edit/:productId" element={<ProductEdit/>}>
        </Route>
        <Route path="/contacts" element={<Contacts/>}>
            <Route path="new" element={<ContactNew/>}/>
            <Route path="edit/:contactId" element={<ContactEdit/>}/>
        </Route>
    </Route>
    <Route path="/about" element={<AboutUs/>}/>
</Router>
```

Usually we define all possible routes in ```AppRoutes.js``` and then include it in ```MainPage.js```.
Once you define routes, you can write ```Link```s to defined routes as below

```javascript
<Link to="/products">Products</Link>
```

In above you can see that we define all ```Route```s within ```Router```. 
You can also see that we can write ```Route```s within ```Route```s.
Routes within Routes are called nested Routes. I usually use them to define routes for viewing resources and then for adding new resource or editing existing resource.

One of the Routes element points to a special component called ```Outlet```.
```Outlet``` allows to render the component referenced by the link inside other components. This is useful when you want create a new resource or edit a resource while preserving the view of existing resources. It is like showing the form of adding new item or editing the item while the list of items are visible on the same page.

# Forms
Forms are essential to web application. Whenever we want to give the user ability to add new resources or edit them we have to present them with generic form and form fields such as ```inputs``` and ```selects```.

Below is the code for a ```FormField``` component. This component gives ability to define many types of ```input``` fields (text, number) based on ```fieldType``` as well as ```Select``` field with many options available for selection.

You can see this components takes field label, type, value and value setter as arguments and renders the appropriate form field based on these arguments.

```javascript
import Select from "react-select";

const FormField = ({
  fieldType,
  fieldLabel,
  fieldValue,
  setFieldValue,
  selectOptions,
}) => {
  
  
  const handleSelectOnChange = (selectedOption) => {
    setFieldValue(selectedOption);
  };
  if (fieldType === "select") {
    console.log(`we have received ${selectOptions.length} select options`)
    return (
      <div className="form-group">
        <label>{fieldLabel}</label>
        <Select
          name={fieldLabel}
          options={selectOptions}
          value={fieldValue}
          onChange={handleSelectOnChange}
          isSearchable
          className="form-control"
        />
      </div>
    );
  } else {
    return (
      <div className="form-group">
        <label>{fieldLabel}</label>
        <input
          type={fieldType}
          className="form-control"
          value={fieldValue}
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        />
      </div>
    );
  }
};

export default FormField;
```

I have also defined ```GenericForm``` component that takes a list of form fields and onSubmit function as argument and renders the form with submit button.

```javascript
import FormField from "./FormField";
const GenericForm = ({ formFields, onFormSubmit }) => {
  return (
    <form className="form" onSubmit={onFormSubmit}>
      {formFields.map(
        ({ fieldType, fieldLabel, fieldValue, setFieldValue,selectOptions }) => {
          return (
            <FormField
              key={fieldLabel}
              fieldType={fieldType}
              fieldLabel={fieldLabel}
              fieldValue={fieldValue}
              setFieldValue={setFieldValue}
              selectOptions={selectOptions}
            />
          );
        }
      )}
      <div className="form-group">
        <button className="btn btn-prime mt-3">Submit</button>
      </div>
    </form>
  );
};

export default GenericForm;
```
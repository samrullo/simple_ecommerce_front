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
        <button className="btn btn-primary mt-3">Submit</button>
      </div>
    </form>
  );
};

export default GenericForm;

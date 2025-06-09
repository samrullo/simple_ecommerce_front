import FormField from "./FormField";

const GenericForm = ({ formFields, onFormSubmit, submitButtonLabel = "Submit", disableSubmit = false }) => {
  return (
    <form className="form" onSubmit={onFormSubmit}>
      {formFields.map(({ fieldType, fieldLabel, fieldValue, setFieldValue, selectOptions, fieldProps }) => (
        <FormField
          key={fieldLabel}
          fieldType={fieldType}
          fieldLabel={fieldLabel}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          selectOptions={selectOptions}
          fieldProps={fieldProps}
        />
      ))}
      <div className="form-group">
        <button
          type="submit"
          className={`btn btn-primary mt-3 w-100 ${disableSubmit ? "opacity-50" : ""}`}
          disabled={disableSubmit}
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  );
};

export default GenericForm;

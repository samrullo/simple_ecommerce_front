import FormField from "./FormField";

const GenericForm = ({
  formFields,
  onFormSubmit,
  submitButtonLabel = "Submit",
  disableSubmit = false,
}) => {
  return (
    <form className="form" onSubmit={onFormSubmit}>
      {formFields.map((field, index) => (
        <FormField
          key={field.fieldName || index}
          fieldType={field.fieldType}
          fieldLabel={field.fieldLabel}
          fieldValue={field.fieldValue}
          setFieldValue={field.setFieldValue}
          selectOptions={field.selectOptions}
          fieldProps={field.fieldProps}
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
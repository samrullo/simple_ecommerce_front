import Select from "react-select";

const FormField = ({
  fieldType,
  fieldLabel,
  fieldValue,
  setFieldValue,
  selectOptions,
  fieldProps = {}, // 👈 default to empty object
}) => {
  const handleSelectOnChange = (selectedOption) => {
    setFieldValue(selectedOption);
  };

  if (fieldType === "select") {
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
          {...fieldProps} // 👈 spread props here
        />
      </div>
    );
  } else if (fieldType === "checkbox") {
    return (
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={fieldValue}
            onChange={(e) => setFieldValue(e.target.checked)}
            {...fieldProps} // 👈 apply here
          />{" "}
          {fieldLabel}
        </label>
      </div>
    );
  } else if (fieldType === "file") {
    return (
      <div className="form-group">
        <label>{fieldLabel}</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFieldValue(e.target.files[0])}
          {...fieldProps} // 👈 apply here
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
          onChange={(e) => setFieldValue(e.target.value)}
          {...fieldProps} // 👈 apply here
        />
      </div>
    );
  }
};

export default FormField;
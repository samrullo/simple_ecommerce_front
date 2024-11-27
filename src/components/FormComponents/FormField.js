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

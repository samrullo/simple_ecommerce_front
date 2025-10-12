import GenericForm from "../FormComponents/GenericForm";

const GenericEditData = ({
  title,
  formFields,
  handleEdit,
  handleDelete,
  submitButtonLabel,
  disableSubmit,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {handleDelete && (
        <button className="btn btn-danger mb-3" onClick={handleDelete}>
          Delete
        </button>
      )}
      <GenericForm
        formFields={formFields}
        onFormSubmit={handleEdit}
        submitButtonLabel={submitButtonLabel}
        disableSubmit={disableSubmit}
      />
    </div>
  );
};

export default GenericEditData;

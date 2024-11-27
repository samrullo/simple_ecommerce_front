import GenericForm from "../FormComponents/GenericForm";

const GenericEditData = ({ title, formFields, handleEdit, handleDelete }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
      <GenericForm formFields={formFields} onFormSubmit={handleEdit} />
    </div>
  );
};

export default GenericEditData;

import GenericForm from "../FormComponents/GenericForm";

const GenericNewData = ({ title, formFields, handleNewData }) => {
  return (
    <>
      <div>
        <h1>{title}</h1>
        <GenericForm formFields={formFields} onFormSubmit={handleNewData} />
      </div>
    </>
  );
};

export default GenericNewData;

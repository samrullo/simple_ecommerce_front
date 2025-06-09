import GenericForm from "../FormComponents/GenericForm";

const GenericNewData = ({ title, formFields, handleNewData, submitButtonLabel, disableSubmit }) => {
  return (
    <>
      <div>
        <h1>{title}</h1>
        <GenericForm
          formFields={formFields}
          onFormSubmit={handleNewData}
          submitButtonLabel={submitButtonLabel}
          disableSubmit={disableSubmit}
        />
      </div>
    </>
  );
};

export default GenericNewData;

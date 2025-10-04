import React from "react";

const ToggleSwitch = ({
  id,
  label,
  checked,
  onChange,
  className = "",
}) => {
  return (
    <div className={`form-check form-switch mb-2 ${className}`}>
      <input
        type="checkbox"
        className="form-check-input"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default ToggleSwitch;

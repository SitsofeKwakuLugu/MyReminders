import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import "./Form.css";

export default function Form({
  title = "",
  fields = [],
  initialValues = {},
  submitLabel = "Submit",
  onSubmit,
  onCancel
}) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("typing"); // typing | submitting | success
  const [error, setError] = useState(null);

  // Update field values
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Determine the index of the first required field that is empty
  const getActiveIndex = () => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.required && (!values[field.name] || values[field.name].trim() === "")) {
        return i;
      }
    }
    return fields.length; // all fields filled → everything unlocked
  };

  const activeIndex = getActiveIndex();

  // Determine if the submit button should be enabled
  const isSubmitEnabled = () => {
    const allRequiredFilled = fields.every(
      f => !f.required || (values[f.name] && values[f.name].trim() !== "")
    );

    // Password confirmation check
    const password = values.password;
    const confirm = values.confirm;
    const passwordsMatch = password && confirm ? password === confirm : true;

    return allRequiredFilled && passwordsMatch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSubmitEnabled() || status === "submitting") return;

    if (values.password && values.confirm && values.password !== values.confirm) {
      setError(new Error("Passwords do not match"));
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      await onSubmit(values);
      setStatus("success");
    } catch (err) {
      setError(err);
      setStatus("typing");
    }
  };

  if (status === "success") {
    return <h1>Form submitted successfully!</h1>;
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {title && <h2>{title}</h2>}

      {fields.map((field, index) => (
        <Input
          key={field.name}
          {...field}
          value={values[field.name] || ""}
          onChange={val => handleChange(field.name, val)}
          disabled={status === "submitting" || index > activeIndex}
        />
      ))}

      {error && <p className="form-error">{error.message}</p>}

      <div className="form-actions">
        <Button
          type="submit"
          disabled={!isSubmitEnabled() || status === "submitting"}
        >
          {submitLabel}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

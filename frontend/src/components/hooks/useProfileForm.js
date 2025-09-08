import { useState } from "react";

// Custom hook for managing form state and validation
// This hook is designed to be used in a profile form context, where it manages the values, errors, and touched states of the form fields.

export default function useProfileForm(initial = {}, validateFn) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const onChange = e =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const onBlur = e =>
    setTouched({ ...touched, [e.target.name]: true });

  const setField = (name, v) => setValues({ ...values, [name]: v });

  const validate = () => {
    const err = validateFn(values);
    setErrors(err);
    setTouched(Object.fromEntries(Object.keys(values).map(k => [k, true])));
    return Object.keys(err).length === 0;
  };

  return { values, errors, touched, onChange, onBlur, setField, validate };
}

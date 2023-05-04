import { useState, useRef } from "react";

const useFormField = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const initialValueRef = useRef(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };
  // A function to reset the field value to its initial value
  const reset = () => {
    setValue(initialValueRef.current);
  };
  return [value, handleChange, reset];
};

export default useFormField;

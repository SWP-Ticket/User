import React from 'react';

// interfaces
interface IProps {
  name: string;
  type: string;
  value?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  placeholder: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  min?: string | number; // Minimum value for number inputs
  max?: string | number; // Maximum value for number inputs
}

const Input = ({
  name,
  type,
  value,
  maxLength,
  disabled,
  required,
  placeholder,
  onChange,
  min,
  max, // Include max in destructuring
}: IProps): React.JSX.Element => (
  <input
    id={name}
    type={type}
    name={name}
    autoComplete='off'
    readOnly={disabled}
    disabled={disabled}
    required={required}
    value={value}
    maxLength={maxLength}
    className='input-text'
    placeholder={placeholder}
    onChange={onChange}
    min={min} // Add min to input element
    max={max} // Add max to input element
  />
);

export default Input;

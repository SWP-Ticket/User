import React from 'react';

// interfaces
interface IProps {
  type?: string | 'button';
  text: string;
  color: string;
  leftIcon?: string;
  rightIcon?: string;
  onClick?: () => void; // Added onClick prop
}

const Button = ({ type, text, color, leftIcon, rightIcon, onClick }: IProps): React.JSX.Element => (
  <button
    type={type === 'button' ? 'button' : 'submit'}
    className={`button ${color}`}
    onClick={onClick} // Added onClick handler
  >
    {leftIcon !== undefined && (
      <span className='material-symbols-outlined left-icon'>{leftIcon}</span>
    )}
    {text}
    {rightIcon !== undefined && (
      <span className='material-symbols-outlined right-icon'>{rightIcon}</span>
    )}
  </button>
);

export default Button;

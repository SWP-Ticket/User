import React from 'react';

// interfaces
interface IProps {
  type?: string | 'button';
  text: string;
  color: string;
  leftIcon?: string;
  rightIcon?: string;
  onClick?: () => void;
  disable?: boolean;
}

const Button = ({
  type,
  text,
  color,
  leftIcon,
  rightIcon,
  onClick,
  disable,
}: IProps): React.JSX.Element => {
  // Inline style for the button when disabled
  const disabledStyle = disable
    ? {
        backgroundColor: 'gray',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    : {};

  return (
    <button
      type={type === 'button' ? 'button' : 'submit'}
      className={`button ${color}`}
      onClick={onClick}
      disabled={disable}
      style={disabledStyle} // Apply inline styles conditionally
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
};

export default Button;

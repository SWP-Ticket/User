'use client';

import React, { type FormEvent } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';

// interfaces
interface IFormProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Add this prop
}

const FormSearch: React.FC<IFormProps> = ({ setSearchTerm }) => {
  const { showAlert } = useAlert();

  const [formValues, setFormValues] = React.useState({
    keyword: '',
  });

  /**
   * Handles the change event for form inputs.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from the input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;

    setFormValues({
      keyword: value,
    });

    setSearchTerm(value); // Update the search term in the parent component
  };

  /**
   * Handles the form submission event.
   *
   * Prevents the default form submission behavior. Currently, this function only handles alerts,
   * as the search is now triggered on input change.
   *
   * @param {FormEvent<HTMLFormElement>} e - The event object from the form submission.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // No longer handling validation here
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className='search-inputs flex flex-h-center flex-space-between'>
        <Input
          type='text'
          name='keyword'
          value={formValues.keyword}
          maxLength={64}
          placeholder='Event, venue, artist, keyword'
          required
          onChange={handleChange}
        />
        <button type='submit'>
          <span className='material-symbols-outlined'>search</span>
        </button>
      </div>
    </form>
  );
};

export default FormSearch;

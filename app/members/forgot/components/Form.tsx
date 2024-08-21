'use client';

import React, { type FormEvent } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import { AuthenApi } from 'api';

// interfaces
interface IFormProps {
  email: string;
  password: string;
  confirmPassword: string;
}

const Form = (): React.JSX.Element => {
  const { showAlert, hideAlert } = useAlert();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<IFormProps>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  /**
   * Handles the change event for input fields in the form.
   *
   * This function is called when the value of an input field in the form changes. It updates the state of the form values with the new value.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /**
   * Handles the form submission event.
   *
   * This function is called when the form is submitted. It prevents the default form submission behavior,
   * hides any existing alert, sets the loading state to true, sends a POST request to the signin/password endpoint,
   * and handles the response. If the response status is 200, it does nothing. If the status is not 200, it shows an error alert.
   * Finally, it sets the loading state back to false.
   *
   * @param {FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<any>} A promise that resolves when the request is complete.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    hideAlert();

    if (formValues.password !== formValues.confirmPassword) {
      showAlert({ type: 'error', text: 'Password does not match' });
      return;
    }

    setLoading(true);

    try {
      const authenApi = new AuthenApi();
      const response = await authenApi.apiAuthenResetPasswordPost({
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
      });
      console.log(response);
      // @ts-ignore
      if (response.data.success) {
        showAlert({ type: 'success', text: 'Reset successful!' });
      } else {
        showAlert({ type: 'error', text: 'Fail to reset password' });
      }
    } catch (error) {
      showAlert({ type: 'error', text: 'There is an error' });
    } finally {
      setLoading(false);
      window.location.href = '/';
    }
  };

  return (
    <form className='form shrink' noValidate onSubmit={handleSubmit}>
      <div className='form-elements'>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='email'>E-mail address</label>
            </div>
            <Input
              type='email'
              name='email'
              value={formValues.email}
              maxLength={128}
              placeholder='Enter your e-mail address'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='password'>Password</label>
            </div>
            <Input
              type='password'
              name='password'
              value={formValues.password}
              maxLength={128}
              placeholder='Enter your new password'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
            </div>
            <Input
              type='password'
              name='confirmPassword'
              value={formValues.confirmPassword}
              maxLength={128}
              placeholder='Confirm your new password'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Reset password' />
        </div>

        {loading && <Loader type='inline' color='blue' />}
      </div>
    </form>
  );
};

export default Form;

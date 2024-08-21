'use client';
import React, { FormEvent } from 'react';
import { storage } from '../../../../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAlert from '@hooks/useAlert';
import Input from '@components/Form/Input';
import { EventApi } from 'api';

interface IFormProps {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venueId: number;
  imageUrl: File | null;
  organizerId: number;
}

const CreateEventPage = (): React.JSX.Element => {
  const [formValues, setFormValues] = React.useState<IFormProps>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    venueId: 0,
    imageUrl: null,
    organizerId: 0,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { showAlert } = useAlert();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormValues({ ...formValues, imageUrl: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setFormValues({
        ...formValues,
        [name]: new Date(value), // Convert string to Date object
      });
    } else if (name === 'venueId') {
      setFormValues({
        ...formValues,
        [name]: parseInt(value, 10), // Convert string to number
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const uploadImageToFirebase = async (): Promise<string | null> => {
    if (!formValues.imageUrl) return null;

    const imageRef = ref(storage, `images/${formValues.imageUrl.name}`);
    await uploadBytes(imageRef, formValues.imageUrl);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImageToFirebase();
      const eventApi = new EventApi();

      // Convert dates to ISO strings
      const response = await eventApi.apiEventPost(
        formValues.title,
        formValues.description,
        formValues.startDate.toISOString(),
        formValues.endDate.toISOString(),
        formValues.venueId,
        imageUrl // Assuming imageUrl is also a parameter
      );

      showAlert({ type: 'success', text: 'Event created successfully!' });
    } catch (error) {
      showAlert({ type: 'error', text: 'Failed to create event.' });
    } finally {
      setLoading(false);
    }
  };

  const formStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonDisabledStyle: React.CSSProperties = {
    backgroundColor: '#aaa',
    cursor: 'not-allowed',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label htmlFor='title' style={labelStyle}>
          Event Title
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='text'
            name='title'
            value={formValues.title}
            maxLength={128}
            placeholder='Enter event title'
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='description' style={labelStyle}>
          Event Description
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='text'
            name='description'
            value={formValues.description}
            maxLength={256}
            placeholder='Enter event description'
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='startDate' style={labelStyle}>
          Start Date
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='date'
            name='startDate'
            maxLength={128}
            value={formValues.startDate.toISOString().split('T')[0]} // Convert Date to string for display
            placeholder='Enter start date'
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='endDate' style={labelStyle}>
          End Date
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='date'
            name='endDate'
            maxLength={128}
            value={formValues.endDate.toISOString().split('T')[0]} // Convert Date to string for display
            placeholder='Enter end date'
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='venueId' style={labelStyle}>
          Venue ID
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='number'
            name='venueId'
            value={String(formValues.venueId)}
            maxLength={5}
            placeholder='Enter venue ID'
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='image' style={labelStyle}>
          Upload Image
        </label>
        <input
          type='file'
          name='image'
          accept='image/*'
          onChange={handleImageChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '16px',
          }}
        />
      </div>
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt='Selected Image'
          style={{ maxWidth: '100%', marginTop: '10px' }}
        />
      )}
      <button
        type='submit'
        disabled={loading}
        style={{ ...buttonStyle, ...(loading ? buttonDisabledStyle : {}) }}
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventPage;

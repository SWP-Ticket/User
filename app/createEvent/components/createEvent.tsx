'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { storage } from '../../../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAlert from '@hooks/useAlert';
import Input from '@components/Form/Input';
import { EventApi, VenueApi } from 'api'; // Import the VenueApi

interface IFormProps {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venueId: string;
  imageUrl: string;
  organizerId: string;
}

interface IVenue {
  id: number;
  name: string;
}

const CreateEventPage = (): React.JSX.Element => {
  const organizerId = sessionStorage.getItem('organizerId') || '';

  const [formValues, setFormValues] = useState<IFormProps>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    venueId: '',
    imageUrl: '',
    organizerId: organizerId, // Use organizerId here
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { showAlert } = useAlert();
  console.log('Organizer ID:', formValues.organizerId);
  console.log('Venue ID:', formValues.venueId);
  console.log(formValues);
  console.log(venues);
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venueApi = new VenueApi();
        const response = await venueApi.apiVenueGet();
        // @ts-ignore
        setVenues(response.data.data.listData);
      } catch (error) {
        showAlert({ type: 'error', text: 'Failed to fetch venues.' });
      }
    };

    fetchVenues();
  }, [showAlert]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    } else {
      console.log('No file selected');
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setFormValues({
        ...formValues,
        [name]: new Date(value), // Convert string to Date object
      });
    } else if (name === 'venueId') {
      setFormValues({
        ...formValues,
        [name]: value, // Convert string to number
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string | null> => {
    if (!file) return null;

    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);
      console.log('Uploaded image URL:', downloadUrl); // Debug log
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = imageFile ? await uploadImageToFirebase(imageFile) : formValues.imageUrl;
      if (imageUrl) {
        const eventApi = new EventApi();
        const response = await eventApi.apiEventPost(
          formValues.title,
          formValues.startDate.toISOString(),
          formValues.endDate.toISOString(),
          Number(organizerId),
          formValues.description,
          Number(formValues.venueId),
          imageUrl
        );
        console.log(response);
        showAlert({ type: 'success', text: 'Event created successfully!' });
      } else {
        showAlert({ type: 'error', text: 'Failed to upload image.' });
      }
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
          Venue
        </label>
        <div style={{ marginBottom: '16px' }}>
          <select
            name='venueId'
            value={formValues.venueId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value='' disabled>
              Select a venue
            </option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
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

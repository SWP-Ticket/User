'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { storage } from '../../../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAlert from '@hooks/useAlert';
import Input from '@components/Form/Input';
import { EventApi, VenueApi } from 'api'; // Import the VenueApi
import { format, toZonedTime } from 'date-fns-tz';

interface IFormProps {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venueId: string;
  imageUrl: string;
  organizerId: string;
  price: number;
  quantity: number;
  saleEndDate: Date;
}

interface IVenue {
  id: number;
  name: string;
}

const CreateEventPage = (): React.JSX.Element => {
  const organizerId = sessionStorage.getItem('id') || '';
  const timeZone = 'Asia/Bangkok'; // UTC+7 timezone

  const [formValues, setFormValues] = useState<IFormProps>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    venueId: '',
    imageUrl: '',
    organizerId: organizerId,
    price: 0,
    quantity: 0,
    saleEndDate: new Date(),
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venueApi = new VenueApi();
        const response = await venueApi.apiVenueGet();
        //@ts-ignore
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
        [name]: value, // Keep as string
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
      showAlert({ type: 'error', text: 'Error uploading image.' });
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
          Number(formValues.venueId),
          formValues.description,
          imageUrl,
          formValues.price,
          formValues.quantity
        );
        console.log(response);
        showAlert({ type: 'success', text: 'Event created successfully!' });
        window.location.href = '/';
      } else {
        showAlert({ type: 'error', text: 'Failed to upload image.' });
      }
    } catch (error) {
      console.log(error);
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
            type='datetime-local'
            name='startDate'
            maxLength={128}
            value={format(toZonedTime(formValues.startDate, timeZone), "yyyy-MM-dd'T'HH:mm")}
            placeholder='Enter start date'
            min={format(toZonedTime(new Date(), timeZone), "yyyy-MM-dd'T'HH:mm")}
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
            type='datetime-local'
            name='endDate'
            maxLength={128}
            value={format(toZonedTime(formValues.endDate, timeZone), "yyyy-MM-dd'T'HH:mm")}
            min={format(toZonedTime(new Date(), timeZone), "yyyy-MM-dd'T'HH:mm")}
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
          Event Image
        </label>
        <input type='file' name='image' accept='image/*' onChange={handleImageChange} />
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt='Preview'
            style={{ maxWidth: '100%', marginTop: '16px' }}
          />
        )}
      </div>
      <h2>Ticket</h2>
      <div>
        <label htmlFor='title' style={labelStyle}>
          Price
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='number'
            name='price'
            value={formValues.price.toString()}
            placeholder='Enter ticket price'
            min={10000}
            max={9999999}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor='title' style={labelStyle}>
          Quantity
        </label>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type='number'
            name='quantity'
            value={formValues.quantity.toString()}
            maxLength={128}
            placeholder='Enter quantity'
            min={10}
            max={200}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        type='submit'
        style={loading ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventPage;

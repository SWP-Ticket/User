'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { storage } from '../../../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAlert from '@hooks/useAlert';
import Input from '@components/Form/Input';
import { EventApi, UserApi, VenueApi } from 'api'; // Import the VenueApi
import { format, toZonedTime } from 'date-fns-tz';

interface IFormProps {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  staffId: string;
  venueId: string;
  imageUrl: string;
  organizerId: string;
  price: number;
  quantity: number;
  host: string;
  presenter: string;
}

interface IVenue {
  id: number;
  name: string;
}

function isLessThanOneHour(startDate: Date, endDate: Date): boolean {
  console.log(startDate);
  console.log(endDate);
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Both arguments must be valid Date objects');
  }
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  console.log(differenceInHours);
  return differenceInHours < 1;
}

const CreateEventPage = (): React.JSX.Element => {
  const organizerId = sessionStorage.getItem('id') || '';
  const timeZone = 'Asia/Bangkok'; // UTC+7 timezone

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  const [staffMembers, setStaffMembers] = useState<IVenue[]>([]); // Use the same interface or create a new one
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [formValues, setFormValues] = useState<IFormProps>({
    title: '',
    description: '',
    startDate,
    endDate,
    staffId: '',
    venueId: '',
    imageUrl: '',
    organizerId: organizerId,
    price: 20000,
    quantity: 0,
    host: '',
    presenter: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { showAlert, hideAlert } = useAlert();
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        // Assuming there's a StaffApi to fetch staff members
        const staffApi = new UserApi();
        const response = await staffApi.apiUserStaffGet(); // Update with correct API call
        //@ts-ignore
        setStaffMembers(response.data.data.listData);
      } catch (error) {
        showAlert({ type: 'error', text: 'Failed to fetch staff members.' });
      }
    };

    fetchStaffMembers();
  }, [showAlert]);
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
      let dateValue = new Date(value);
      if (name === 'startDate' && isLessThanOneHour(dateValue, formValues.endDate)) {
        setFormValues({
          ...formValues,
          startDate: dateValue,
          endDate: new Date(new Date(value).setHours(dateValue.getHours() + 1)),
        });
      } else {
        setFormValues({
          ...formValues,
          [name]: dateValue,
        });
      }
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
        showAlert({ type: 'success', text: 'Event created successfully!' });
        window.location.href = '/';
      } else {
        showAlert({ type: 'error', text: 'Failed to upload image.' });
      }
    } catch (error) {
      console.log(error);
      showAlert({
        type: 'error',
        text: (error as any).response.data.message.toUpperCase() || 'Failed to create event.',
      });
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
    <>
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
              placeholder='Enter event description'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='description' style={labelStyle}>
            Event host
          </label>
          <div style={{ marginBottom: '16px' }}>
            <Input
              type='text'
              name='host'
              value={formValues.host}
              maxLength={256}
              placeholder='Enter event host'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='description' style={labelStyle}>
            Event presenter
          </label>
          <div style={{ marginBottom: '16px' }}>
            <Input
              type='text'
              name='presenter'
              value={formValues.presenter}
              maxLength={256}
              placeholder='Enter event presenter'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='staffId' style={labelStyle}>
            Staff Member
          </label>
          <div style={{ marginBottom: '16px' }}>
            <select
              name='staffId'
              value={formValues.staffId}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value='' disabled>
                Select a staff member
              </option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
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
              min={format(toZonedTime(formValues.startDate, timeZone), "yyyy-MM-dd'T'HH:mm")}
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
              type='datetime-local'
              name='endDate'
              maxLength={128}
              value={format(toZonedTime(formValues.endDate, timeZone), "yyyy-MM-dd'T'HH:mm")}
              min={format(
                toZonedTime(
                  new Date(
                    new Date(formValues.startDate).setHours(formValues.startDate.getHours() + 1)
                  ),
                  timeZone
                ),
                "yyyy-MM-dd'T'HH:mm"
              )}
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
              min={20000}
              max={10000000}
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
    </>
  );
};

export default CreateEventPage;

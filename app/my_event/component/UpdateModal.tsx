import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import { BorderAll } from '@mui/icons-material';
import useAlert from '@hooks/useAlert';
import React, { FormEvent, useEffect, useState } from 'react';
import { EventApi } from 'api';
import { storage } from 'firebaseconfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import Input from '@components/Form/Input';
import { format, toZonedTime } from 'date-fns-tz';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 5,
  p: 4,
  overflowY: 'auto', // Allows vertical scrolling when content overflows
  maxHeight: '80vh', // Sets maximum height to 80% of the viewport height
};

interface UpdatingEventModalProps {
  venueList: [];
  staffList: [];
  eventId: number;
  onUpdate: () => void;
}

interface IFormProps {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  staffId: string;
  venueId: string;
  imageUrl: string;
  host: string;
  presenter: string;
}

interface IVenue {
  id: number;
  name: string;
}

function isLessThanOneHour(startDate: Date, endDate: Date): boolean {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Both arguments must be valid Date objects');
  }
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  console.log(differenceInHours);
  return differenceInHours < 1;
}

const timeZone = 'Asia/Bangkok'; // UTC+7 timezone

const UpdatingEventModal: React.FC<UpdatingEventModalProps> = ({
  venueList,
  staffList,
  eventId,
  onUpdate,
}) => {
  console.log(staffList);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formValues, setFormValues] = useState<IFormProps>({
    id: eventId,
    title: '',
    description: '',
    startDate: format(toZonedTime(new Date(), timeZone), "yyyy-MM-dd'T'HH:mm"),
    endDate: format(toZonedTime(new Date(), timeZone), "yyyy-MM-dd'T'HH:mm"),
    staffId: '',
    venueId: '',
    imageUrl: '',
    host: '',
    presenter: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { showAlert, hideAlert } = useAlert();

  useEffect(() => {
    (async () => {
      const eventAPI = new EventApi();
      const eventResponse = await eventAPI.apiEventIdGet(eventId);
      //@ts-ignore
      const data = eventResponse.data.data;
      console.log(format(toZonedTime(data.startDate, timeZone), "yyyy-MM-dd'T'HH:mm"));
      setFormValues({
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        staffId: data.staffId,
        venueId: data.venueId,
        imageUrl: data.imageURL,
        host: data.host,
        presenter: data.presenter,
      });
      setImagePreviewUrl(data.imageURL);
    })();
  }, [eventId, open]);

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
    console.log(name, value);
    if (name === 'startDate' || name === 'endDate') {
      let dateValue = new Date(value);
      if (name === 'startDate' && isLessThanOneHour(dateValue, new Date(formValues.endDate))) {
        setFormValues({
          ...formValues,
          startDate: value,
          endDate: format(
            toZonedTime(new Date(new Date(value).setHours(dateValue.getHours() + 1)), timeZone),
            "yyyy-MM-dd'T'HH:mm"
          ),
        });
      } else {
        setFormValues({
          ...formValues,
          [name]: format(toZonedTime(new Date(new Date(value)), timeZone), "yyyy-MM-dd'T'HH:mm"),
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
      console.log(imageUrl);
      if (imageUrl) {
        const { id, ...body } = formValues;
        const formData = new FormData();

        // Append each field to the FormData object
        formData.append('Description', body.description);
        formData.append('EndDate', body.endDate);
        formData.append('Host', body.host);
        formData.append('ImageUrl', imageUrl);
        formData.append('Presenter', body.presenter);
        formData.append('StaffId', body.staffId);
        formData.append('StartDate', body.startDate);
        formData.append('Title', body.title);
        formData.append('VenueId', body.venueId);
        const response = await axios.put(
          `https://ticketswp-cvb4bhguf9fmbte2.eastus-01.azurewebsites.net/api/Event/${id}`,
          formData
        );
        showAlert({ type: 'success', text: 'Event created successfully!' });
        onUpdate();
        handleClose();
      } else {
        showAlert({ type: 'error', text: 'Failed to upload image.' });
      }
    } catch (error) {
      console.log(error);
      showAlert({
        type: 'error',
        text: (error as any).response?.data?.message?.toUpperCase() || 'Failed to update event.',
      });
      if (
        (error as any).response?.data?.message?.toUpperCase() ==
        'OBJECT REFERENCE NOT SET TO AN INSTANCE OF AN OBJECT.'
      ) {
        showAlert({ type: 'success', text: 'Event created successfully!' });
        onUpdate();
        handleClose();
      } else {
        showAlert({
          type: 'error',
          text: (error as any).response?.data?.message?.toUpperCase() || 'Failed to update event.',
        });
      }
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
    <div>
      <Button size='small' variant='contained' color='info' onClick={handleOpen}>
        <UpdateIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        disableScrollLock
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            style={{ fontWeight: 'bold' }}
          >
            {'Updating event'.toLocaleUpperCase()}
          </Typography>
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
                  {staffList.map((staff: any) => (
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
                      new Date(formValues.startDate).setHours(
                        new Date(formValues.startDate).getHours() + 1
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
                  {venueList.map((venue: any) => (
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
            <button
              type='submit'
              style={loading ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
              disabled={loading}
            >
              {loading ? 'Udating...' : 'Update Event'}
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdatingEventModal;

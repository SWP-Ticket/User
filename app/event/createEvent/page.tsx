import React from 'react';
import CreateEventPage from '../createEvent/components/createEvent'; // Adjust the import path as needed

const CreateEvent = (): React.JSX.Element => {
  return (
    <div>
      <h1>Create a New Event</h1>
      <CreateEventPage />
    </div>
  );
};

export default CreateEvent;

import React from 'react';
import Header from '@components/Header/Header'; // Adjust the import path as needed
import CreateEventContent from '../createEvent/components/createEvent'; // Adjust the import path as needed
import Master from '@components/Layout/Master';

const CreateEventPage = (): React.JSX.Element => {
  return (
    <Master>
      <main>
        <CreateEventContent />
      </main>
    </Master>
  );
};

export default CreateEventPage;

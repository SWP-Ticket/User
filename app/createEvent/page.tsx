import React from 'react';
import Header from '@components/Header/Header'; // Adjust the import path as needed
import CreateEventContent from '../createEvent/components/createEvent'; // Adjust the import path as needed

const CreateEventPage = (): React.JSX.Element => {
  return (
    <div>
      <Header />
      <main>
        <CreateEventContent />
      </main>
    </div>
  );
};

export default CreateEventPage;

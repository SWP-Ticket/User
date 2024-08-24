import React from 'react';

import Link from 'next/link';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';

import Form from './components/Form';

const Page = (): React.JSX.Element => (
  <Master>
    <Section className='white-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={1} color='gray' text='Sign up' />
          <p className='gray form-information'>
            Create an account to customize your experience for your ticketing journey.{' '}
            <Link href='/members/signin' className='blue'>
              Click here
            </Link>{' '}
            to sign in if you already have an account.
          </p>
        </div>
        <Form />
      </div>
    </Section>
  </Master>
);

export default Page;

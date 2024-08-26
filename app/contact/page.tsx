import React from 'react';

import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import ButtonLink from '@components/Button/ButtonLink';

const Page = (): React.JSX.Element => (
  <Master>
    <Section className='white-background'>
      <div className='container'>
        <div className='padding-bottom center'>
          <Heading type={1} color='gray' text='Contact us' />
          <p className='gray form-information'>
            Please feel free to contact us through the following communication channels for any
            questions, concerns, or suggestions you may have.
          </p>
        </div>
      </div>
    </Section>

    <Section className='white-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={5} color='gray' text='How can we help you?' />
          <p className='gray form-information'>
            Would you like to browse through the help section to find the answer to your question
            before asking us?
          </p>
          <div className='button-container'>
            <ButtonLink color='gray-filled' text='Help page' rightIcon='arrow_forward' url='help' />
          </div>
        </div>
      </div>
    </Section>
    <Section className='gray-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={5} color='gray' text='Communication details' />
          <div className='paragraph-container'>
            <p className='gray'>
              You can directly write us to
              <br />
              <strong>ticket@gmail.com</strong>
              <br />
              <br />
              or call us at
              <br />
              <strong>+84 193834132</strong>
              <br />
              <br />
              <strong>Our official address is</strong>
              <br />
              Unit 306, CC2 House, Bac Linh Dam New Urban
            </p>
          </div>
          <div className='button-container'></div>
        </div>
      </div>
    </Section>
  </Master>
);

const title = 'Contact us';
const mainUrl = 'https://www.modern-ticketing.com';
const canonical = `${mainUrl}/contact`;
const description = 'Ticketer is a Ticketer solution';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'Ticketer',
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: 'website',
    siteName: 'Ticketer',
    images: `${mainUrl}/logo192.png`,
  },
};

export default Page;

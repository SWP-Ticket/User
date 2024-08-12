'use client';

import React from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Progress from '@components/Progress/Progress';

const Alert = (): React.JSX.Element => {
  const { alert, hideAlert } = useAlert();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      hideAlert();
    }, 7000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hideAlert]);

  if (alert.show === true) {
    return (
      <div className='main-menu-backdrop'>
        <div className={`alert ${alert.type}`}>
          <div className='container'>
            <p>{alert.text}</p>
            <button type='button' onClick={hideAlert}>
              <span className='material-symbols-outlined'>close</span>
            </button>
          </div>
          <Progress ms={7000} />
        </div>
      </div>
    );
  }

  return <></>;
};

export default Alert;

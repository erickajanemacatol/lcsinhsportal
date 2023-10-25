import React, { useEffect, useState } from 'react';
import { IonContent, IonLabel, IonSpinner } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { Prompt } from 'react-router';

import './Loading.css';

const Error: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    const delayInMilliseconds = 3000;
    let timer: NodeJS.Timeout;

    const handleRedirect = () => {
      const userRole = localStorage.getItem('role');

      switch (userRole) {
        case '0':
          history.replace('/home');
          break;
        case '1':
          history.replace('/admin/news');
          break;
        case '2':
          history.replace('/faculty/attendance');
          break;
        default:
          console.log('Unexpected role:', userRole);
          history.replace('/default');
      }
    };

    if (showError) {
      if (location.pathname !== '/error') {
        setShowError(true);
      } else {
        // Start the timer if on the error page
        timer = setTimeout(() => {
          handleRedirect();
        }, delayInMilliseconds);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [history, location, showError]);

  return (
    <IonContent>
      <Prompt
        when={showError}
        message={() => {
          setShowError(false);
          return true;
        }}
      />
      <div className='giant-spinner'>
        <div>
          You are not authorized to view this page. Redirecting to the previous page...
        </div>
        <div>
          <IonSpinner name="bubbles" />
        </div>
      </div>
    </IonContent>
  );
};

export default Error;

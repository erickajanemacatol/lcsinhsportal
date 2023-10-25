import React from 'react';
import { IonContent, IonImg } from '@ionic/react';
import './Loading.css'; // Import your CSS file

const CustomLoading: React.FC<{ isOpen: boolean, delay: number }> = ({ isOpen, delay }) => {
  const letters = ['L ', 'C ', 'S ', 'I ', 'N ', 'H ', 'S', '.', '.', '.'];

  return (
    <IonContent>

      <div className='giant-spinner'>
        <div>
          <IonImg src="/src/imgs/logo2.png" alt="Logo" className='img-pref' />
        </div>

        <div className="jumping-letters-container">
          {letters.map((letter, index) => (
            <div className="jumping-letters" key={index}>
              {letter}
            </div>
          ))}
        </div>
      </div>

    </IonContent>
  );
};

export default CustomLoading;

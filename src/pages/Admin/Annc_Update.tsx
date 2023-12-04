import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, IonItemDivider, IonModal, IonTextarea } from '@ionic/react';
import './Announcements.css'
import { useMediaQuery } from 'react-responsive';
import { Announcement } from './Announcements';

interface UpdateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
  onUpdate: (updatedAnnouncement: Announcement) => void;
}

const UpdateAnnouncement: React.FC<UpdateAnnouncementProps> = ({
  isOpen,
  onClose,
  announcement,
  onUpdate,
}) => {
  // State to keep track of the updated title and description
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const isDesktop = useMediaQuery({ minWidth: 1050 });

  // Set initial values when the announcement changes
  useEffect(() => {
    if (announcement) {
      setUpdatedTitle(announcement.title);
      setUpdatedDescription(announcement.description);
    }
  }, [announcement]);

  // Handle form submission when the user updates the announcement
  const handleUpdate = () => {
    if (!announcement) {
      // Handle the case where the announcement is null or undefined.
      return;
    }

    // Create an updated announcement object with the new data
    const updatedAnnouncement: Announcement = {
      ...announcement,
      id: announcement.annc_id,
      title: updatedTitle,
      description: updatedDescription,
    };

    // Pass the annc_id to the onUpdate callback
    onUpdate(updatedAnnouncement);

    // Close the modal
    onClose();
  };

  return (
    <>
      {isDesktop ?
        <>
          <IonModal className='modal-des' isOpen={isOpen} onDidDismiss={onClose}>
            <div className='modal-view'>
              <center><h3><b>Update Announcement</b></h3></center>
              <IonItemDivider />
              <div className='spacer-h-l' />
              Title
              <div className='spacer-h-xs' />
              <IonInput fill={'outline'}
                value={updatedTitle}
                onIonChange={(e) => setUpdatedTitle(e.detail.value!)}
                counter={true}
                maxlength={50}
                counterFormatter={(inputLength, maxLength) =>
                  `${maxLength - inputLength} characters remaining`
                }
              ></IonInput>
              <div className='spacer-h-m' />
              Description
              <div className='spacer-h-xs' />
              <IonTextarea
                fill='outline'
                rows={5}
                value={updatedDescription}
                onIonChange={(e) => setUpdatedDescription(e.detail.value!)}
                counter={true}
                maxlength={300}
                counterFormatter={(inputLength, maxLength) =>
                  `${maxLength - inputLength} characters remaining`
                }
              ></IonTextarea>
              <div className="spacer-h-l"></div>
              <div className="submit-button-pos">
                <IonButton
                  className="submit-button"
                  size="default"
                  color={'primary'}
                  onClick={handleUpdate}>
                  Update
                </IonButton>
              </div>
            </div>

          </IonModal>
        </> : <>
          {/*MOBILE*/}
          <IonModal className='modal-des'
            isOpen={isOpen}
            onDidDismiss={onClose}
            initialBreakpoint={0.70}
            breakpoints={[0, 0.70]}
            backdropDismiss={true}
            backdropBreakpoint={0}>
            <div className='modal-view'>
              <center><h4><b>Update Announcement</b></h4></center>
              <IonItemDivider />
              <div className='spacer-h-l' />
              Title
              <div className='spacer-h-xs' />
              <IonInput
                fill={'outline'}
                value={updatedTitle}
                onIonChange={(e) => setUpdatedTitle(e.detail.value!)}
                counter={true}
                maxlength={50}
                counterFormatter={(inputLength, maxLength) =>
                  `${maxLength - inputLength} characters remaining`
                }
              ></IonInput>
              Description
              <div className='spacer-h-xs' />
              <IonTextarea fill='outline'
                rows={7}
                value={updatedDescription}
                onIonChange={(e) => setUpdatedDescription(e.detail.value!)}
                counter={true}
                maxlength={300}
                counterFormatter={(inputLength, maxLength) =>
                  `${maxLength - inputLength} characters remaining`
                }
              ></IonTextarea>
              <div className="spacer-h-m"></div>
              <IonButton
                expand="block"
                size="default"
                color={'primary'}
                onClick={handleUpdate}>
                Update
              </IonButton>
            </div>

          </IonModal>
        </>
      }
    </>

  );
};

export default UpdateAnnouncement;

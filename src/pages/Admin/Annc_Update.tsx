import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, IonModal } from '@ionic/react';

export interface Announcement {
  title: string;
  description: string;
  id: number;
}

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
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <h2>Update Announcement</h2>
      <IonInput
        value={updatedTitle}
        onIonChange={(e) => setUpdatedTitle(e.detail.value!)}
      ></IonInput>
      <IonInput
        value={updatedDescription}
        onIonChange={(e) => setUpdatedDescription(e.detail.value!)}
      ></IonInput>
      <IonButton onClick={handleUpdate}>Update</IonButton>
      <IonButton onClick={onClose}>Close</IonButton> {/* Close button */}
    </IonModal>
  );
};

export default UpdateAnnouncement;

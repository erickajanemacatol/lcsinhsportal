import React, { useState } from 'react';
import { IonModal, IonButton, IonContent } from '@ionic/react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onCancel}>
      <IonContent>
        <p>Are you sure you want to delete this announcement?</p>
        <IonButton onClick={onConfirm}>Confirm</IonButton>
        <IonButton onClick={onCancel}>Cancel</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default DeleteConfirmation;

// SubjectsModal.tsx

import React, { useEffect, useState } from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/react';
import axios from 'axios';

interface SubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeLevel: number | null;
}

const SubjectsModal: React.FC<SubjectsModalProps> = ({ isOpen, onClose, gradeLevel }) => {
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {

    console.log(gradeLevel);
    axios
      .get(`https://studentportal.lcsinhs.com/scripts/subjects-fetch.php?gradeLevel=${gradeLevel}`)
      .then((response) => {
        setSubjects(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [gradeLevel]);


  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Subjects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <IonText key={index}>{subject}</IonText>
          ))
        ) : (
          <IonText>No subjects available for grade level {gradeLevel}</IonText>
        )}
        <IonButton onClick={onClose}>Close</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default SubjectsModal;

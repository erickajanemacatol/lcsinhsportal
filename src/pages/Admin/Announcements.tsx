import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonIcon, IonLabel, IonPage, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import './Announcements.css';
import AdminHeader from "../../components/AdminHeader";
import { add } from "ionicons/icons";
import axios from 'axios'; // Import axios for making HTTP requests.
import { useMediaQuery } from "react-responsive";
import UpdateAnnouncement, { Announcement } from './Annc_Update';

interface UpdateAnnouncementProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement | null;
    onUpdate: (updatedAnnouncement: Announcement) => void;

}

const Announcements: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const handleUpdateClick = (id) => {
        const selectedAnnouncement = announcements.find((announcement) => announcement.annc_id === id);
        console.log("Selected Announcement:", selectedAnnouncement);
        setSelectedAnnouncement(selectedAnnouncement);
        setUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setUpdateModal(false);
        // Reset the selectedAnnouncement when closing the modal
        setSelectedAnnouncement(null);
    };


    const handleUpdateAnnouncement = (updatedAnnouncement, id) => {
        console.log('Updated Announcement:', updatedAnnouncement);
        console.log(id)

        // Assuming your server response format, you may need to adjust this based on your server's response structure.
        axios.post('http://localhost/annc-update.php', updatedAnnouncement)
            .then((response) => {
                console.log('Response from server:', response);

                if (response.data && response.data.success) {
                    showToast('Announcement Updated', 'primary');

                    // Update the announcements in the state
                    const updatedAnnouncements = announcements.map((ann) => {
                        if (ann.annc_id === id) {
                            // Update the id in the updatedAnnouncement object
                            updatedAnnouncement.id = id; // Use the correct property name
                            return updatedAnnouncement;
                        }
                        return ann;
                    });

                    setAnnouncements(updatedAnnouncements);
                    closeUpdateModal(); // Close the modal after a successful update
                } else {
                    console.error('Update failed:', response.data);
                    showToast('Announcement Update Failed', 'danger');
                }
            })
            .catch((error) => {
                console.error('Axios Error:', error);

                if (error.response) {
                    console.error('Axios Response Data:', error.response.data);
                    console.error('Axios Response Status:', error.response.status);
                    console.error('Axios Response Headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Axios Request:', error.request);
                } else {
                    console.error('Error:', error.message);
                }

                showToast('Announcement Update Failed', 'danger');
            });
    };


    const handleDeleteAnnouncement = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this announcement?');
      
        if (confirmed) {
          // Send a DELETE request to your PHP script with the announcement ID
          axios
            .delete(`http://localhost/annc-delete.php`, {
              data: { id },
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              if (response.data && response.data.success) {
                showToast('Announcement Deleted', 'success');
                // Handle successful deletion
                // You may want to update the list of announcements in the state.
                const updatedAnnouncements = announcements.filter((ann) => ann.annc_id !== id);
                setAnnouncements(updatedAnnouncements);
              } else {
                console.error('Deletion failed:', response.data);
                showToast('Announcement Deletion Failed', 'danger');
              }
            })
            .catch((error) => {
              console.error('Axios Error:', error);
              showToast('Announcement Deletion Failed', 'danger');
            });
        }
      };
      

    useEffect(() => {
        // Fetch announcements from your API endpoint when the component mounts.
        axios
            .get('http://localhost/annc-fetch.php')
            .then((response) => {
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ?
                <>
                    <IonContent>
                        <div className="spacer-h-l"></div>
                        <div className="spacer-h-m"></div>

                        <div className="create-button">
                            <IonButton size="default" href="/admin/announcement-details">
                                <IonIcon icon={add} />
                                Create
                            </IonButton>
                        </div>

                        {announcements.map((announcement, index) => (
                            <IonCard key={index}>
                                <IonCardHeader color="light">
                                    Title: {announcement.title}
                                    <div className="spacer-w-xl" />
                                    Date and Time: {(announcement.dateandtime)} {/* Format the timestamp */}
                                </IonCardHeader>
                                <div className="spacer-h-xxs" />
                                <IonCardContent>
                                    <IonLabel> Description: {announcement.description}</IonLabel>
                                </IonCardContent>
                                <IonButtons>
                                    <IonButton color="primary" onClick={() => handleUpdateClick(announcement.annc_id)}>
                                        Update
                                    </IonButton>
                                    <IonButton color="danger" onClick={() => handleDeleteAnnouncement(announcement.annc_id)}>
                                        Delete
                                    </IonButton>
                                </IonButtons>
                            </IonCard>
                        ))}

                        <UpdateAnnouncement
                            isOpen={updateModal}
                            onClose={closeUpdateModal}
                            announcement={selectedAnnouncement}
                            onUpdate={(updatedAnnouncement) => handleUpdateAnnouncement(updatedAnnouncement, selectedAnnouncement.annc_id)}
                        />


                    </IonContent>
                </> : <>
                    {/*MOBILE*/}
                    <IonContent>
                        <div className="spacer-h-l"></div>
                        <div className="spacer-h-m"></div>

                        <div className="create-button">
                            <IonButton size="default" href="/admin/announcement-details">
                                <IonIcon icon={add} />
                                Create
                            </IonButton>
                        </div>

                        {announcements.map((announcement, index) => (
                            <IonCard key={index}>
                                <IonCardHeader color="light">
                                    Title: {announcement.title}
                                    <div className="spacer-w-xl" />
                                    Date and Time: {(announcement.dateandtime)} {/* Format the timestamp */}
                                </IonCardHeader>
                                <div className="spacer-h-xxs" />
                                <IonCardContent>
                                    <IonLabel> Description: {announcement.description}</IonLabel>
                                </IonCardContent>
                                <IonButtons>
                                    <IonButton color="primary" onClick={() => handleUpdateClick(announcement.annc_id)}>
                                        Update
                                    </IonButton>
                                    <IonButton color="danger" onClick={() => handleDeleteAnnouncement(announcement.annc_id)}>
                                        Delete
                                    </IonButton>
                                </IonButtons>
                            </IonCard>
                        ))}

                        <UpdateAnnouncement
                            isOpen={updateModal}
                            onClose={closeUpdateModal}
                            announcement={selectedAnnouncement}
                            onUpdate={(updatedAnnouncement) => handleUpdateAnnouncement(updatedAnnouncement, selectedAnnouncement.annc_id)}
                        />


                    </IonContent>
                </>
            }
        </IonPage>
    );
};

export { Announcements };

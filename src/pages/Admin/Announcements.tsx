import {
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
    IonContent, IonIcon, IonItem, IonLabel, IonPage, IonText, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import './Announcements.css';
import AdminHeader from "../../components/AdminHeader";
import { add, create, trash } from "ionicons/icons";
import axios from 'axios';
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

    const handleUpdateClick = (id: any) => {
        const selectedAnnouncement = announcements.find((announcement) => announcement.annc_id === id);
        console.log("Selected Announcement:", selectedAnnouncement);
        setSelectedAnnouncement(selectedAnnouncement ?? null);
        setUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setUpdateModal(false);
        setSelectedAnnouncement(null);
    };

    const handleUpdateAnnouncement = (updatedAnnouncement: any, id: any) => {
        console.log('Updated Announcement:', updatedAnnouncement);
        console.log(id)

        axios.post('https://studentportal.lcsinhs.com/scripts/annc-update.php', updatedAnnouncement)
            .then((response) => {
                console.log('Response from server:', response);

                if (response.data && response.data.success) {
                    showToast('Announcement Updated', 'primary');

                    // Update the announcements in the state
                    const updatedAnnouncements = announcements.map((ann) => {
                        if (ann.annc_id === id) {
                            // Update the id in the updatedAnnouncement object
                            updatedAnnouncement.id = id;
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


    const handleDeleteAnnouncement = (id: any) => {
        const confirmed = window.confirm('Are you sure you want to delete this announcement?');

        if (confirmed) {
            // Send a DELETE request to your PHP script with the announcement ID
            axios
                .delete(`https://studentportal.lcsinhs.com/scripts/annc-delete.php`, {
                    data: { id },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast('Announcement Deleted', 'success');

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
        axios
            .get('https://studentportal.lcsinhs.com/scripts/annc-fetch.php')
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
                    <IonContent color={'light'}>
                        <div className="spacer-h-s"></div>
                        <div className="div-title">
                            <div className="title-pl">
                                <IonLabel className="annc-title">Announcements</IonLabel>
                            </div>

                            <div className="create-button">
                                <IonButton size="default" href="/admin/announcement-details" color={'dark'}>
                                    <IonIcon icon={add} />
                                    Create
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-m"></div>
                        <IonCard className="annc-card">

                            {announcements.map((announcement, index) => (
                                <IonItem key={index}>
                                    <IonLabel>
                                        <h2><b>{announcement.title}</b></h2>
                                        <div className="spacer-w-xl" />
                                        <p color="medium">{announcement.dateandtime}</p> {/* Set the color to "medium" */}
                                        <div className="spacer-w-xl" />
                                        <p>Details: {announcement.description}</p>
                                    </IonLabel>

                                    <IonButtons slot="end">
                                        <IonButton color="primary" size="default" onClick={() => handleUpdateClick(announcement.annc_id)}>
                                            <IonIcon slot="icon-only" icon={create} />
                                        </IonButton>
                                        <IonButton color="danger" size="default" onClick={() => handleDeleteAnnouncement(announcement.annc_id)}>
                                            <IonIcon slot="icon-only" icon={trash} />
                                        </IonButton>
                                    </IonButtons>
                                </IonItem>
                            ))}
                        </IonCard>

                    </IonContent>
                </> : <>

                    {/*MOBILE*/}
                    <IonContent>
                        <div className="spacer-h-s" />
                        <div className="annc-add">
                            <IonButton size="default" href="/admin/announcement-details" color={'dark'}>
                                <IonIcon icon={add} />
                                Create
                            </IonButton>
                        </div>

                        <div className="spacer-h-s"></div>

                        {announcements.map((announcement, index) => (
                            <IonCard key={index}>
                                <IonCardHeader className="header-disp">
                                    <div className="header-disp">
                                        <div className="title-poss">
                                            <IonText className="title-format">{announcement.title}</IonText>
                                            <div className="spacer-w-xl" />
                                            {(announcement.dateandtime)}
                                        </div>
                                        <div className="m-button-pos">
                                            <IonButtons>
                                                <IonButton color="primary" onClick={() => handleUpdateClick(announcement.annc_id)}>
                                                    <IonIcon icon={create} />
                                                </IonButton>
                                                <IonButton color="danger" onClick={() => handleDeleteAnnouncement(announcement.annc_id)}>
                                                    <IonIcon icon={trash} />
                                                </IonButton>
                                            </IonButtons>
                                        </div>

                                    </div>

                                </IonCardHeader>

                                <IonCardContent>
                                    <IonText color={'dark'}>Description: {announcement.description}</IonText>
                                </IonCardContent>

                            </IonCard>
                        ))}

                    </IonContent>
                </>
            }

            <UpdateAnnouncement
                isOpen={updateModal}
                onClose={closeUpdateModal}
                announcement={selectedAnnouncement}
                onUpdate={(updatedAnnouncement) => handleUpdateAnnouncement(updatedAnnouncement, selectedAnnouncement?.annc_id)}
            />
        </IonPage>
    );
};

export { Announcements };

import {
    IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
    IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonPage, IonText, IonTextarea, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import './Announcements.css';
import AdminHeader from "../../components/AdminHeader";
import { add, create, trash } from "ionicons/icons";
import axios from 'axios';
import { useMediaQuery } from "react-responsive";
import UpdateAnnouncement from './Annc_Update';

export interface Announcement {
    dateandtime: string;
    annc_id: number;
    title: string;
    description: string;
    id: number;
  }

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

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [addModal, setAddModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const openAddModal = () => {
        setAddModal(true);
    };

    const closeAddModal = () => {
        setAddModal(false);
    };

    const handleSubmit = () => {
        if (!title || !description) {
            showToast("Fields cannot be empty", "danger");
            return;
        }
    
        const newAnnouncement = {
            annc_id: 0, // Assuming 0 for now, you can modify as needed
            title,
            description,
            dateandtime: "", // Assuming empty string for now, you can modify as needed
            id: 0, // Assuming 0 for now, you can modify as needed
        };
    
        axios
            .post("https://studentportal.lcsinhs.com/scripts/annc-add.php", JSON.stringify(newAnnouncement))
            .then((response) => {
                if (response.data.success) {
                    showToast("Announcement Posted", "success");
    
                    // Update the state with the new announcement
                    setAnnouncements((prevAnnouncements) => [
                        ...prevAnnouncements,
                        { ...newAnnouncement, annc_id: response.data.id }, // assuming annc_id is the ID returned by the server
                    ]);
                } else {
                    showToast("Error posting announcement", "danger");
                }
            })
            .catch((error) => {
                showToast("Error posting announcement", "danger");
                console.log(error);
            });
    
        closeAddModal();
    };

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
                    showToast('Announcement Updated.', 'primary');

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
                                <IonButton size="default" onClick={openAddModal} color={'dark'}>
                                    <IonIcon icon={add} />
                                    Create
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-s"></div>

                        {announcements.map((announcement, index) => (
                            <IonCard className="annc-card">

                                <IonItem key={index}>
                                    <IonLabel>
                                        <h2><b>{announcement.title}</b></h2>
                                        <div className="spacer-w-xl" />
                                        <p color="medium">{announcement.dateandtime}</p> {/* Set the color to "medium" */}
                                        <div className="spacer-w-xl" />
                                        <p className="ion-text-wrap">Description: {announcement.description}</p>
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
                            </IonCard>

                        ))}

                    </IonContent>
                </> : <>

                    {/*MOBILE*/}
                    <IonContent color={'light'}>
                        <div className="spacer-h-xxs" />
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton className="m-add-btn-properties"
                                onClick={openAddModal}
                                color={'dark'}>
                                <IonIcon icon={add}></IonIcon>
                            </IonFabButton>
                        </IonFab>


                        <div className="spacer-h-s"></div>

                        {announcements.map((announcement, index) => (
                            <IonCard key={index} className="annc-card">
                                <IonCardHeader className="header-disp">
                                    <div className="header-disp">
                                        <div className="title-poss">
                                            <IonLabel className="title-format" color={'dark'}>
                                                {announcement.title}
                                                <p>{announcement.dateandtime}</p>
                                            </IonLabel>
                                        </div>
                                        <div className="m-button-pos">
                                            <IonButton color="primary" size="small" fill="clear" onClick={() => handleUpdateClick(announcement.annc_id)}>
                                                <IonIcon icon={create} slot="icon-only" />
                                            </IonButton>
                                            <IonButton color="danger" size="small" fill="clear" onClick={() => handleDeleteAnnouncement(announcement.annc_id)}>
                                                <IonIcon icon={trash} slot="icon-only" />
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCardHeader>

                                <IonCardContent>
                                    <IonText color={'medium'}>Description: {announcement.description}</IonText>
                                </IonCardContent>

                            </IonCard>
                        ))}

                    </IonContent>
                </>
            }

            {isDesktop ?
                <>
                    <IonModal className='modal-des'
                        isOpen={addModal}
                        onDidDismiss={closeAddModal}>
                        <div className='modal-view'>
                            <center>
                                <h3><b>Create Announcement</b></h3>
                            </center>
                            <IonItemDivider />

                            <div className="spacer-h-m"></div>
                            <div className="spacer-h-m"></div>
                            <IonInput
                                type="text"
                                fill="outline"
                                value={title}
                                label="Title"
                                labelPlacement="floating"
                                onIonChange={(e) => setTitle(e.detail.value!)}
                                counter={true}
                                maxlength={50}
                                counterFormatter={(inputLength, maxLength) =>
                                    `${maxLength - inputLength} characters remaining`
                                }
                            ></IonInput>

                            <div className="spacer-h-m"></div>
                            <IonTextarea
                                fill="outline"
                                rows={7}
                                value={description}
                                placeholder="Description"
                                onIonChange={(e) => setDescription(e.detail.value!)}
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
                                    onClick={handleSubmit}>
                                    Submit
                                </IonButton>
                            </div>
                        </div>
                    </IonModal>
                </> : <>
                    {/*MOBILE*/}
                    <IonModal
                        className='modal-des'
                        isOpen={addModal}
                        onDidDismiss={closeAddModal}
                        initialBreakpoint={0.70}
                        breakpoints={[0, 0.70]}
                        backdropDismiss={true}
                        backdropBreakpoint={0}
                    >
                        <div className='modal-view'>
                            <center>
                                <h4><b>Create Announcement</b></h4>
                            </center>
                            <IonItemDivider />

                            <div className="spacer-h-m"></div>
                            <div className="spacer-h-m"></div>
                            <IonInput
                                type="text"
                                fill="outline"
                                value={title}
                                label="Title"
                                labelPlacement="floating"
                                onIonChange={(e) => setTitle(e.detail.value!)}
                                counter={true}
                                maxlength={50}
                                counterFormatter={(inputLength, maxLength) =>
                                    `${maxLength - inputLength} characters remaining`
                                }
                            ></IonInput>

                            <div className="spacer-h-m"></div>
                            <IonTextarea
                                fill="outline"
                                rows={7}
                                value={description}
                                placeholder="Description"
                                onIonChange={(e) => setDescription(e.detail.value!)}
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
                                color={'dark'}
                                onClick={handleSubmit}>
                                Submit
                            </IonButton>
                        </div>
                    </IonModal>
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

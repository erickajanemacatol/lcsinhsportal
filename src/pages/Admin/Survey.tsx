import { IonButton, IonContent, IonInput, IonLabel, IonPage, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { useMediaQuery } from "react-responsive";
import './Survey.css';
import axios from "axios";

const Links: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const [surveyLink, setSurveyLink] = useState("");
    const surveyID = 1;
    const [enrolLink, setEnrolLink] = useState("");
    const enrolID = 1;
    const [editing, setEditing] = useState(true);
    const [editingE, setEditingE] = useState(true);
    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    //  SURVEY
    const handleAddLink = () => {
        if (!surveyLink) {
            showToast("Please enter a valid link", "danger");
            return;
        }

        // Validate the surveyLink format
        if (!isValidURL(surveyLink)) {
            showToast("Invalid URL format", "danger");
            return;
        }

        const surveyData = { surveyID, surveyLink };

        // Make a POST request to your PHP server to update the survey link
        axios.post('https://studentportal.lcsinhs.com/scripts/survey.php', surveyData)
            .then((response) => {
                // Handle the response here
                if (response.data.success) {
                    // Link updated successfully
                    localStorage.setItem("surveyLink", surveyLink);
                    showToast("Link Successfully Updated", "success");
                    setEditing(false);
                } else {
                    showToast("Failed to update link", "danger");
                }
            })
            .catch((error) => {
                console.error("Error updating link:", error);
                showToast("Failed to update link", "danger");
            });
    };


    const handleDeleteLink = () => {
        const confirmed = window.confirm("Are you sure you want to delete the current survey link?");
        if (confirmed) {
            setSurveyLink("");
            localStorage.removeItem("surveyLink");
            setEditing(true); // Set editing to true
            showToast("Link Successfully Deleted", "success");
        }
    };

    useEffect(() => {
        // Retrieve the surveyLink from localStorage
        const savedSurveyLink = localStorage.getItem("surveyLink");

        if (savedSurveyLink) {
            // Check if the savedSurveyLink is a valid URL
            if (isValidURL(savedSurveyLink)) {
                setSurveyLink(savedSurveyLink);
                setEditing(false); // Set editing to false if there's a survey link
            } else {
                showToast("Invalid URL stored in localStorage", "danger");
                localStorage.removeItem("surveyLink"); // Remove the invalid URL
            }
        }
    }, []);

    //ENROLMENT
    const handleAddLink2 = () => {
        if (!enrolLink) {
            showToast("Please enter a valid link", "danger");
            return;
        }

        // Validate the enrolLink format
        if (!isValidURL(enrolLink)) {
            showToast("Invalid URL format", "danger");
            return;
        }

        const enrolData = { enrolID, enrolLink };

        axios.post('https://studentportal.lcsinhs.com/scripts/enrolment.php', enrolData)
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem("enrolLink", enrolLink);
                    showToast("Link Successfully Updated", "success");
                    setEditingE(false);
                } else {
                    showToast("Failed to update link", "danger");
                }
            })
            .catch((error) => {
                console.error("Error updating link:", error);
                showToast("Failed to update link", "danger");
            });
    };

    const handleDeleteLink2 = () => {
        const confirmed = window.confirm("Are you sure you want to delete the current enrolment link?");
        if (confirmed) {
            setEnrolLink(""); // Clear the link in the component's state
            localStorage.removeItem("enrolLink"); // Remove the link from localStorage
            setEditingE(true);
            showToast("Enrolment Link Successfully Deleted", "success");
        }
    };

    useEffect(() => {
        const savedEnrolLink = localStorage.getItem("enrolLink");

        if (savedEnrolLink) {
            if (isValidURL(savedEnrolLink)) {
                setEnrolLink(savedEnrolLink);
                setEditingE(false);
            } else {
                showToast("Invalid URL stored in localStorage", "danger");
                localStorage.removeItem("enrolLink");
            }
        }
    }, []);

    // Function to validate a URL
    function isValidURL(str: any) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ?
                <>
                    <IonContent>
                        {/*SURVEY*/}
                        <div className="spacer-h-l"></div>

                        <div className="ttl-margin">
                            <IonLabel className="ttl">Survey Form Link</IonLabel>
                        </div>

                        <div className="spacer-h-m"></div>
                        <div className="disp-block">
                            <div className="disp-flex">
                                <IonInput
                                    fill="outline"
                                    placeholder="Enter link to survey here"
                                    value={surveyLink}
                                    onIonChange={(e) => setSurveyLink(e.detail.value!)}
                                ></IonInput>
                                <div className="spacer-w-xs" />
                                <IonButton onClick={handleAddLink}>
                                    {editing ? "Save Link" : "Edit Link"}
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-l" />
                        <div className="disp-center-flex">
                            {surveyLink && !editing && (
                                <div className="disp-block">
                                    <IonLabel>Current Link to Survey:</IonLabel>
                                    <div className="spacer-w-s" />
                                    <IonButton href={surveyLink} target="_blank">
                                        Open Survey
                                    </IonButton>
                                    <IonButton color="danger" onClick={handleDeleteLink}>
                                        Delete Link
                                    </IonButton>
                                </div>
                            )}
                        </div>

                        {/*ENROLMENT*/}
                        <div className="spacer-h-xl"></div>
                        <div className="spacer-h-xl"></div>

                        <div className="ttl-margin">
                            <IonLabel className="ttl">Enrolment Form Link</IonLabel>
                        </div>

                        <div className="spacer-h-m"></div>
                        <div className="disp-block">
                            <div className="disp-flex">
                                <IonInput
                                    fill="outline"
                                    placeholder="Enter link to enrolment form here"
                                    value={enrolLink}
                                    onIonChange={(e) => setEnrolLink(e.detail.value!)}
                                ></IonInput>
                                <div className="spacer-w-xs" />
                                <IonButton onClick={handleAddLink2}>
                                    {editingE ? "Save Link" : "Edit Link"}
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-l" />
                        <div className="disp-center-flex">
                            {enrolLink && !editingE && (
                                <div className="disp-block">
                                    <IonLabel>Current Link to Enrolment:</IonLabel>
                                    <div className="spacer-w-s" />
                                    <IonButton href={enrolLink} target="_blank">
                                        Open Enrolment Form
                                    </IonButton>
                                    <IonButton color="danger" onClick={handleDeleteLink2}>
                                        Delete Link
                                    </IonButton>
                                </div>
                            )}
                        </div>

                    </IonContent>
                </> : <>
                    {/*MOBILE*/}
                    <IonContent>
                        {/*SURVEY*/}
                        <div className="spacer-h-l"></div>

                        <div className="m-ttl-margin">
                            <IonLabel className="m-ttl">Survey Form Link</IonLabel>
                        </div>

                        <div className="spacer-h-m"></div>
                        <div className="m-disp-block">
                            <div className="m-disp-flex">
                                <IonInput
                                    fill="outline"
                                    placeholder="Enter link to survey here"
                                    value={surveyLink}
                                    onIonChange={(e) => setSurveyLink(e.detail.value!)}
                                ></IonInput>
                                <div className="spacer-w-xs" />
                                <IonButton onClick={handleAddLink}>
                                    {editing ? "Save Link" : "Edit Link"}
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-s" />
                        <div className="m-disp-center-flex">
                            {surveyLink && !editing && (
                                <div className="m-disp-block">
                                    <div className="spacer-w-s" />
                                    <IonButton href={surveyLink} target="_blank">
                                        Open Survey
                                    </IonButton>
                                    <IonButton color="danger" onClick={handleDeleteLink}>
                                        Delete Link
                                    </IonButton>
                                </div>
                            )}
                        </div>

                        {/*ENROLMENT*/}
                        <div className="spacer-h-xl"></div>
                        <div className="spacer-h-xl"></div>

                        <div className="m-ttl-margin">
                            <IonLabel className="m-ttl">Enrolment Form Link</IonLabel>
                        </div>

                        <div className="spacer-h-m"></div>
                        <div className="m-disp-block">
                            <div className="m-disp-flex">
                                <IonInput
                                    fill="outline"
                                    placeholder="Enter link to enrolment form here"
                                    value={enrolLink}
                                    onIonChange={(e) => setEnrolLink(e.detail.value!)}
                                ></IonInput>
                                <div className="spacer-w-xs" />
                                <IonButton onClick={handleAddLink2}>
                                    {editingE ? "Save Link" : "Edit Link"}
                                </IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-s" />
                        <div className="m-disp-center-flex">
                            {enrolLink && !editingE && (
                                <div className="m-disp-block">
                                    <div className="spacer-w-s" />
                                    <IonButton href={enrolLink} target="_blank">
                                        Open Enrolment Form
                                    </IonButton>
                                    <IonButton color="danger" onClick={handleDeleteLink2}>
                                        Delete Link
                                    </IonButton>
                                </div>
                            )}
                        </div>
                    </IonContent>
                </>
            }
        </IonPage>
    );
};

export { Links };

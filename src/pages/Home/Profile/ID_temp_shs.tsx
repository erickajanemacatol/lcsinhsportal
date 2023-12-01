import { useEffect, useState } from 'react';
import { IonCard, IonContent, IonImg, IonAvatar, IonText, IonPage } from "@ionic/react";
import './ID_temp.css';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

interface IDModel {
    student_lrn: string;
    f_name: string;
    l_name: string;
    emergency_co: string;
    emergency_add: string;
    emergency_no: string;
}

const ID_temp_shs = () => {
    const [userData, setUserData] = useState<IDModel>();
    const location = useLocation();
    const [profilePicturePath, setProfilePicturePath] = useState("https://ionicframework.com/docs/img/demos/avatar.svg");
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('print') === 'true') {
            window.print();
        }
    }, [location.search]);

    const username = localStorage.getItem('username');

    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/profile.php', { username: username })
                .then((response) => {
                    console.log(response);
                    setUserData(response.data);

                    if (response.data.profile_pic) {
                        console.log(response.data.profile_pic);
                        const profilePicturePath = `https://studentportal.lcsinhs.com/scripts/fetch_profile_pic.php?file=${response.data.profile_pic}`;
                        setProfilePicturePath(profilePicturePath);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    useEffect(() => {
        const unlisten = history.listen((newLocation) => {
            if (newLocation.pathname === '/school_id_shs') {
                if (username) {
                    axios
                        .post('https://studentportal.lcsinhs.com/scripts/profile.php', { username: username })
                        .then((response) => {
                            setUserData(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            }
        });

        return () => {
            unlisten();
        };
    }, [history, username]);

    return (
        <IonPage>
            <IonContent color={'light'}>
                <div className="spacer-h-m" />
                <div className="cards-pref">
                    <IonCard className="card-size">
                        <div className="card-content">
                            <IonImg src="/src/imgs/idfront_shs.png"></IonImg>
                            <div className="avatar-post">
                                <IonAvatar className="avatar-size">
                                    <img alt="Student Avatar" src={profilePicturePath || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                </IonAvatar>
                            </div>
                            <div className="name-over-image">
                                <IonText className="name-size">
                                    {userData?.f_name || ""} {userData?.l_name || ""}
                                </IonText>
                            </div>
                            <div className="lrn-over-image">
                                <IonText className="lrn-size">
                                    {userData?.student_lrn || ""}
                                </IonText>
                            </div>
                        </div>
                    </IonCard>
                    <IonCard className="card-size">
                        <div className="card-content">
                            <IonImg src='/src/imgs/idback_shs.png'></IonImg>
                        </div>
                        <div className="poc-over-image">
                            <IonText className='poc-size'>
                                {userData?.emergency_co || ""}
                            </IonText>
                        </div>
                        <div className="add-over-image">
                            <IonText className='add-size'>
                                {userData?.emergency_add || ""}
                            </IonText>
                        </div>
                        <div className="num-over-image">
                            <IonText className='num-size'>
                                {userData?.emergency_no || ""}
                            </IonText>
                        </div>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export { ID_temp_shs };

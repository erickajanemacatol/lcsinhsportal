import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonFooter, IonImg, IonInput, IonItem, IonLabel, IonPage, IonToolbar } from "@ionic/react";
import './Homepage.css'

const Homepage = () => {
    return (
        <IonPage >
            <IonContent color={'dark'} >


                <div className="content">
                    <div className='homepage-card-position'>
                        <IonCard className='homepage-card'>

                            <p className="p">Recent News</p>
                            <IonCard className="recent-news">
                                <IonCardHeader>news</IonCardHeader>
                            </IonCard>

                            <p className="p">School Announcements</p>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                            <IonCard className="recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>
                        </IonCard>
                    </div>
                    <div className='calendar-pos'>
                        <IonCard className='calendar-card'>

                            <p className="p">School Calendar</p>
                            
                        </IonCard>
                    </div>
                </div>


                <div className="footer1">
                    <IonFooter className="ion-no-border" color={"dark"}>
                        <IonToolbar>
                            <div className='footer-toolbar' >
                                <div className="about">
                                    <IonLabel className="s-font">About LCSINHS</IonLabel>
                                    <div className="mission">
                                        <div>
                                            <IonCard className="mission-card">
                                                <IonCardHeader className="mission-card-header">Mission</IonCardHeader>
                                                <IonCardContent className="p1">
                                                    The LCSINHS shall enhance maturity and mold students inclincation
                                                    in Science and Techonology for them to be productive citizens and be future
                                                    leaders who will direct and help the country towards new undertakings and
                                                    goals. The concept, objectives, goals, and educational performance of the
                                                    LCSINHS can contribute a lot in the quality and standard education.
                                                </IonCardContent>
                                            </IonCard>
                                        </div>
                                        <div >
                                            <IonCard className="mission-card">
                                                <IonCardHeader className="mission-card-header">Vision</IonCardHeader>
                                                <IonCardContent className="p1">
                                                    A school to turn Filipino youth with desirable traits, who are scientifically-inclined
                                                    and can compete with other graduates and can serve as efficient future leaders.
                                                </IonCardContent>
                                            </IonCard>
                                        </div>
                                        <div >
                                            <IonCard className="mission-card">
                                                <IonCardHeader className="mission-card-header">Motto</IonCardHeader>
                                                <IonCardContent className="p1">
                                                    "Excellence is not our goal, it is our standard."
                                                </IonCardContent>
                                            </IonCard>
                                        </div>
                                    </div>

                                </div>
                                
                                <div className="logo-w-name">
                                    <IonImg className="logo-size1" src="/src/imgs/footer-logo.png"></IonImg>                                </div>

                                <div className="allrights">
                                    <IonLabel className="a-font">© LCSINHS Portal. All rights reserved.</IonLabel>
                                </div>
                            </div>

                        </IonToolbar>
                    </IonFooter>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Homepage;
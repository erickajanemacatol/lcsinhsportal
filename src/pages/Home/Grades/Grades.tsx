import { IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonPage, IonToggle, IonToolbar } from "@ionic/react";
import Header from "../../../components/StudentHeader";
import Chart from "react-apexcharts";
import './Grades.css'

const Grades = () => {
    const chartData = {
        options: {
            chart: {
                id: "basic-bar",
                type: "line",
                toolbar: {
                    show: false
                }
            },
            xaxis: {
                type: "datetime"
            },
            stroke: {
                curve: "straight"
            }
        },
        series: [
            {
                name: "Series 1",
                data: [
                    {
                        x: "2022-01-01",
                        y: 0
                    },
                    {
                        x: "2022-03-02",
                        y: 5
                    },
                    {
                        x: "2022-04-15",
                        y: 3
                    },
                    {
                        x: "2022-05-09",
                        y: 2
                    },
                    {
                        x: "2022-06-19",
                        y: 0
                    }
                ]
            }
        ]
    };

    return (
        <IonPage>
            <Header />

            <IonContent color={'dark'} scrollX={false}>
                <IonCard className="my-grades-card">
                    <IonCardContent>

                        <div className="top-place">
                            <div>
                                <IonLabel className="my-activity-text">My Grades</IonLabel>
                            </div>

                            <div className="div-toggle">
                                View Grades by Semester
                                <div className="spacer-w-s"></div>
                                <IonToggle aria-label="View Grades"></IonToggle>
                            </div>
                        </div>

                        <div className="spacer-h-m"></div>

                        <IonCard>
                            <IonCardContent>
                                <Chart options={chartData.options}
                                    series={chartData.series}
                                    type="line"
                                    width="100%"
                                    height={200} />
                            </IonCardContent>
                        </IonCard>

                        <div className="spacer-h-m"></div>
                        <div className="cards-pos">
                            <IonCard className="cards-size">
                                <IonCardContent>
                                    <IonLabel className="label-appearance">Past Average:</IonLabel>
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="cards-size">
                                <IonCardContent>
                                    <IonLabel className="label-appearance">Current Average:</IonLabel>
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="cards-size">
                                <IonCardContent>
                                    <IonLabel className="label-appearance">Overall Average:</IonLabel>
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="cards-size">
                                <IonCardContent>
                                    <IonLabel className="label-appearance">Expected Average:</IonLabel>
                                </IonCardContent>
                            </IonCard>
                        </div>

                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export { Grades };
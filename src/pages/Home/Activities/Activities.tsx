import {
    IonCard, IonLabel,
    IonContent, IonPage,
    IonFab, IonFabButton,
    IonIcon, IonChip, IonItem,
    IonButton,
    IonText
} from "@ionic/react";
import './Activities.css';
import { add, addSharp, ellipse, trash } from "ionicons/icons";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

interface ActModel {
    activity_id: string;
    priority: number;
    act_desc: string;
    due_date: string;
    category: string;
}

const Activities = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const [activities, setActivities] = useState<ActModel[]>([]); // Specify the type as ActModel[]
    const username = localStorage.getItem('username');
    const [selectedCategory, setSelectedCategory] = useState("All"); // Default to show all categories

    function formatDate(dateString: any) {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        };
        return new Date(dateString).toLocaleDateString("en-AS", options);
    }

    useEffect(() => {
        axios.get(`https://studentportal.lcsinhs.com/scripts/task-fetch.php?studentLRN=${username}`)
            .then((response) => {
                setActivities(response.data);
            })
            .catch((error) => {
                console.error('Error fetching activities:', error);
            });
    }, [username]);

    const getPriorityColor = (priority: any) => {
        switch (priority) {
            case 0:
                return 'success';
            case 1:
                return 'warning';
            case 2:
                return 'danger';
            default:
                return 'medium';
        }
    };

    const handleChipClick = (category: any) => {
        setSelectedCategory(category);
    };

    const filteredActivities = selectedCategory === "All"
        ? activities
        : activities.filter((activity: ActModel) => activity.category === selectedCategory);

    // Sort the activities array by priority
    const sortedActivities = [...filteredActivities].sort((a, b) => b.priority - a.priority);

    const handleDeleteActivity = (activityId: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
        if (confirmDelete) {
            // If the user confirms, send a request to delete the activity
            axios.delete(`https://studentportal.lcsinhs.com/scripts/task-delete.php?activityId=${activityId}`)
                .then((response) => {
                    if (response.data.success) {
                        // Handle success, e.g., remove the deleted activity from the state
                        const updatedActivities = activities.filter(activity => activity.activity_id !== activityId);
                        setActivities(updatedActivities);
                    } else {
                        console.error('Error deleting activity:', response.data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting activity:', error);
                });
        }
    };

    return (

        <IonPage>
            <Header />

            {isDesktop ? <>
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-m" />
                    <div className="display-flex">

                        <div className="att-margin">
                            <IonLabel className="my-att-title">To Do List</IonLabel>
                        </div>

                        <div className="add-pos">
                            <IonButton
                                className="add-btn-properties"
                                href={"/activities/add-activity"}
                                color={'dark'}
                            > Add Task
                                <IonIcon icon={addSharp}></IonIcon>
                            </IonButton>
                        </div>

                        <div className="spacer-h-s" />
                    </div>

                    <IonItem color={"light"}>
                        <IonChip
                            color={selectedCategory === "All" ? "primary" : "dark"}
                            onClick={() => handleChipClick("All")}
                        >
                            All
                        </IonChip>
                        <IonChip
                            color={selectedCategory === "Personal" ? "primary" : "dark"}
                            onClick={() => handleChipClick("Personal")}
                        >
                            Personal
                        </IonChip>
                        <IonChip
                            color={selectedCategory === "School" ? "primary" : "dark"}
                            onClick={() => handleChipClick("School")}
                        >
                            School
                        </IonChip>
                        <IonChip
                            color={selectedCategory === "Work" ? "primary" : "dark"}
                            onClick={() => handleChipClick("Work")}
                        >
                            Work
                        </IonChip>
                        <IonChip
                            color={selectedCategory === "Home" ? "primary" : "dark"}
                            onClick={() => handleChipClick("Home")}
                        >
                            Home
                        </IonChip>
                    </IonItem>

                    {sortedActivities.map((activity: ActModel) => (
                        <div className="activity-card-center" key={activity.activity_id}>
                            <IonCard className="activity-card">
                                <IonItem>
                                    <div className="spacer-w-m" />
                                    <IonIcon icon={ellipse} color={getPriorityColor(activity.priority)} />
                                    <div className="spacer-w-m" />

                                    <IonLabel>
                                        <b>{activity.act_desc}</b>
                                    </IonLabel>

                                    <IonText>
                                        Due: {formatDate(activity.due_date)} at{' '}
                                        {new Date(activity.due_date).toLocaleTimeString('en-AS', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </IonText>

                                    <div className="spacer-w-xl" />
                                    <IonText>Category: {activity.category || 'None'}</IonText>

                                    <IonButton fill="clear" color={'danger'} size="default"
                                        onClick={() => handleDeleteActivity(activity.activity_id)} // Attach the delete function here
                                    >
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonItem>
                            </IonCard>
                        </div>
                    ))}

                </IonContent>
            </>
                :

                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton className="m-add-btn-properties"
                                href={"/activities/add-activity"}
                                color={'dark'}>
                                <IonIcon icon={add}></IonIcon>
                            </IonFabButton>
                        </IonFab>

                        <div className="spacer-h-s" />

                        <div className="att-margin">
                            <IonLabel className="m-my-act-title">To Do List</IonLabel>

                        </div>

                        <IonItem color={"light"}>
                            <IonChip
                                color={selectedCategory === "All" ? "primary" : "dark"}
                                onClick={() => handleChipClick("All")}
                            >
                                All
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Personal" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Personal")}
                            >
                                Personal
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "School" ? "primary" : "dark"}
                                onClick={() => handleChipClick("School")}
                            >
                                School
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Work" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Work")}
                            >
                                Work
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Home" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Home")}
                            >
                                Home
                            </IonChip>
                        </IonItem>

                        {sortedActivities.map((activity: ActModel) => (
                            <div className="avatar-center" key={activity.activity_id}>
                                <IonCard className="m-activity-card">
                                    <IonItem>
                                        <IonIcon icon={ellipse} color={getPriorityColor(activity.priority)} />
                                        <div className="spacer-w-s" />
                                        <IonLabel>
                                            <b>{activity.act_desc}</b>
                                        </IonLabel>

                                        <IonButton fill="clear" color={'danger'} size="default"
                                            onClick={() => handleDeleteActivity(activity.activity_id)} // Attach the delete function here
                                        >
                                            <IonIcon icon={trash} />
                                        </IonButton>
                                    </IonItem>

                                    <div className="m-due">
                                        <IonText>
                                            Due: {formatDate(activity.due_date)} at{' '}
                                            {new Date(activity.due_date).toLocaleTimeString('en-AS', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </IonText>
                                        
                                        <div className="spacer-w-s" />

                                        <IonText>Category: {activity.category || 'None'}</IonText>
                                    </div>



                                </IonCard>
                            </div>
                        ))}


                    </IonContent>
                </>

            }
        </IonPage >
    );
};

export { Activities };
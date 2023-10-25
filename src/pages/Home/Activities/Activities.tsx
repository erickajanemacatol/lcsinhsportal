import {
    IonCard, IonLabel,
    IonContent, IonPage,
    IonFab, IonFabButton,
    IonIcon, IonChip, IonItem,
    IonButton} from "@ionic/react";
import './Activities.css';
import { add, addSharp, ellipse, trash } from "ionicons/icons";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";


const Activities = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const history = useHistory();

    const [activities, setActivities] = useState([]);
    const username = localStorage.getItem('username');
    const [selectedCategory, setSelectedCategory] = useState("All"); // Default to show all categories


    useEffect(() => {
        axios.get(`http://localhost/task-fetch.php?studentLRN=${username}`)
            .then((response) => {
                setActivities(response.data);
            })
            .catch((error) => {
                console.error('Error fetching activities:', error);
            });
    }, [username]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 0:
                return 'success';
            case 1:
                return 'warning';
            case 2:
                return 'danger';
            default:
                return 'medium'; // Default color if priority is not 0, 1, or 2
        }
    };

    const handleChipClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredActivities = selectedCategory === "All"
        ? activities
        : activities.filter((activity) => activity.category === selectedCategory);

    // Sort the activities array by priority
    const sortedActivities = [...filteredActivities].sort((a, b) => b.priority - a.priority);

    const handleDeleteActivity = (activityId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
        if (confirmDelete) {
            // If the user confirms, send a request to delete the activity
            axios.delete(`http://localhost/task-delete.php?activityId=${activityId}`)
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

                        <IonLabel className="my-act-title">My Activities </IonLabel>

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

                    {sortedActivities.map((activity) => (
                        <div className="avatar-center" key={activity.activity_id}>
                            <IonCard className="activity-card">
                                <IonItem>
                                    <div className="spacer-w-l" />
                                    <IonIcon icon={ellipse} color={getPriorityColor(activity.priority)} />
                                    <IonLabel>
                                        <b>{activity.act_desc}</b>
                                    </IonLabel>
                                    <IonLabel>
                                        {new Date(activity.due_date).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </IonLabel>
                                    <IonLabel>Category: {activity.category}</IonLabel>

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

                        <IonLabel className="m-my-act-title">My Activities </IonLabel>

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

                        {sortedActivities.map((activity) => (
                            <div className="avatar-center" key={activity.activity_id}>
                                <IonCard className="m-activity-card">
                                    <IonItem>
                                        <IonIcon icon={ellipse} color={getPriorityColor(activity.priority)} />
                                        <IonLabel>
                                            <b>{activity.act_desc}</b>
                                        </IonLabel>

                                        <IonButton fill="clear" color={'danger'} size="default"
                                            onClick={() => handleDeleteActivity(activity.activity_id)} // Attach the delete function here
                                        >
                                            <IonIcon icon={trash} />
                                        </IonButton>
                                    </IonItem>

                                    <IonLabel>
                                        {new Date(activity.due_date).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </IonLabel>
                                    <IonLabel>Category: {activity.category}</IonLabel>
                                    
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
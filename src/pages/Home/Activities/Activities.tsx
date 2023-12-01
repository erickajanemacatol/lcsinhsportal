import {
    IonCard, IonLabel, IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonChip, IonItem, IonButton, IonText, useIonToast
} from "@ionic/react";
import './Activities.css';
import { add, addSharp, checkmarkDone, checkmarkDoneCircle, ellipse, trash } from "ionicons/icons";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import axios from "axios";

interface ActModel {
    activity_id: string;
    priority: number;
    act_desc: string;
    due_date: string;
    category: string;
    stat: number;
}

const Activities = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const [activities, setActivities] = useState<ActModel[]>([]);
    const username = localStorage.getItem('username');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [presentToast, dismissToast] = useIonToast();

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

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

    const getPriorityColor = (priority: any, stat: number) => {
        if (stat === 1) {
            return 'light'; // or any color you want for completed tasks
        }

        switch (priority) {
            case 0:
                return 'success';
            case 1:
                return 'warning';
            case 2:
                return 'danger';
            default:
                return 'light';
        }
    };


    const handleChipClick = (category: any) => {
        setSelectedCategory((prevCategory) => (prevCategory === "Done" ? "All" : category));
    };

    const filteredActivities = selectedCategory === "All"
        ? activities.filter((activity: ActModel) => activity.stat !== 1)
        : selectedCategory === "Done"
            ? activities.filter((activity: ActModel) => activity.stat === 1)
            : activities.filter((activity: ActModel) => activity.category === selectedCategory && activity.stat !== 1);

    const sortedActivities = [...filteredActivities].sort((a, b) => b.priority - a.priority);

    const handleMarkAsDone = (activityId: any) => {
        const confirmMarkAsDone = window.confirm("Are you sure you want to mark this activity as done?");
        if (confirmMarkAsDone) {
            try {
                axios.post('https://studentportal.lcsinhs.com/scripts/task-done.php', { activityId })
                    .then((response) => {
                        console.log('Response:', response);
                        if (response.data.success) {
                            showToast(`Activity with ID ${activityId} marked as done.`, 'success');
                            window.location.reload();
                            // Update the activity status or remove it from the list as needed
                            // You can update the state or make a new API call to fetch updated data
                        } else {
                            showToast('Error marking activity as done', 'danger');
                        }
                    })
                    .catch((error) => {
                        console.error('Error marking activity as done:', error);
                    });
            } catch (error) {
                console.error('Error during API request:', error);
            }
        }
    };

    const handleDeleteActivity = (activityId: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
        if (confirmDelete) {
            axios.delete(`https://studentportal.lcsinhs.com/scripts/task-delete.php?activityId=${activityId}`)
                .then((response) => {
                    if (response.data.success) {
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
                        <IonChip
                            color={selectedCategory === "Done" ? "primary" : "dark"}
                            onClick={() => handleChipClick("Done")}
                        >
                            Done
                        </IonChip>
                    </IonItem>

                    {sortedActivities.map((activity: ActModel) => (
                        <div className="activity-card-center" key={activity.activity_id}>
                            <IonCard className="activity-card">
                                <IonItem>
                                    <div className="spacer-w-m" />
                                    <IonIcon icon={ellipse} color={getPriorityColor(activity.priority, activity.stat)} />
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
                                    <div className="spacer-w-m" />

                                    <IonButton fill="clear" color={'danger'} size="default" onClick={() => handleDeleteActivity(activity.activity_id)}>
                                        <IonIcon icon={trash} />
                                    </IonButton>

                                    {activity.stat === 1 && (
                                        <IonIcon icon={checkmarkDoneCircle} color="success" />
                                    )}

                                    {activity.stat !== 1 && (
                                        <IonButton fill="clear" color={'success'} onClick={() => handleMarkAsDone(activity.activity_id)}>
                                            Mark as Done
                                            <div className="spacer-w-xs" />
                                            <IonIcon icon={checkmarkDone} color="success" />
                                        </IonButton>
                                    )}
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
                            <IonChip
                                color={selectedCategory === "Done" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Done")}
                            >
                                Done
                            </IonChip>
                        </IonItem>

                        {sortedActivities.map((activity: ActModel) => (
                            <div className="avatar-center" key={activity.activity_id}>
                                <IonCard className="m-activity-card">

                                    <IonItem>
                                        <IonIcon icon={ellipse} color={getPriorityColor(activity.priority, activity.stat)} />
                                        <div className="spacer-w-s" />
                                        <IonLabel>
                                            <b>{activity.act_desc}</b>
                                        </IonLabel>

                                        <IonButton fill="clear" color={'danger'} size="default"
                                            onClick={() => handleDeleteActivity(activity.activity_id)} // Attach the delete function here
                                        >
                                            <IonIcon icon={trash} />
                                        </IonButton>

                                        {activity.stat === 1 && (
                                            <IonIcon icon={checkmarkDoneCircle} color="success" />
                                        )}

                                        {activity.stat !== 1 && (
                                            <IonButton fill="clear" color={'success'} onClick={() => handleMarkAsDone(activity.activity_id)}>
                                                <IonIcon icon={checkmarkDone} color="success" slot="icon-only" />
                                            </IonButton>
                                        )}
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
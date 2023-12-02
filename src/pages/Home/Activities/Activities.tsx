import {
    IonCard, IonLabel, IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonChip, IonItem, IonButton, IonText, useIonToast, IonGrid, IonRow, IonCol
} from "@ionic/react";
import { BiArchive, BiArchiveIn, BiArchiveOut, BiBriefcase, BiCheckbox, BiHomeHeart, BiListCheck, BiNotepad, BiSolidAlarmExclamation, 
    BiSolidArchiveIn, BiSolidArchiveOut, BiSolidCheckSquare, BiSolidTrash, BiTrash, BiUser } from "react-icons/bi";
import './Activities.css';
import { add, addSharp } from "ionicons/icons";
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
    archived: number;
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

        switch (priority) {
            case 0:
                return 'green';
            case 1:
                return 'orange';
            case 2:
                return 'red';
            default:
                return 'black';
        }
    };

    const getPriorityText = (priority: any, stat: number) => {

        switch (priority) {
            case 0:
                return 'Low Priority';
            case 1:
                return 'Mid Priority';
            case 2:
                return 'High Priority';
            default:
                return 'null';
        }
    };

    const handleMarkAsDone = (activityId: any) => {
        const confirmMarkAsDone = window.confirm("Are you sure you want to mark this activity as done?");
        if (confirmMarkAsDone) {
            try {
                axios.post('https://studentportal.lcsinhs.com/scripts/task-done.php', { activityId })
                    .then((response) => {
                        console.log('Response:', response);
                        if (response.data.success) {
                            showToast(`Activity marked as done.`, 'success');

                            // Update the activity status in the state
                            setActivities((prevActivities) =>
                                prevActivities.map((activity) =>
                                    activity.activity_id === activityId
                                        ? { ...activity, stat: 1 } // Set stat to 1 for completed activities
                                        : activity
                                )
                            );
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

    const handleArchive = (activityId: string) => {
        axios.post('https://studentportal.lcsinhs.com/scripts/task-archive.php', { activityId, action: 'archive' })
            .then((response) => {
                if (response.data.success) {
                    // Update the state with the updated status
                    setActivities((prevActivities) => {
                        return prevActivities.map((activity) => {
                            if (activity.activity_id === activityId) {
                                return { ...activity, archived: response.data.archived };
                            }
                            return activity;
                        });
                    });
                    showToast(`Activity archived successfully.`, 'success');
                } else {
                    showToast('Error archiving activity', 'danger');
                    console.error('Error archiving activity:', response.data.error);
                }
            })
            .catch((error) => {
                console.error('Error archiving activity:', error);
            });
    };

    const handleUnarchive = (activityId: string) => {
        axios.post('https://studentportal.lcsinhs.com/scripts/task-archive.php', { activityId, action: 'unarchive' })
            .then((response) => {
                if (response.data.success) {
                    // Update the state with the updated status
                    setActivities((prevActivities) => {
                        return prevActivities.map((activity) => {
                            if (activity.activity_id === activityId) {
                                return { ...activity, archived: response.data.archived, stat: 0 }; // Set stat to 0 for unarchived activities
                            }
                            return activity;
                        });
                    });
                    showToast(`Activity unarchived successfully.`, 'success');
                } else {
                    showToast('Error unarchiving activity', 'danger');
                }
            })
            .catch((error) => {
                console.error('Error unarchiving activity:', error);
            });
    };

    const handleChipClick = (category: any) => {
        setSelectedCategory((prevCategory) => (prevCategory === "Done" || prevCategory === "Archived") ? "All" : category);
    };

    const filteredActivities = selectedCategory === "All"
        ? activities.filter((activity: ActModel) => activity.stat !== 1 && activity.archived !== 1)
        : selectedCategory === "Done"
            ? activities.filter((activity: ActModel) => activity.stat === 1 && activity.archived !== 1)
            : selectedCategory === "Archived"
                ? activities.filter((activity: ActModel) => activity.archived === 1)
                : activities.filter((activity: ActModel) => {
                    // Check if the activity should be in its category
                    return activity.category === selectedCategory && activity.stat !== 1 && activity.archived !== 1;
                });

    const sortedActivities = [...filteredActivities].sort((a, b) => b.priority - a.priority);

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
                        <IonChip slot="end"
                            color={selectedCategory === "Archived" ? "primary" : "dark"}
                            onClick={() => handleChipClick("Archived")}
                        >
                            Archived Activities
                        </IonChip>
                    </IonItem>

                    {sortedActivities.map((activity: ActModel) => (
                        <div className="activity-card-center" key={activity.activity_id}>
                            <IonCard className="activity-card">
                                <IonItem>
                                    {activity.stat !== 1 && (
                                        <>
                                            <IonButton
                                                fill="clear"
                                                size="small"
                                                title="Mark As Done"
                                                onClick={() => handleMarkAsDone(activity.activity_id)}
                                            >
                                                <BiCheckbox className="bi-checkbox" size={30} color="gray" />
                                            </IonButton>

                                            <div className="spacer-w-m" />

                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol className="col-align">
                                                        <BiSolidAlarmExclamation size={20}
                                                            title={getPriorityText(activity.priority, activity.stat)}
                                                            color={getPriorityColor(activity.priority, activity.stat)} />
                                                        <div className="spacer-w-s" />
                                                        <IonLabel>
                                                            <b>{activity.act_desc}</b>
                                                        </IonLabel>
                                                    </IonCol>
                                                    <IonCol className="col-align">
                                                        <IonText>
                                                            Due: {formatDate(activity.due_date)} at{' '}
                                                            {new Date(activity.due_date).toLocaleTimeString('en-AS', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </IonText>
                                                    </IonCol>
                                                    <IonCol className="col-align">
                                                        <div className="spacer-w-xl" />
                                                        <IonText>Category: {activity.category || 'None'}</IonText>
                                                        <div className="spacer-w-m" />
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>

                                            <IonButton fill="clear"
                                                title="Delete"
                                                size="small"
                                                onClick={() => handleDeleteActivity(activity.activity_id)}>
                                                <BiSolidTrash size={25} color="red" />
                                            </IonButton>

                                        </>
                                    )}

                                    {activity.stat === 1 && (
                                        <>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol className="col-align">
                                                        <BiSolidCheckSquare size={25} color={'green'} />
                                                        <div className="spacer-w-m" />
                                                        <IonLabel>
                                                            <b>{activity.act_desc}</b>
                                                        </IonLabel>
                                                    </IonCol>
                                                    <IonCol className="col-align">
                                                        <IonText>
                                                            Due: {formatDate(activity.due_date)} at{' '}
                                                            {new Date(activity.due_date).toLocaleTimeString('en-AS', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </IonText>
                                                    </IonCol>
                                                    <IonCol className="col-align">
                                                        <div className="spacer-w-xl" />
                                                        <IonText>Category: {activity.category || 'None'}</IonText>
                                                        <div className="spacer-w-m" />
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>

                                            <IonButton
                                                fill="clear"
                                                size="small"
                                                title={activity.archived === 1 ? 'Unarchive' : 'Archive'}
                                                onClick={() => {
                                                    // Toggle between archive and unarchive based on the archive status
                                                    if (activity.archived === 1) {
                                                        handleUnarchive(activity.activity_id);
                                                    } else {
                                                        handleArchive(activity.activity_id);
                                                    }
                                                }}
                                            >
                                                {activity.archived === 1 ? <BiSolidArchiveOut color="purple" size={25} /> : <BiSolidArchiveIn size={25} />}
                                            </IonButton>

                                            <IonButton fill="clear"
                                                title="Delete"
                                                size="small"
                                                onClick={() => handleDeleteActivity(activity.activity_id)}>
                                                <BiSolidTrash size={25} color="red" />
                                            </IonButton>

                                        </>
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
                                <BiUser size={17} />
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "School" ? "primary" : "dark"}
                                onClick={() => handleChipClick("School")}
                            >
                                <BiNotepad size={17} />
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Work" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Work")}
                            >
                                <BiBriefcase size={17} />
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Home" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Home")}
                            >
                                <BiHomeHeart size={17} />
                            </IonChip>
                            <IonChip
                                color={selectedCategory === "Done" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Done")}
                            >
                                <BiListCheck size={17} />
                            </IonChip>
                            <IonChip slot="end"
                                color={selectedCategory === "Archived" ? "primary" : "dark"}
                                onClick={() => handleChipClick("Archived")}
                            >
                                <BiArchive size={17} />
                            </IonChip>
                        </IonItem>

                        {sortedActivities.map((activity: ActModel) => (
                            <div className="avatar-center" key={activity.activity_id}>
                                <IonCard className="m-activity-card">
                                    <IonItem>
                                        {activity.stat !== 1 && (
                                            <>
                                                <IonButton
                                                    fill="clear"
                                                    size="small"
                                                    title="Mark As Done"
                                                    onClick={() => handleMarkAsDone(activity.activity_id)}
                                                >
                                                    <BiCheckbox className="bi-checkbox" size={30} color="gray" />
                                                </IonButton>

                                                <div className="spacer-w-xs" />

                                                <IonCol className="col-align">
                                                    <BiSolidAlarmExclamation size={20}
                                                        title={getPriorityText(activity.priority, activity.stat)}
                                                        color={getPriorityColor(activity.priority, activity.stat)} />
                                                    <div className="spacer-w-s" />
                                                    <IonLabel>
                                                        <b>{activity.act_desc}</b>
                                                    </IonLabel>
                                                </IonCol>

                                                <IonButton fill="clear"
                                                    title="Delete"
                                                    size="small"
                                                    onClick={() => handleDeleteActivity(activity.activity_id)}>
                                                    <BiTrash size={20} color="red" />
                                                </IonButton>

                                            </>
                                        )}

                                        {activity.stat == 1 && (
                                            <>
                                                <div className="spacer-w-s" />
                                                <BiSolidCheckSquare size={25} color={'green'} />
                                                <div className="spacer-w-m" />
                                                <IonLabel>
                                                    <b>{activity.act_desc}</b>
                                                </IonLabel>

                                                <div className="spacer-w-xs" />

                                                <IonButton
                                                    fill="clear"
                                                    size="small"
                                                    title={activity.archived === 1 ? 'Unarchive' : 'Archive'}
                                                    onClick={() => {
                                                        // Toggle between archive and unarchive based on the archive status
                                                        if (activity.archived === 1) {
                                                            handleUnarchive(activity.activity_id);
                                                        } else {
                                                            handleArchive(activity.activity_id);
                                                        }
                                                    }}
                                                >
                                                    {activity.archived === 1 ? <BiArchiveOut color="purple" size={20} /> : <BiArchiveIn size={20} />}
                                                </IonButton>

                                                <IonButton fill="clear"
                                                    title="Delete"
                                                    size="small"
                                                    onClick={() => handleDeleteActivity(activity.activity_id)}>
                                                    <BiTrash size={20} color="red" />
                                                </IonButton>
                                            </>
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
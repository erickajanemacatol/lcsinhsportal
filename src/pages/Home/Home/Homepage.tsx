import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonFooter,
    IonIcon,
    IonImg,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonPage,
    IonText,
    IonToolbar
} from "@ionic/react";
import './Homepage.css'
import StudentHeader from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { chevronBack, chevronForward, person } from "ionicons/icons";

interface AnnouncementModel {
    dateandtime: string;
    title: string;
    description: string;
}

interface EventModel {
    cal_id: string;
    event_name: string;
    description: string;
    start_date: string;
    end_date?: string | null;
}

const Homepage = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const [newsItems, setNewsItems] = useState<string[]>([]);
    const [announcements, setAnnouncements] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollableContainerRef = useRef(null);
    const [events, setEvents] = useState<EventModel[]>([]);
    const scrollInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = () => {
        if (scrollableContainerRef.current) {
            const container = scrollableContainerRef.current as HTMLDivElement;
            const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
            setScrollPosition(scrollPercentage);
        }
    };

    // Function to automatically scroll the container
    const autoScroll = (container: any, scrollStep: any, maxScroll: any) => {
        if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0;
        } else {
            container.scrollLeft += scrollStep;
        }
    };

    const handleAutoScroll = (isDesktop: any) => {
        if (scrollableContainerRef.current) {
            const container = scrollableContainerRef.current as HTMLDivElement;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const scrollStep = isDesktop ? 1475 : 370; // Adjust the scroll step for desktop and mobile

            autoScroll(container, scrollStep, maxScroll);
        }
    };


    useEffect(() => {
        if (isDesktop) {
            scrollInterval.current = setInterval(() => handleAutoScroll(true), 4000); // Adjust the interval for desktop
        } else {
            scrollInterval.current = setInterval(() => handleAutoScroll(false), 4000); // Adjust the interval for mobile
        }
    
        return () => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
            }
        };
    }, [isDesktop]);

    useEffect(() => {
        // Fetch announcements from your PHP script
        axios
            .get('https://studentportal.lcsinhs.com/scripts/annc-fetch.php')
            .then((response) => {
                // Update the announcements in the state
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Fetch recent news
        fetchImageList();
    }, []);

    const fetchImageList = () => {
        axios
            .get('https://studentportal.lcsinhs.com/scripts/news-fetch.php')
            .then((response) => {
                if (response.data && response.data.success) {
                    setNewsItems(response.data.newsItems);
                } else {
                    console.error('Failed to fetch images:', response.data.error);
                }
            })
            .catch((error) => {
                console.error('Error fetching images:', error);
            });
    };

    let startX = 0;
    let currentX = 0;

    function handleTouchStart(e: any) {
        startX = e.touches[0].clientX;
        currentX = startX;
    }

    function handleTouchMove(e: any) {
        let container = document.querySelector(".scrollable-container-home");
        const scrollSpeed = 2;

        if (container) {
            const diffX = e.touches[0].clientX - currentX;
            currentX = e.touches[0].clientX;

            container.scrollLeft -= diffX * scrollSpeed;
            e.preventDefault();
        }
    }

    useEffect(() => {
        const fetchNewsImages = async () => {
            try {
                const response = await axios.get('https://studentportal.lcsinhs.com/scripts/news-fetch.php');
                if (response.data.success) {
                    const imageUrls = response.data.images;
                    setNewsItems(imageUrls);
                } else {
                    console.error('Failed to fetch images:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchNewsImages();
    }, []);

    const getFormattedMonth = (date: any) => {
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("en-AS", options);
    };

    const getFormattedDate = (date: any) => {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-AS", options);
    };

    useEffect(() => {
        axios.get("https://studentportal.lcsinhs.com/scripts/event-fetch.php")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    return (
        <IonPage >
            <StudentHeader />
            {isDesktop ? <>
                <IonContent color={'light'}>
                    <div className="custom-image">
                        <IonImg src="/src/imgs/bg.jpg" className="image-cropped" />
                    </div>

                    <div className="spacer-h-m" />
                    <IonLabel className="p">Recent News</IonLabel>

                    <div>
                        <IonCard >
                            <div
                                className="scrollable-container-home"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onScroll={handleScroll}
                                ref={scrollableContainerRef}
                            >
                                <div className="news-items">
                                    {newsItems && newsItems.length > 0 ? (
                                        newsItems.map((imageUrl, index) => (
                                            <div className="news-card" key={index}>
                                                <img src={imageUrl} alt={`Image ${index}`} />
                                            </div>
                                        ))
                                    ) : (
                                        <div>
                                            <div className="spacer-w-m" />
                                            <IonText>No news to show.</IonText>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="spacer-h-s" />
                        </IonCard>
                    </div>

                    <IonLabel className="p">School Announcements</IonLabel>
                    <IonCard className='homepage-card'>
                        <div className="cal-cont">
                            {announcements.map((announcement: AnnouncementModel, index) => (
                                <IonItem>
                                    <IonCard key={index} className="anncm-card">
                                        <IonCardHeader>
                                            <IonText color={'dark'} className="title-format">{announcement.title}</IonText>
                                            <div className="spacer-w-xl" />
                                            {(announcement.dateandtime)}
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <IonText color={'dark'}> Description: {announcement.description}</IonText>
                                            <br></br>
                                            <div className="spacer-h-xxs" />
                                            <IonText><IonIcon icon={person} /> Admin</IonText>
                                        </IonCardContent>
                                    </IonCard>
                                </IonItem>
                            ))}
                        </div>
                    </IonCard>


                    <IonLabel className="p">School Calendar</IonLabel>
                    <IonCard className='homepage-card'>
                        <div className="cal-cont">
                            <IonList>
                                {events.map((event: EventModel, index) => {
                                    const currentDate = new Date(event.start_date);
                                    const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                    return (
                                        <div key={event.cal_id}>
                                            {index === 0 || (prevEventDate && currentDate.getMonth() !== prevEventDate.getMonth()) ? (
                                                <h3 className="month-year">{getFormattedMonth(currentDate)}</h3>
                                            ) : null}

                                            <IonItem>
                                                <IonLabel>
                                                    <h2>{event.event_name}</h2>
                                                    <p>{event.description}</p>
                                                    <p>Start Date: {getFormattedDate(event.start_date)}</p>
                                                    {event.end_date ? (
                                                        <p>End Date: {getFormattedDate(event.end_date)}</p>
                                                    ) : null}
                                                </IonLabel>
                                            </IonItem>
                                        </div>
                                    );
                                })}
                            </IonList>
                        </div>
                    </IonCard>

                    <div className="footer1">
                        <IonFooter className="ion-no-border" color={"dark"}>
                            <IonToolbar>
                                <div className='footer-toolbar'>
                                    <div className="about">
                                        <div className="s-font">About LCSINHS</div>
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
                                            <div>
                                                <IonCard className="mission-card">
                                                    <IonCardHeader className="mission-card-header">Vision</IonCardHeader>
                                                    <IonCardContent className="p1">
                                                        A school to turn Filipino youth with desirable traits, who are scientifically-inclined
                                                        and can compete with other graduates and can serve as efficient future leaders.
                                                    </IonCardContent>
                                                </IonCard>
                                            </div>
                                            <div>
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
                                        <IonImg className="logo-size1" src="/src/imgs/footer-logo.png"></IonImg>
                                    </div>

                                    <div className="allrights">
                                        <IonLabel className="a-font">All rights reserved.</IonLabel>
                                    </div>
                                </div>

                            </IonToolbar>
                        </IonFooter>
                    </div>
                </IonContent>
            </>
                :
                <>
                    <IonContent color={'light'}>
                        <div className="m-content">
                            <div className='m-homepage-card-position'>
                                <p className="m-p">Recent News</p>

                                <div>
                                    <IonCard className="m-calendar-card">
                                        <div
                                            className="scrollable-container-home"
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            onScroll={handleScroll}
                                            ref={scrollableContainerRef}
                                        >
                                            <div className="news-items">
                                                {newsItems && newsItems.length > 0 ? (
                                                    newsItems.map((imageUrl, index) => (
                                                        <div className="m-news-card" key={index}>
                                                            <img src={imageUrl} alt={`Image ${index}`} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>
                                                        <div className="spacer-w-m" />
                                                        <IonText>No news to show.</IonText>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </IonCard>

                                </div>
                            </div>

                            <p className="m-p">School Announcements</p>
                            <IonCard className="m-calendar-card">
                                {announcements.map((announcement: AnnouncementModel, index) => (
                                    <IonItem>
                                        <IonCard key={index} className="anncm-card">
                                            <IonCardHeader>
                                                <IonText color={'dark'} className="title-format">{announcement.title}</IonText>
                                                <div className="spacer-w-xl" />
                                                {(announcement.dateandtime)}
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonText color={'dark'}> Description: {announcement.description}</IonText>
                                                <br></br>
                                                <div className="spacer-h-xxs" />
                                                <IonText><IonIcon icon={person} /> Admin</IonText>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonItem>
                                ))}
                            </IonCard>

                        </div>
                        <div className='m-calendar-pos'>
                            <p className="m-p">School Calendar</p>
                            <IonCard className='m-calendar-card'>
                                <IonCardContent>
                                    <IonList>
                                        {events.map((event: EventModel, index) => {
                                            const currentDate = new Date(event.start_date);
                                            const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                            return (
                                                <div key={event.cal_id}>
                                                    {index === 0 || (prevEventDate && currentDate.getMonth() !== prevEventDate.getMonth()) ? (
                                                        <h3 className="month-year">{getFormattedMonth(currentDate)}</h3>
                                                    ) : null}

                                                    <IonItem>
                                                        <IonLabel>
                                                            <h2>{event.event_name}</h2>
                                                            <p>{event.description}</p>
                                                            <p>Start Date: {getFormattedDate(event.start_date)}</p>
                                                            {event.end_date ? (
                                                                <p>End Date: {getFormattedDate(event.end_date)}</p>
                                                            ) : null}
                                                        </IonLabel>
                                                    </IonItem>
                                                </div>
                                            );
                                        })}
                                    </IonList>
                                </IonCardContent>


                            </IonCard>
                        </div>


                        <div className="spacer-h-s" />

                        <IonFooter className="ion-no-border" color={"light"}>
                            <IonToolbar>
                                <div className='m-footer-toolbar'>
                                    <div className="m-about">
                                        <div className="spacer-h-s" />
                                        <div className="m-s-font">About LCSINHS</div>

                                        <IonCard className="m-mission-card">
                                            <IonCardHeader className="m-mission-card-header">Mission</IonCardHeader>
                                            <IonCardContent className="m-p1">
                                                The LCSINHS shall enhance maturity and mold students inclincation
                                                in Science and Techonology for them to be productive citizens and be future
                                                leaders who will direct and help the country towards new undertakings and
                                                goals. The concept, objectives, goals, and educational performance of the
                                                LCSINHS can contribute a lot in the quality and standard education.
                                            </IonCardContent>
                                        </IonCard>

                                        <IonCard className="m-mission-card">
                                            <IonCardHeader className="m-mission-card-header">Vision</IonCardHeader>
                                            <IonCardContent className="m-p1">
                                                A school to turn Filipino youth with desirable traits, who are scientifically-inclined
                                                and can compete with other graduates and can serve as efficient future leaders.
                                            </IonCardContent>
                                        </IonCard>

                                        <IonCard className="m-mission-card">
                                            <IonCardHeader className="m-mission-card-header">Motto</IonCardHeader>
                                            <IonCardContent className="m-p1">
                                                "Excellence is not our goal, it is our standard."
                                            </IonCardContent>
                                        </IonCard>
                                    </div>

                                    <div className="m-logo-w-name">
                                        <IonImg className="m-logo-size1" src="/src/imgs/footer-logo.png"></IonImg>                                </div>

                                    <div className="m-allrights">
                                        <IonLabel className="m-a-font">All rights reserved.</IonLabel>
                                    </div>
                                    <div className="spacer-h-m" />

                                </div>

                            </IonToolbar>
                        </IonFooter>
                    </IonContent>
                </>
            }

        </IonPage >
    );
};

export { Homepage };
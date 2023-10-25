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


const Homepage = () => {

    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const [newsItems, setNewsItems] = useState<string[]>([]);
    const [announcements, setAnnouncements] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollableContainerRef = useRef(null);
    const [events, setEvents] = useState([]);

    const handleScroll = () => {
        if (scrollableContainerRef.current) {
            const container = scrollableContainerRef.current;
            // Calculate the percentage of scroll position relative to the container width
            const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
            setScrollPosition(scrollPercentage);
        }
    };

    const handleNextClick = () => {
        if (scrollableContainerRef.current) {
            const container = scrollableContainerRef.current;
            // Scroll to the next position (adjust the value as needed)
            container.scrollLeft += 100;
            handleScroll();
        }
    };

    const handlePrevClick = () => {
        if (scrollableContainerRef.current) {
            const container = scrollableContainerRef.current;
            // Scroll to the previous position (adjust the value as needed)
            container.scrollLeft -= 100;
            handleScroll();
        }
    };

    useEffect(() => {
        // Fetch announcements from your PHP script
        axios
            .get('http://localhost/annc-fetch.php')
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
            .get('http://localhost/news-fetch.php')
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

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
    }

    function handleTouchMove(e) {
        const container = document.querySelector(".scrollable-container");
        const scrollSpeed = 2; // You can adjust the scroll speed as needed

        const diffX = e.touches[0].clientX - currentX;
        currentX = e.touches[0].clientX;

        container.scrollLeft -= diffX * scrollSpeed;
        e.preventDefault();
    }

    useEffect(() => {
        const fetchNewsImages = async () => {
            try {
                const response = await axios.get('http://localhost/news-fetch.php');
                if (response.data.success) {
                    const imageUrls = response.data.images;
                    console.log('Fetched images:', imageUrls);
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

    const getFormattedMonth = (date) => {
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("en-AS", options);
    };

    const getFormattedDate = (date) => {
        const options = { month: "long", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-AS", options);
    };

    useEffect(() => {
        axios.get("http://localhost/event-fetch.php")
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
                <IonContent className="home-background">

                    <div className="content">
                        <div className='homepage-card-position'>
                            <IonCard className="homepage-card">
                                <div className="spacer-h-m" />
                                <IonLabel className="p">Recent News</IonLabel>
                                <div>
                                    <div
                                        className="scrollable-container"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onScroll={handleScroll} // Add an onScroll event to update the scroll position
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
                                                <div className="center">
                                                    <IonText>No news items to display</IonText>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="center">
                                        <IonButton
                                            className="scroll-button prev"
                                            onClick={handlePrevClick}
                                            disabled={scrollPosition === 0}
                                        >
                                            <IonIcon slot="icon-only" icon={chevronBack} />
                                        </IonButton>
                                        <IonButton
                                            className="scroll-button next"
                                            onClick={handleNextClick}
                                            disabled={scrollPosition === 100}
                                        >
                                            <IonIcon slot="icon-only" icon={chevronForward} />
                                        </IonButton>
                                    </div>
                                    <div className="spacer-h-s" />
                                </div>

                            </IonCard>

                            <IonCard className='homepage-card'>
                                <div className="spacer-h-m" />
                                <IonLabel className="p">School Announcements</IonLabel>
                                {announcements.map((announcement, index) => (
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

                        <div className='calendar-pos'>
                            <IonCard className='calendar-card'>

                                <div className="spacer-h-m" />
                                <IonLabel className="p">School Calendar</IonLabel>

                                <div className="cal-cont">
                                    <IonList>
                                        {events.map((event, index) => {
                                            const currentDate = new Date(event.start_date);
                                            const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                            return (
                                                <div key={event.cal_id}>
                                                    {index === 0 || currentDate.getMonth() !== prevEventDate.getMonth() ? (
                                                        <h4 className="month-year">{getFormattedMonth(currentDate)}</h4>
                                                    ) : null}

                                                    <IonCard className="events">
                                                        <IonCardContent>
                                                            <IonText>
                                                                <h2>{event.event_name}</h2>
                                                                <p>{event.description}</p>
                                                                <p>Start Date: {getFormattedDate(event.start_date)}</p>
                                                                {event.end_date ? (
                                                                    <p>End Date: {getFormattedDate(event.end_date)}</p>
                                                                ) : null}
                                                            </IonText>
                                                        </IonCardContent>
                                                    </IonCard>
                                                </div>
                                            );
                                        })}
                                    </IonList>
                                </div>


                            </IonCard>
                        </div>


                    </div><div className="footer1">
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
                    <IonContent>
                        <div className="m-content">
                            <div className='m-homepage-card-position'>

                                <p className="m-p">Recent News</p>
                                <div className="scrollable-container">
                                    <IonCard className="news-card">
                                        <IonImg src={'/src/imgs/logo2.png'} />
                                    </IonCard>
                                    <IonCard className="news-card">
                                        <IonImg src={'/src/imgs/logo2.png'} />
                                    </IonCard>
                                    <IonCard className="news-card">
                                        <IonImg src={'/src/imgs/logo2.png'} />
                                    </IonCard>
                                    <IonCard className="news-card">
                                        <IonImg src={'/src/imgs/logo2.png'} />
                                    </IonCard>
                                </div>

                            </div>


                            <p className="m-p">School Announcements</p>
                            <IonCard className="m-recent-news">
                                <IonCardHeader>announcement</IonCardHeader>
                            </IonCard>

                        </div>
                        <div className='m-calendar-pos'>
                            <p className="m-p">School Calendar</p>
                            <IonCard className='m-calendar-card'>
                                <IonCardContent>
                                    Calendar
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
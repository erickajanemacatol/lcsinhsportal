import {
    useIonToast, IonPage, IonContent, IonLabel, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon,
    IonImg
} from "@ionic/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { trash } from "ionicons/icons";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import './News.css';

const News: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast] = useIonToast();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const selectedFileNameRef = useRef<HTMLDivElement | null>(null);

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const openFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const selectedFile = fileInputRef.current.files[0];
            selectedFileNameRef.current!.innerText = selectedFile.name;
        }
    };

    const uploadFile = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const selectedFile = fileInputRef.current.files[0];
            const formData = new FormData();
            formData.append("news", selectedFile);

            axios
                .post("https://studentportal.lcsinhs.com/scripts/news-add.php", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    if (response.data && response.data.success) {
                        showToast("File uploaded successfully", "success");
                        fetchImageList();

                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }

                        if (selectedFileNameRef.current) {
                            selectedFileNameRef.current.innerText = "";
                        }
                    } else {
                        const errorMessage = response.data.error || "File upload failed";
                        console.error("Upload Error:", errorMessage);
                        showToast(errorMessage, "danger");
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMessage = error.response.data.error || "File upload failed";
                        console.error("Server Error:", errorMessage);
                        showToast(errorMessage, "danger");
                    } else {
                        const errorMessage = "Request to server failed. Please check your network connection.";
                        console.error("Network Error:", errorMessage);
                        showToast(errorMessage, "danger");
                    }
                });
        } else {
            showToast("No file selected", "danger");
        }
    };

    const imageStyle = useMemo(() => {
        return {
            width: "100%",
            height: "100%",
        };
    }, []);

    const fetchImageList = () => {
        axios
            .get('https://studentportal.lcsinhs.com/scripts/news-fetch.php')
            .then((response) => {
                if (response.data && response.data.success) {
                    setImageUrls(response.data.images);
                } else {
                    console.error('Failed to fetch images:', response.data.error);
                }
            })
            .catch((error) => {
                console.error('Error fetching images:', error);
            });
    };

    useEffect(() => {
        fetchImageList();
    }, []);

    const handleDeleteImage = (imageUrl: string) => {
        console.log(imageUrl);
        const confirmed = window.confirm('Are you sure you want to delete this image?');

        if (confirmed) {
            // Extract the relative path from the imageUrl
            const relativePath = imageUrl.replace('https://studentportal.lcsinhs.com/news_uploaded', '');

            axios.delete(`https://studentportal.lcsinhs.com//scripts/news-delete.php?imageId=${imageUrl}`)
                .then((response) => {
                    console.log("Response:", response.data);
                    if (response.data.success) {
                        showToast("News Deleted.", "success");
                        fetchImageList();
                    } else {
                        console.error('Failed to delete image:', response.data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting image:', error);
                });
        }
    };

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ? (
                <IonContent color={'light'}>
                    <div className="spacer-h-s"></div>
                    <div className="div-title-n">

                        <div className="title-pl">
                            <IonLabel className="news-ttl">News Contents</IonLabel>
                        </div>
                        <div className="upload-pl">
                            <IonCard className="upload-card">
                                <input
                                    className="input-disp"
                                    type="file"
                                    name="news"
                                    accept=".jpeg, .jpg, .png"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                <div>
                                    <IonCardContent className="upload-card-cont">
                                        <div className="select-file-text">
                                            File (Max Size: 2MB): <span ref={selectedFileNameRef}></span>
                                        </div>
                                        <div className="select-file-but">
                                            <IonButton onClick={openFileInput} fill="outline" color={'dark'}>Select File</IonButton>
                                            <IonButton onClick={uploadFile} color={'dark'}>Upload</IonButton>
                                        </div>
                                    </IonCardContent>
                                </div>
                            </IonCard>
                        </div>
                    </div>

                    {
                        imageUrls.length > 0 ? (
                            imageUrls.map((imageUrl, index) => (
                                <IonCard key={index} className="card">
                                    <IonCardHeader>
                                        <IonCardTitle>{index + 1}</IonCardTitle>
                                        <IonButton fill="clear" className="trash-button" onClick={() => handleDeleteImage(imageUrl)}>
                                            <IonIcon slot="icon-only" color={'danger'} icon={trash} />
                                        </IonButton>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonImg src={imageUrl} alt={`Image ${index}`} style={imageStyle} />
                                    </IonCardContent>
                                </IonCard>
                            ))
                        ) : (
                            <div></div>
                        )
                    }
                </IonContent >
            ) : (
                <IonContent  color={'light'}>
                    <div className="div-title-n">

                        <div className="title-pl">
                        </div>
                    </div>
                    <div className="m-upload-pl">
                        <IonCard className="upload-card">
                            <input
                                type="file"
                                name="news"
                                accept=".jpeg, .jpg, .png"
                                ref={fileInputRef}
                                className="input-disp"
                                onChange={handleFileSelect}
                            />
                            <div>
                                <IonCardContent className="upload-card-cont">
                                    <div className="select-file-text">
                                        Selected File: <span ref={selectedFileNameRef}></span>
                                    </div>
                                    <div className="select-file-but">
                                        <IonButton onClick={openFileInput} fill="outline" color={'dark'}>Select File</IonButton>
                                        <IonButton onClick={uploadFile} color={'dark'}>Upload</IonButton>
                                    </div>
                                </IonCardContent>
                            </div>
                        </IonCard>
                    </div>

                    {
                        imageUrls.length > 0 ? (
                            imageUrls.map((imageUrl, index) => (
                                <IonCard key={index} className="m-card">
                                    <IonCardHeader>
                                        <IonLabel>{index + 1}</IonLabel>
                                        <IonButton fill="clear" size="small" className="trash-button" onClick={() => handleDeleteImage(imageUrl)}>
                                            <IonIcon color={'danger'} icon={trash} />
                                        </IonButton>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonImg src={imageUrl} alt={`Image ${index}`} style={imageStyle} />
                                    </IonCardContent>
                                </IonCard>
                            ))
                        ) : (
                            <div></div>
                        )
                    }
                </IonContent>
            )}
        </IonPage >
    );
};

export { News };

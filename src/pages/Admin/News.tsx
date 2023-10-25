import { useIonToast, IonPage, IonContent, IonLabel, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import './News.css';
import AdminHeader from "../../components/AdminHeader";
import { trash } from "ionicons/icons";

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
                .post("http://localhost/news-add.php", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast("File uploaded successfully", "success");
                        fetchImageList();

                        fileInputRef.current.value = "";
                        if (selectedFileNameRef.current) {
                            selectedFileNameRef.current.innerText = "";
                        }
                    } else {
                        showToast(response.data.error || "File upload failed", "danger");
                    }

                    fileInputRef.current.value = ""; // Clear the selected file
                })
                .catch((error) => {
                    console.error("Error:", error);
                    showToast("File upload failed", "danger");
                });
        } else {
            showToast("No file selected", "danger");
        }
    };


    const imageStyle = {
        width: '100%',
        height: '100%',
    };

    const fetchImageList = () => {
        axios
            .get('http://localhost/news-fetch.php')
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

    const handleDeleteImage = (imageUrl) => {
        const confirmed = window.confirm('Are you sure you want to delete this image?');
    
        if (confirmed) {
            // Extract the relative path from the imageUrl
            const relativePath = imageUrl.replace('http://localhost/', '');
    
            axios
                .delete(`http://localhost/news-delete.php?imageId=${relativePath}`)
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
                <IonContent>
                    <div className="spacer-h-l"></div>
                    <div className="div-title-n">

                        <div className="title-pl">
                            <IonLabel className="annc-title">News</IonLabel>
                        </div>
                        <div className="upload-pl">
                            <IonCard className="upload-card">
                                <input
                                    type="file"
                                    name="news"
                                    accept=".jpeg, .jpg, .png"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                />
                                <div>
                                    <IonCardContent className="upload-card-cont">
                                        <div className="select-file-text">
                                            Selected File: <span ref={selectedFileNameRef}></span>
                                        </div>
                                        <div className="select-file-but">
                                            <IonButton onClick={openFileInput} size="small" color={'dark'}>Select File</IonButton>
                                            <IonButton onClick={uploadFile} size="small" color={'dark'}>Upload</IonButton>
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
                                        <img src={imageUrl} alt={`Image ${index}`} style={imageStyle} />
                                    </IonCardContent>
                                </IonCard>
                            ))
                        ) : (
                            <div></div>
                        )
                    }



                </IonContent >
            ) : (
                <IonContent>
                </IonContent>
            )}
        </IonPage >
    );
};

export { News };

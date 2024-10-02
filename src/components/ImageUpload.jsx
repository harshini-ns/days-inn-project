import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import axios from 'axios';
import './ImageUpload.css'; // CSS file for styling

const ImageUpload = ({ onUpload, userDetails = {} }) => {
    const [imagePreview, setImagePreview] = useState(null);

    // Handle file selection and upload to Firebase directly
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file)); // Preview the image

            // Upload the file to Firebase
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Monitor the upload process
            uploadTask.on(
                'state_changed',
                null, // Omit progress tracking for simplicity
                (error) => {
                    console.error('Upload error:', error);
                },
                () => {
                    // Get the download URL and send to the backend
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        handleImageUpload(downloadURL); // Send URL to backend
                        onUpload(downloadURL); // Optional callback
                    });
                }
            );
        }
    };

    // Send image URL to the backend
    const handleImageUpload = async (url) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('https://886e5827-4483-41a5-85e3-0d1270999a8e-00-2ioif0yd5eyfy.pike.replit.dev/user/updateProfilePic', {
                user_id: userDetails.user_id,
                profile_picture: url
            }, {
                headers: { Authorization: token }
            });
            console.log('Profile picture updated successfully');
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    return (
        <div className="image-upload-container">
            <input
                type="file"
                id="file-upload"
                className="file-input"
                accept="image/*"
                onChange={handleImageChange}
            />
            <label htmlFor="file-upload" className="upload-circle">
                {imagePreview || userDetails.profile_picture ? (
                    <img src={imagePreview || userDetails.profile_picture} alt="Profile" className="image-preview" />
                ) : (
                    <span className="upload-text">Upload Your Profile Picture</span>
                )}
            </label>

        </div>
    );
};

export default ImageUpload;

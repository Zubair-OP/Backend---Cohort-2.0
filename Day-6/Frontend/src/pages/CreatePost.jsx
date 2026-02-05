import { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const title = form.title.value;
        const caption = form.caption.value;
        const file = form.image.files[0];

        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('caption', caption);
        if (file) {
            formData.append('image', file);
        }

        try {
            await axios.post('http://localhost:3000/api/post/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="create-post-page">
            <div className="container">
                <div className="form-card">
                    <h1 className="form-title">Create New Post</h1>
                    <p className="form-subtitle">Share your thoughts with the world</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input-field"
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="caption">Caption</label>
                            <textarea
                                id="caption"
                                name="caption"
                                className="input-field textarea-field"
                                placeholder="Write a caption..."
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Cover Image</label>
                            <div className="image-upload-area">
                                <input
                                    type="file"
                                    id="image-upload"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                    required
                                />
                                <label htmlFor="image-upload" className="upload-label">
                                    {preview ? (
                                        <div className="image-preview" style={{ backgroundImage: `url(${preview})` }}>
                                            <div className="change-image-overlay">
                                                <span>Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <span className="material-icons upload-icon">cloud_upload</span>
                                            <span>Click to upload image</span>
                                            <span className="upload-hint">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn">
                            Publish Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;

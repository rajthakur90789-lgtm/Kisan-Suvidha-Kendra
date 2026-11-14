
import { useState } from "react";
import "../style/cropDisease.css";

function CropDisease() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }

            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please upload a crop image first.");
            return;
        }

        alert("Image selected successfully. AI connection will be added next.");
    };

    return (
        <div className="crop-disease-container">

            <div className="crop-disease-header">
                <h1>🌱 AI Crop Disease Detection</h1>
                <p>
                    Upload your crop leaf image and get help
                    identifying possible diseases.
                </p>
            </div>

            <div className="crop-disease-card">

                <h2>Upload Crop Image</h2>

                <p>
                    Select a clear photo of the affected crop leaf.
                </p>

                <form onSubmit={handleSubmit}>

                    <label className="crop-upload-box">
                        <span>📷</span>
                        <strong>Choose Crop Image</strong>
                        <small>JPG, JPEG or PNG</small>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>

                    {preview && (
                        <div className="crop-image-preview">
                            <h3>Image Preview</h3>
                            <img src={preview} alt="Selected crop" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="crop-detect-btn"
                        disabled={!image}
                    >
                        Detect Crop Disease
                    </button>

                </form>
            </div>

            <div className="crop-info">
                <h3>How it works</h3>
                <p>1. Upload a clear crop leaf photograph.</p>
                <p>2. AI will analyse the uploaded image.</p>
                <p>3. Get possible disease information and guidance.</p>
            </div>

        </div>
    );
}

export default CropDisease;

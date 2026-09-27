// image Upload
import { useState, useEffect } from "react";
import "./FileUpload.css";

import { UPLOADS_URL } from "../config";
import api from "../api/axios";
import PopupMessage from "../components/PopupMessage";

const FileUploadProduct = ({
    name,
    onChange,
    accept = ".jpg,.jpeg",
    required,
    className,
    value,
    onUploadSuccess,
    folderName
}) => {

  
    console.log("folderName => ",folderName)
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file chosen");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState(null);

    useEffect(() => {
        if (value && typeof value === 'string') {
            setUploadedFileName(value);
            // setFileName(value.split('/').pop() || "File uploaded");
            if (!file) {
                setFileName("File uploaded");
            }
        }
    }, [value]);

    const validateFile = (file) => {
        if (!file) {
            if (required) setError("Please select a file");
            return false;
        }

        const allowedTypes = ["image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            setError("Only JPG/JPEG files are allowed");
            return false;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File size must be less than 2MB");
            return false;
        }

        setError("");

        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError("");
        setUploadedFileName(null);

        if (!selectedFile) {
            setFile(null);
            setFileName("No file chosen");
            if (onChange) onChange({ target: { name, value: null } });
            return;
        }

        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            if (onChange) onChange({
                target: {
                    name,
                    value: selectedFile,
                    files: [selectedFile]
                }
            });
        } else {
            setFile(null);
            setFileName("No file chosen");
            e.target.value = "";
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        

        //alert("file upload started" + "   " +file.name)
        //alert("api url  =  " + api.defaults.baseURL +"/uploadsimages")

        try {
            const response = await api.post(`/uploadsimages/product/${folderName}`,formData );
            console.log("resposne:",response.data)
            setUploadedFileName(response.data.filename);
            setError("");
            setFile(null);
            setFileName("");

            // Call both onChange and onUploadSuccess with the filename
            if (onChange) {
                onChange({
                    target: {
                        name,
                        value: response.data.filename
                    }
                });
            }

            <PopupMessage Message="File Upload Sccessfully" />
            console.log("file uplaoded succefully")
            alert("Image upload successfully...")
            if (onUploadSuccess) {
                onUploadSuccess(response.data.filename);
            }
        } catch (err) {
            alert("file upload failed" + err.response?.data?.error);
            setError(err.response?.data?.error || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleViewFile = () => {
        if (uploadedFileName) {
            window.open(`${UPLOADS_URL}/${uploadedFileName}`, '_blank');
        }
    };

    return (
        <div className={`file-upload-container ${className}`}>
            <div className="custom-file-input">
                <div className="file-input-group">
                    <label htmlFor={`file-upload-${name}`} className="file-choose-btn">
                        Choose File
                        <input
                            id={`file-upload-${name}`}
                            type="file"
                            onChange={handleFileChange}
                            accept={accept}
                            required={required}
                            className="hidden-file-input"
                        />
                    </label>
                    <span className="file-name-display">{fileName}</span>
                    {!uploadedFileName ? (
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="file-upload-btn"
                            disabled={!file || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleViewFile}
                            className="file-view-btn"
                        >
                            View
                        </button>
                    )}
                </div>
            </div>
            {error && <span className="file-error-message">{error}</span>}
        </div>
    );
};

export default FileUploadProduct;
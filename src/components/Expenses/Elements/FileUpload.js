import { Plus } from "lucide-react";
import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";

export default function FileUpload({ formData, setFormData, resetFile }) {
  const [fileName, setFileName] = useState(null); // To store the selected file name
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the selected file name
      setFormData((prevFormData) => ({
        ...prevFormData,
        document: file, // Store the selected file in formData
      }));
    }
  };

  // Reset the file input and fileName when resetFile changes
  useEffect(() => {
    if (resetFile) {
      setFileName(null); // Clear the file name
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  }, [resetFile]);

  return (
    <>
      <UploadContainer onClick={handleClick}>
        {fileName ? (
          <p>{fileName}</p>
        ) : (
          <>
            <Plus size={48} /> <p>Upload an invoice</p>
          </>
        )}
      </UploadContainer>
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
}

const UploadContainer = styled.div`
  background: #1f2937;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer; /* Add pointer cursor */
  p {
    color: #9ca3af;
  }
  &:hover {
    background: #374151; /* Optional hover effect */
  }
`;

const HiddenFileInput = styled.input`
  display: none; /* Hide the input element */
`;

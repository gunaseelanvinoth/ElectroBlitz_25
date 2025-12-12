import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const UploadContainer = styled.div`
  margin-top: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const UploadTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #00d4ff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequiredIndicator = styled.span`
  color: #ff4444;
  font-size: 1.2rem;
  margin-left: 0.25rem;
`;

const UploadArea = styled.div<{ isDragOver: boolean; hasFile: boolean }>`
  border: 2px dashed ${props => 
    props.isDragOver ? '#00d4ff' : 
    props.hasFile ? '#00ff88' : 
    'rgba(255, 255, 255, 0.3)'};
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => 
    props.isDragOver ? 'rgba(0, 212, 255, 0.1)' : 
    props.hasFile ? 'rgba(0, 255, 136, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'};
  
  &:hover {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #00d4ff;
`;

const UploadText = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: #aaaaaa;
  font-size: 0.9rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FileName = styled.div`
  color: #00ff88;
  font-weight: 600;
  font-size: 1rem;
`;

const FileSize = styled.div`
  color: #aaaaaa;
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid rgba(255, 68, 68, 0.5);
  color: #ff4444;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 68, 68, 0.3);
    border-color: #ff4444;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  color: #ff4444;
  text-align: center;
`;

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    error?: string;
    isRequired?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error, isRequired = false }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed'
        ];

        if (!allowedTypes.includes(file.type)) {
            onFileSelect(null);
            return;
        }

        const maxSizeBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            onFileSelect(null);
            return;
        }

        onFileSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleRemove = () => {
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <UploadContainer>
            <UploadTitle>
                📎 Upload Workshop Document
                {isRequired && <RequiredIndicator>*</RequiredIndicator>}
            </UploadTitle>
            
            <UploadArea
                isDragOver={isDragOver}
                hasFile={!!selectedFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {selectedFile ? (
                    <FileInfo>
                        <FileDetails>
                            <FileName>{selectedFile.name}</FileName>
                            <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                        </FileDetails>
                        <RemoveButton onClick={handleRemove}>
                            Remove
                        </RemoveButton>
                    </FileInfo>
                ) : (
                    <>
                        <UploadIcon>📁</UploadIcon>
                        <UploadText>Click to upload or drag and drop</UploadText>
                        <UploadSubtext>
                            PDF, DOC, DOCX, JPG, PNG, GIF, TXT, ZIP, RAR (Max 10MB)
                        </UploadSubtext>
                    </>
                )}
            </UploadArea>

            <FileInput
                ref={fileInputRef}
                type="file"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
            />

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </UploadContainer>
    );
};

export default FileUpload;

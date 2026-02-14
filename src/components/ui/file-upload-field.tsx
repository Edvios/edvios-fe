'use client';

import React, { useRef } from 'react';
import { Upload, FileCheck, X, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FileUploadFieldProps {
    id: string;
    label: string;
    required?: boolean;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    isUploading?: boolean;
    uploadProgress?: string;
    /** For single file: the uploaded URL string */
    value?: string;
    /** For multiple files: array of uploaded URL strings */
    values?: string[];
    hint?: string;
    onFileSelect: (files: FileList) => void;
    onRemove?: (index?: number) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
    id,
    label,
    required = false,
    accept = '.pdf,.jpg,.jpeg,.png,.webp',
    multiple = false,
    disabled = false,
    isUploading = false,
    uploadProgress,
    value,
    values,
    hint,
    onFileSelect,
    onRemove,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasUploadedFiles = multiple
        ? (values && values.length > 0)
        : !!value;

    const handleClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files);
        }
        // Reset input so the same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileName = (url: string) => {
        try {
            const parts = url.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        } catch {
            return 'Uploaded file';
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>

            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled || isUploading}
                onChange={handleChange}
                className="hidden"
            />

            {/* Upload Area */}
            {isUploading ? (
                <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-green-300 bg-green-50/50 p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    <span className="text-sm text-green-700">{uploadProgress || 'Uploading...'}</span>
                </div>
            ) : !hasUploadedFiles ? (
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 transition-all hover:border-green-400 hover:bg-green-50/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {hint || 'PDF, JPG, PNG (max 10MB)'}
                        </p>
                    </div>
                </button>
            ) : (
                <div className="space-y-2">
                    {/* Single file display */}
                    {!multiple && value && (
                        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileCheck className="h-4 w-4 shrink-0 text-green-600" />
                                <span className="truncate text-sm text-green-700">
                                    {getFileName(value)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                                    onClick={handleClick}
                                >
                                    Replace
                                </Button>
                                {onRemove && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                                        onClick={() => onRemove()}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Multiple files display */}
                    {multiple && values && values.length > 0 && (
                        <>
                            {values.map((url, index) => (
                                <div key={index} className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="h-4 w-4 shrink-0 text-green-600" />
                                        <span className="truncate text-sm text-green-700">
                                            {getFileName(url)}
                                        </span>
                                    </div>
                                    {onRemove && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 shrink-0 text-gray-400 hover:text-red-500"
                                            onClick={() => onRemove(index)}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleClick}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-2 text-sm text-gray-500 transition-all hover:border-green-400 hover:text-green-600"
                            >
                                <Upload className="h-4 w-4" />
                                Add more files
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUploadField;

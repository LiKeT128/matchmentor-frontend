import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Upload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { uploadReplay, uploading, uploadProgress, error } = useMatches();
    const navigate = useNavigate();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.dem')) {
            setSelectedFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            const result = await uploadReplay(selectedFile);
            navigate(`/results/${result.match_id}`);
        } catch {
            // Error is handled by the hook
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Upload Your Replay</h1>
                    <p className="text-xl text-gray-400">
                        Drop your .dem file to get detailed match analysis
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
            ${isDragging
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                        }
          `}
                >
                    <input
                        type="file"
                        accept=".dem"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    {selectedFile ? (
                        <div>
                            <p className="text-lg text-white font-medium mb-2">{selectedFile.name}</p>
                            <p className="text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg text-gray-300 mb-2">
                                Drag and drop your replay file here
                            </p>
                            <p className="text-gray-500">or click to browse</p>
                        </div>
                    )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                {selectedFile && !uploading && (
                    <button
                        onClick={handleUpload}
                        className="w-full mt-6 btn-primary py-4 text-lg"
                    >
                        Analyze Replay
                    </button>
                )}

                {uploading && (
                    <div className="mt-6 flex items-center justify-center gap-3 text-gray-400">
                        <LoadingSpinner size="sm" />
                        <span>Processing your replay...</span>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mt-12">
                    <div className="card">
                        <h3 className="font-semibold text-white mb-2">Supported Format</h3>
                        <p className="text-gray-400 text-sm">.dem files from Dota 2</p>
                    </div>
                    <div className="card">
                        <h3 className="font-semibold text-white mb-2">Max File Size</h3>
                        <p className="text-gray-400 text-sm">Up to 200MB per replay</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;

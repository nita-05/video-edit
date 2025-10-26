'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  User, 
  LogOut,
  Video,
  Music,
  Image,
  Scissors,
  Palette,
  Volume2,
  Layers,
  Zap,
  Brain,
  Sparkles,
  Mic,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { apiService, FileInfo, Project } from '../../lib/api';
import { useSession, signOut } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import RealAIDashboard from './real-ai-dashboard';

function DashboardContent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [aiTools, setAiTools] = useState([
    { id: 'scene-detection', name: 'Scene Detection', status: 'pending', progress: 0, icon: Layers, color: 'blue', description: 'AI-powered scene detection and thumbnails' },
    { id: 'auto-cut', name: 'Auto Cut', status: 'pending', progress: 0, icon: Scissors, color: 'green', description: 'Smart cutting at scene boundaries' },
    { id: 'color-grade', name: 'Color Grade', status: 'pending', progress: 0, icon: Palette, color: 'purple', description: 'Professional color correction' },
    { id: 'audio-enhancement', name: 'Audio Enhancement', status: 'pending', progress: 0, icon: Volume2, color: 'yellow', description: 'Noise reduction and normalization' },
    { id: 'subtitle-generation', name: 'Subtitle Generation', status: 'pending', progress: 0, icon: Mic, color: 'cyan', description: 'AI-generated subtitles' },
    { id: 'video-summarization', name: 'Video Summary', status: 'pending', progress: 0, icon: Brain, color: 'pink', description: 'AI video summarization' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [processingResult, setProcessingResult] = useState<string | null>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [videoSummary, setVideoSummary] = useState<any>(null);
  const [colorStats, setColorStats] = useState<any>(null);
  const [audioStats, setAudioStats] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { data: session } = useSession();

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await apiService.getProjects();
      if (response.projects.length > 0) {
        setCurrentProject(response.projects[0]);
        setUploadedFiles(response.projects[0].files || []);
      } else {
        // Create a new project
        const newProject = await apiService.createProject('New Project');
        setCurrentProject(newProject.project);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await apiService.uploadFile(file);
        
        const fileInfo: FileInfo = {
          ...response.file_info,
          type: file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'image',
          duration: '2:34', // Mock duration - in real app, extract from file
          resolution: '1080p' // Mock resolution - in real app, extract from file
        };
        
        setUploadedFiles(prev => [...prev, fileInfo]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      // Silent error handling
    } finally {
      setIsUploading(false);
    }
  };

  const startAIProcessing = async () => {
    if (uploadedFiles.length === 0) {
      // Silent validation
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);
    
    try {
      // Get the first video file
      const videoFile = uploadedFiles.find(file => file.type === 'video');
      if (!videoFile) {
        // Silent validation
        return;
      }

      // Process each AI tool
      const operations = ['auto_cut', 'color_grade', 'audio_enhancement'];
      
      for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        const toolIndex = aiTools.findIndex(tool => tool.id === operation.replace('_', '-'));
        
        if (toolIndex !== -1) {
          // Update tool status to processing
          setAiTools(prev => prev.map((tool, index) => 
            index === toolIndex 
              ? { ...tool, status: 'processing', progress: 0 }
              : tool
          ));
          
          // Simulate progress for UI feedback
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setAiTools(prev => prev.map((tool, index) => 
              index === toolIndex 
                ? { ...tool, progress }
                : tool
            ));
          }
          
          // Update tool status to completed
          setAiTools(prev => prev.map((tool, index) => 
            index === toolIndex 
              ? { ...tool, status: 'completed', progress: 100 }
              : tool
          ));
        }
      }

      // Process the video with all operations
      const result = await apiService.processVideo(videoFile.file_path, operations);
      
      if (result.success) {
        setProcessingResult(result.cloudinary_url || 'Processing completed successfully!');
        // Silent success
      } else {
        throw new Error(result.error || 'Processing failed');
      }
      
    } catch (error) {
      console.error('Processing failed:', error);
      // Silent error handling
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-xl">VEDIT</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">1080p</div>
            <div className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">24fps</div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            
            <div className="flex items-center space-x-2">
              <img 
                src={session?.user?.image || '/default-avatar.png'} 
                alt={session?.user?.name || 'User'} 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-300">{session?.user?.name || 'User'}</span>
              <div title="Logout">
                <LogOut 
                  className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" 
                  onClick={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Media Browser */}
        <motion.div 
          className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-lg">Media Library</h3>
            <label className="cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              <input
                type="file"
                multiple
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="space-y-3">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload your media files</p>
                <p className="text-sm">Videos</p>
              </div>
            ) : (
              uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                      {file.type === 'video' && <Video className="w-4 h-4 text-white" />}
                      {file.type === 'audio' && <Music className="w-4 h-4 text-white" />}
                      {file.type === 'image' && <Image className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium truncate">{file.filename}</div>
                      <div className="text-gray-400 text-xs">{file.duration} • {file.resolution}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {isUploading && (
              <div className="text-center py-4 text-blue-400">
                <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                <p className="text-sm">Uploading files...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Center Panel - Video Preview */}
        <motion.div 
          className="flex-1 bg-black relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-600 relative overflow-hidden max-w-2xl w-full mx-4"
              animate={{
                boxShadow: isProcessing ? [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(59, 130, 246, 0.6)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ] : "0 0 20px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{
                    scale: isProcessing ? [1, 1.1, 1] : 1,
                    boxShadow: isProcessing ? [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 30px rgba(59, 130, 246, 0.6)",
                      "0 0 20px rgba(59, 130, 246, 0.3)"
                    ] : "0 0 20px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{
                    duration: 2,
                    repeat: isProcessing ? Infinity : 0,
                  }}
                >
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </motion.div>
                
                <div className="text-white text-xl font-medium mb-2">
                  {isProcessing ? 'AI Processing Video...' : 'Ready to Edit'}
                </div>
                <div className="text-gray-400 text-sm mb-6">
                  {isProcessing ? 'Auto-cutting • Color grading • Audio sync' : 'Upload your media to get started'}
                </div>
                
                {processingResult && (
                  <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="text-green-400 text-sm font-medium mb-2">✅ Processing Complete!</div>
                    <div className="text-gray-300 text-sm">
                      Your video has been processed and is ready for download.
                    </div>
                    {processingResult.startsWith('http') && (
                      <a 
                        href={processingResult} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        View Processed Video
                      </a>
                    )}
                  </div>
                )}
                
                {!isProcessing && uploadedFiles.length > 0 && (
                  <motion.button
                    onClick={startAIProcessing}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start AI Processing
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Playback Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-4">
            <button className="text-white hover:text-blue-400 transition-colors">
              <Play className="w-4 h-4" />
            </button>
            <div className="text-white text-xs">0:00 / 2:34</div>
            <div className="w-32 h-1 bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ width: isProcessing ? "45%" : "0%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Panel - AI Tools */}
        <motion.div 
          className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-lg">AI Tools</h3>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            {aiTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 bg-${tool.color}-500 rounded-lg flex items-center justify-center`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{tool.name}</div>
                    <div className="flex items-center space-x-2">
                      {tool.status === 'processing' && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                      {tool.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-400" />}
                      {tool.status === 'pending' && <AlertCircle className="w-3 h-3 text-gray-400" />}
                      <span className={`text-xs capitalize ${
                        tool.status === 'processing' ? 'text-blue-400' :
                        tool.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r from-${tool.color}-500 to-${tool.color}-400 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${tool.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">{tool.progress}% complete</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div 
        className="bg-gray-900 border-t border-gray-700 p-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h3 className="text-white font-medium">Timeline</h3>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded"></div>
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <div className="w-2 h-2 bg-red-500 rounded"></div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">00:00:00:00</div>
        </div>
        
        <div className="bg-gray-800 rounded h-20 relative overflow-hidden">
          <div className="flex h-full">
            {[0, 1, 2, 3].map((track, i) => (
              <motion.div
                key={track}
                className="flex-1 border-r border-gray-700 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {track === 1 && (
                  <motion.div
                    className="absolute inset-y-2 left-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded"
                    animate={{ width: isProcessing ? "65%" : "0%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                )}
                {track === 2 && (
                  <motion.div
                    className="absolute inset-y-4 left-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 rounded"
                    animate={{ width: isProcessing ? "45%" : "0%" }}
                    transition={{ duration: 2, delay: 1.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Playhead */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
            animate={{ left: isProcessing ? "65%" : "0%" }}
            transition={{ duration: 3, delay: 2, repeat: isProcessing ? Infinity : 0, repeatType: "reverse" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <RealAIDashboard />
    </ProtectedRoute>
  );
}

'use client';



import React, { useState, useRef, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

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

  Loader2,

  MessageCircle,

  Share2,

  Users,

  Rocket,

  Send,

  Bot,

  Headphones,

  Calendar,

  Globe,

  Instagram,

  Youtube,

  Twitter,

  Linkedin,

  Facebook,

  Eye,

  Target,

  Heart,

  Shield,

  ImageIcon,

  RefreshCw as Compress,

  RefreshCw,

  Crop,

  Wand2,

  Move,

  Smile,

  Filter,

  Type,

  Type as Captions,

  Music2,

  VolumeX,

  Volume1,

  Volume2 as Volume2Icon,

  Mic2,

  Calendar as CalendarIcon,

  Globe as GlobeIcon,

  Instagram as InstagramIcon,

  Youtube as YoutubeIcon,

  Twitter as TwitterIcon,

  Linkedin as LinkedinIcon,

  Facebook as FacebookIcon,
  Check,
  X,
  Edit3
} from 'lucide-react';

import { useSession, signOut } from 'next-auth/react';

import ProtectedRoute from '../../components/ProtectedRoute';

import { API_BASE_URL } from '@/lib/api';



// Types

interface VideoClip {

  id: string;

  name: string;

  url: string;

  displayUrl?: string;

  startTime: number;

  endTime: number;

  duration: number;

  track: number;

  type: 'video' | 'audio' | 'image';

  effects?: string[];

  segments?: { start: number; end: number }[];

}



interface ChatMessage {

  id: string;

  type: 'user' | 'ai';

  content: string;

  timestamp: Date;

}



interface PublishingPlatform {

  id: string;

  name: string;

  icon: React.ReactNode;

  color: string;

  connected: boolean;

  scheduled: boolean;

}



interface VoiceProfile {

  id: string;

  name: string;

  voiceType: string;

  previewUrl?: string;

  isActive: boolean;

}



interface AIFeature {

  id: string;

  name: string;

  description: string;

  icon: React.ReactNode;

  color: string;

  enabled: boolean;

  category: 'video' | 'audio' | 'text' | 'effects' | 'advanced';

}



function RealAIDashboard() {

  // Session

  const { data: session } = useSession();

  

  // Main state

  const [activeTab, setActiveTab] = useState<'via' | 'editor' | 'vport' | 'profiles'>('editor');

  const [isProcessing, setIsProcessing] = useState(false);

  const [processingStep, setProcessingStep] = useState('');

  const [processingProgress, setProcessingProgress] = useState(0);

  const [jobId, setJobId] = useState<string | null>(null);

  

  // V-Editor state

  const [videoTracks, setVideoTracks] = useState<VideoClip[]>([]);

  // Load user data on mount and when session changes
  useEffect(() => {
    if (session?.user?.email) {
      // Load saved data from MongoDB
      fetch('/api/user-data')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            // Restore videoTracks if they exist
            if (data.data.videoTracks && Array.isArray(data.data.videoTracks)) {
              setVideoTracks(data.data.videoTracks);
            }
          }
        })
        .catch(err => console.error('Error loading user data:', err));
    }
  }, [session]);

  // Auto-save data when videoTracks change
  useEffect(() => {
    if (session?.user?.email && videoTracks.length > 0) {
      // Debounce save to avoid too frequent API calls
      const timeoutId = setTimeout(() => {
        fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { videoTracks } })
        }).catch(err => console.error('Error saving user data:', err));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [videoTracks, session]);

  const [selectedClipsForMerge, setSelectedClipsForMerge] = useState<string[]>([]);

  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  const [processedCaptionsUrl, setProcessedCaptionsUrl] = useState<string | null>(null);

  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const [burnInSubtitles, setBurnInSubtitles] = useState(true);

  const [titleFullOverlay, setTitleFullOverlay] = useState(false);

  const [filterPreset, setFilterPreset] = useState<string | null>(null);

  const [pendingTrimSeconds, setPendingTrimSeconds] = useState<number | null>(null);

  const [pendingFeatureIds, setPendingFeatureIds] = useState<string[]>([]);

  const [previewClipId, setPreviewClipId] = useState<string | null>(null);

  const [showEffectsPreview, setShowEffectsPreview] = useState(false);
  const [previewFrameOriginal, setPreviewFrameOriginal] = useState<string | null>(null);
  const [previewFrameWithEffects, setPreviewFrameWithEffects] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewCache, setPreviewCache] = useState<{
    enabledFeatures: string[];
    activeFilter: string | null;
    textOverlaysCount: number;
    hasPreview: boolean;
  }>({ enabledFeatures: [], activeFilter: null, textOverlaysCount: 0, hasPreview: false });
  
  // Text Editor state
  interface TextOverlay {
    id: string;
    text: string;
    position: 'top' | 'center' | 'bottom' | 'custom';
    fontSize: number;
    color: string;
    fontFamily: string;
    startTime: number;
    endTime: number;
    x: number;  // X coordinate (0-100%)
    y: number;  // Y coordinate (0-100%)
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    backgroundColor?: string;
    strokeWidth?: number;
    strokeColor?: string;
    highlight?: boolean;
    highlightColor?: string;
  }
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textEditorPreviewUrl, setTextEditorPreviewUrl] = useState<string | null>(null);
  const [currentTextEdit, setCurrentTextEdit] = useState<TextOverlay | null>(null);
  const [aiTextSuggestions, setAiTextSuggestions] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{feature: string, reason: string, confidence: string}[]>([]);
  const [backgroundMusic, setBackgroundMusic] = useState<string>('');
  const [musicVolume, setMusicVolume] = useState(50);
  const [suggestedMusic, setSuggestedMusic] = useState<string[]>([]);
  const [showMusicLibrary, setShowMusicLibrary] = useState(false);
  
  // Free music library from YouTube Audio Library
  const freeMusicLibrary = [
    { id: '1', name: 'Upbeat Corporate', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', mood: 'Energetic' },
    { id: '2', name: 'Cinematic Background', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', mood: 'Dramatic' },
    { id: '3', name: 'Happy Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', mood: 'Happy' },
    { id: '4', name: 'Relaxing Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', mood: 'Calm' },
    { id: '5', name: 'Tech & Modern', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', mood: 'Modern' }
  ];
  const applyClientHeuristicsFromText = (text: string) => {

    const t = (text || '').toLowerCase();

    const ids: string[] = [];

    const has = (k: string) => t.includes(k);

    if (has('subtitle') || has('captions')) {

      ids.push('subtitle-generation');

    }

    if (has('smart title') || has('title')) {

      ids.push('smart-titles');

      setTitleFullOverlay(true);

    }

    if (has('color correct') || has('color correction') || has('color')) {

      ids.push('color-correction');

    }

    if (has('brightness')) ids.push('auto-brightness');

    if (has('saturation')) ids.push('auto-saturation');

    if (has('vintage') || has('sepia')) setFilterPreset('vintage');

    if (has('cinematic') || has('teal and orange') || has('teal & orange')) setFilterPreset('cinematic');

    if (has('noir') || has('black and white') || has('b/w')) setFilterPreset('noir');

    if (has('burn in') || has('burn-in')) setBurnInSubtitles(true);

    // Trim Ns

    const m = t.match(/trim\s*(?:to\s*)?(\d+)\s*sec|trim\s*(\d+)\s*s/);

    const sec = m ? parseInt(m[1] || m[2] || '0', 10) : 0;

    if (sec > 0) setPendingTrimSeconds(sec);

    if (ids.length) {

      setPendingFeatureIds(prev => Array.from(new Set([...(prev || []), ...ids])));

      enableFeaturesByIds(ids);

    }

  };

  

  // VIA Chatbot state

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [chatInput, setChatInput] = useState('');

  const [isListening, setIsListening] = useState(false);

  const [viaChatSuggestions, setViaChatSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  

  // V-Port state

  const [isPublishing, setIsPublishing] = useState(false);

  const [publishingPlatforms, setPublishingPlatforms] = useState<PublishingPlatform[]>([

    { id: 'youtube', name: 'YouTube', icon: <YoutubeIcon className="w-5 h-5" />, color: 'text-red-500', connected: false, scheduled: false },

    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedinIcon className="w-5 h-5" />, color: 'text-blue-600', connected: false, scheduled: false }

    // Other platforms (TikTok, Instagram, Twitter, Facebook) can be added later

    // Just add credentials to .env.local and uncomment the lines below:

    // { id: 'tiktok', name: 'TikTok', icon: <Music className="w-5 h-5" />, color: 'text-black', connected: false, scheduled: false },

    // { id: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-5 h-5" />, color: 'text-pink-500', connected: false, scheduled: false },

    // { id: 'twitter', name: 'X (Twitter)', icon: <TwitterIcon className="w-5 h-5" />, color: 'text-gray-800', connected: false, scheduled: false },

    // { id: 'facebook', name: 'Facebook', icon: <FacebookIcon className="w-5 h-5" />, color: 'text-blue-600', connected: false, scheduled: false }

  ]);

  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  const [ytStatus, setYtStatus] = useState<{ connected: boolean; channelTitle?: string } | null>(null);

  

  // VIA Profiles state

  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([

    { id: 'default', name: 'Default Voice', voiceType: 'Natural', isActive: true, previewUrl: `${API_BASE_URL}/voice/sample/default.mp3` },

    { id: 'professional', name: 'Professional', voiceType: 'Business', isActive: false, previewUrl: `${API_BASE_URL}/voice/sample/professional.mp3` },

    { id: 'casual', name: 'Casual', voiceType: 'Friendly', isActive: false, previewUrl: `${API_BASE_URL}/voice/sample/casual.mp3` },

    { id: 'dramatic', name: 'Dramatic', voiceType: 'Theatrical', isActive: false, previewUrl: `${API_BASE_URL}/voice/sample/dramatic.mp3` }

  ]);

  const [isRecording, setIsRecording] = useState(false);

  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);

  

  // Real AI Features - All 35+ features with REAL implementations

  const [aiFeatures, setAiFeatures] = useState<AIFeature[]>([

    // Video Processing

    { id: 'scene-detection', name: 'Scene Detection', description: 'AI-powered scene detection and thumbnails', icon: <Layers className="w-5 h-5" />, color: 'blue', enabled: false, category: 'video' },

    { id: 'auto-cut', name: 'Auto Cut', description: 'Smart cutting at scene boundaries', icon: <Scissors className="w-5 h-5" />, color: 'green', enabled: false, category: 'video' },

    { id: 'auto-trim', name: 'Auto Trim', description: 'Intelligent video trimming', icon: <Crop className="w-5 h-5" />, color: 'green', enabled: false, category: 'video' },

    { id: 'smart-cropping', name: 'Smart Cropping', description: 'AI-powered smart cropping', icon: <Crop className="w-5 h-5" />, color: 'purple', enabled: false, category: 'video' },

    { id: 'motion-tracking', name: 'Motion Tracking', description: 'Track objects and faces', icon: <Target className="w-5 h-5" />, color: 'blue', enabled: false, category: 'video' },

    { id: 'stabilization', name: 'Stabilization', description: 'Video stabilization', icon: <RefreshCw className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'video' },

    { id: 'auto-zoom', name: 'Auto Zoom', description: 'Intelligent zoom effects', icon: <Move className="w-5 h-5" />, color: 'purple', enabled: false, category: 'video' },

    { id: 'auto-pan', name: 'Auto Pan', description: 'Smart panning effects', icon: <Move className="w-5 h-5" />, color: 'purple', enabled: false, category: 'video' },

    

    // 🎬 VIDEO EDITING (Essential controls)
    { id: 'auto-cut', name: 'Auto Cut', description: 'Smart scene cuts', icon: <Scissors className="w-5 h-5" />, color: 'red', enabled: false, category: 'video' },
    { id: 'auto-trim', name: 'Auto Trim', description: 'Trim to best parts', icon: <Scissors className="w-5 h-5" />, color: 'red', enabled: false, category: 'video' },
    { id: 'stabilization', name: 'Stabilization', description: 'Remove camera shake', icon: <Target className="w-5 h-5" />, color: 'blue', enabled: false, category: 'video' },
    
    // ✨ VISUAL ADJUSTMENTS (Essential effects)
    { id: 'auto-brightness', name: 'Brightness', description: 'Adjust brightness', icon: <Palette className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'auto-contrast', name: 'Contrast', description: 'Enhance contrast', icon: <Palette className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'auto-saturation', name: 'Saturation', description: 'Vibrant colors', icon: <Palette className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'quality-enhancement', name: 'Sharpness', description: 'Crystal clear quality', icon: <Wand2 className="w-5 h-5" />, color: 'purple', enabled: false, category: 'effects' },
    { id: 'noise-reduction', name: 'Noise Reduction', description: 'Remove grain and noise', icon: <Wand2 className="w-5 h-5" />, color: 'purple', enabled: false, category: 'effects' },
    
    // 🎨 FILTERS (VEDIT Filter Collection)
    { id: 'normal', name: 'Normal', description: 'No filter - clean look', icon: <Filter className="w-5 h-5" />, color: 'gray', enabled: false, category: 'effects' },
    { id: 'cinematic', name: 'Cinematic', description: 'Teal & Orange movie look', icon: <Filter className="w-5 h-5" />, color: 'purple', enabled: false, category: 'effects' },
    { id: 'vintage', name: 'Vintage', description: 'Warm nostalgic retro', icon: <Filter className="w-5 h-5" />, color: 'orange', enabled: false, category: 'effects' },
    { id: 'noir', name: 'Noir', description: 'Black & white dramatic', icon: <Filter className="w-5 h-5" />, color: 'gray', enabled: false, category: 'effects' },
    { id: 'fade', name: 'Fade', description: 'Soft muted pastels', icon: <Filter className="w-5 h-5" />, color: 'blue', enabled: false, category: 'effects' },
    { id: 'fade-warm', name: 'Fade Warm', description: 'Soft warm pastels', icon: <Filter className="w-5 h-5" />, color: 'orange', enabled: false, category: 'effects' },
    { id: 'cool', name: 'Cool', description: 'Cool blue tones', icon: <Filter className="w-5 h-5" />, color: 'cyan', enabled: false, category: 'effects' },
    { id: 'warm', name: 'Warm', description: 'Warm golden tones', icon: <Filter className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'graphite', name: 'Graphite', description: 'Cool metallic gray', icon: <Filter className="w-5 h-5" />, color: 'gray', enabled: false, category: 'effects' },
    { id: 'simple', name: 'Simple', description: 'Minimal clean look', icon: <Filter className="w-5 h-5" />, color: 'gray', enabled: false, category: 'effects' },
    { id: 'paris', name: 'Paris', description: 'Elegant sophisticated', icon: <Filter className="w-5 h-5" />, color: 'pink', enabled: false, category: 'effects' },
    { id: 'los-angeles', name: 'Los Angeles', description: 'Vibrant sunny LA vibes', icon: <Filter className="w-5 h-5" />, color: 'orange', enabled: false, category: 'effects' },
    { id: 'moody', name: 'Moody', description: 'Dramatic dark tones', icon: <Filter className="w-5 h-5" />, color: 'gray', enabled: false, category: 'effects' },
    { id: 'bright', name: 'Bright', description: 'Fresh bright & airy', icon: <Filter className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'portrait', name: 'Portrait', description: 'Perfect skin tones', icon: <Filter className="w-5 h-5" />, color: 'pink', enabled: false, category: 'effects' },
    
    // 📝 TEXT & CAPTIONS
    { id: 'add-text', name: 'Text Overlay', description: 'Add text anywhere (AI suggested)', icon: <Type className="w-5 h-5" />, color: 'cyan', enabled: false, category: 'text' },
    { id: 'auto-captions', name: 'Auto Captions', description: 'AI-generated subtitles', icon: <Captions className="w-5 h-5" />, color: 'cyan', enabled: false, category: 'text' },
    
    // 🎵 AUDIO
    { id: 'auto-music', name: 'Background Music', description: 'AI mood suggestions', icon: <Music2 className="w-5 h-5" />, color: 'purple', enabled: false, category: 'audio' },
    { id: 'audio-enhancement', name: 'Audio Enhance', description: 'Noise reduction & clarity', icon: <Volume2 className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'audio' },
    { id: 'remove-background-noise', name: 'Remove Noise', description: 'Clean audio quality', icon: <VolumeX className="w-5 h-5" />, color: 'red', enabled: false, category: 'audio' }
  ]);



  // Refs

  const videoRef = useRef<HTMLVideoElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);



  // Auto-scroll chat

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [chatMessages]);



  // Auto-generate AI suggestions when videos are uploaded or VIA tab is active

  useEffect(() => {

    if (videoTracks.length > 0 && activeTab === 'via') {

      generateAISuggestions();

    }

  }, [videoTracks.length, activeTab]);



  // Poll for job status

  useEffect(() => {

    if (jobId && isProcessing) {

      const interval = setInterval(async () => {

        try {

          const response = await fetch(`${API_BASE_URL}/status/${jobId}`);

          const status = await response.json();

          

          setProcessingStep(status.status || 'Processing...');

          setProcessingProgress(status.progress || 0);

          

          if (status.status === 'COMPLETED' && status.result) {

            setProcessedVideoUrl(status.result.processed_video_url);

            
            // Update the clip's display URL to show the processed video instead of original
            setVideoTracks(prev =>
              prev.map(clip =>
                clip.type === 'video'
                  ? { ...clip, displayUrl: status.result.processed_video_url, url: status.result.processed_video_url }
                  : clip
              )
            );
            
            if (status.result.captions_url) {

              setProcessedCaptionsUrl(`${API_BASE_URL}${status.result.captions_url}`);

            } else {

              setProcessedCaptionsUrl(null);

            }

            setIsProcessing(false);

            setShowProcessingModal(false);

            setJobId(null);

            clearInterval(interval);

          } else if (status.status === 'FAILED') {

            console.error('Processing failed:', status.error);

            setIsProcessing(false);

            setShowProcessingModal(false);

            setJobId(null);

            clearInterval(interval);

          }

        } catch (error) {

          console.error('Error checking job status:', error);

        }

      }, 2000);

      

      return () => clearInterval(interval);

    }

  }, [jobId, isProcessing]);



  // VIA Chatbot functions

  const enableFeaturesByIds = (featureIds: string[]) => {

    if (!featureIds || featureIds.length === 0) return;

    setAiFeatures(prev => prev.map(f => featureIds.includes(f.id) ? { ...f, enabled: true } : f));

  };



  const trimFirstSelectedOrFirstClip = (seconds: number) => {

    if (!seconds || seconds <= 0) return;

    setVideoTracks(prev => {

      if (prev.length === 0) return prev;

      const targetId = selectedClipsForMerge[0] || prev[0].id;

      return prev.map(c => {

        if (c.id !== targetId) return c;

        const newEnd = Math.min(seconds, c.duration || seconds);

        return { ...c, startTime: 0, endTime: newEnd };

      });

    });

    if (selectedClipsForMerge.length === 0 && videoTracks.length > 0) {

      setSelectedClipsForMerge([videoTracks[0].id]);

    }

  };



  const applyAssistantIntent = (intent: any) => {

    if (!intent) return;

    let requestedStart = false;

    if (intent.enable_features && Array.isArray(intent.enable_features)) {

      const ids = intent.enable_features as string[];

      enableFeaturesByIds(ids);

      // Keep a pending list for this run to avoid state race

      setPendingFeatureIds(prev => Array.from(new Set([...(prev || []), ...ids])));

    }

    // Exact trim range

    if (intent.trim_range && typeof intent.trim_range.start === 'number' && typeof intent.trim_range.end === 'number') {

      setVideoTracks(prev => {

        if (prev.length === 0) return prev;

        const targetId = selectedClipsForMerge[0] || prev[0].id;

        return prev.map(c => c.id === targetId ? { ...c, startTime: intent.trim_range.start, endTime: intent.trim_range.end } : c);

      });

      if (selectedClipsForMerge.length === 0 && videoTracks.length > 0) setSelectedClipsForMerge([videoTracks[0].id]);

    }

    // Multi segments

    if (intent.trim_segments && Array.isArray(intent.trim_segments) && intent.trim_segments.length > 0) {

      setVideoTracks(prev => {

        if (prev.length === 0) return prev;

        const targetId = selectedClipsForMerge[0] || prev[0].id;

        return prev.map(c => c.id === targetId ? { ...c, segments: intent.trim_segments } : c);

      });

      if (selectedClipsForMerge.length === 0 && videoTracks.length > 0) setSelectedClipsForMerge([videoTracks[0].id]);

    }

    if (!intent.trim_segments && !intent.trim_range) {

      if (intent.trim_to_duration && typeof intent.trim_to_duration.duration === 'number') {

        trimFirstSelectedOrFirstClip(intent.trim_to_duration.duration);

        setPendingTrimSeconds(intent.trim_to_duration.duration);

      }

    }

    if (intent.burn_in_subtitles === true) {

      setBurnInSubtitles(true);

    }

    if (intent.title_full_overlay === true) {

      setTitleFullOverlay(true);

    }

    if (intent.filter_preset) {

      setFilterPreset(String(intent.filter_preset));

    }

    if (intent.start_processing) {

      requestedStart = true;

    }

    // Give state updates a moment to flush before starting

    if (requestedStart) setTimeout(() => handleAIMerge(), 250);

  };



  const handleSendMessage = async () => {

    if (!chatInput.trim()) return;

    

    const userMessage: ChatMessage = {

      id: Date.now().toString(),

      type: 'user',

      content: chatInput,

      timestamp: new Date()

    };

    

    setChatMessages(prev => [...prev, userMessage]);

    setChatInput('');

    

    // Apply quick client heuristics so features are set even if intent parsing is delayed

    applyClientHeuristicsFromText(chatInput);

    // Real AI response using OpenAI

    try {

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ message: chatInput })

      });

      

      const data = await response.json();

      

      const aiMessage: ChatMessage = {

        id: (Date.now() + 1).toString(),

        type: 'ai',

        content: data.response || 'I understand your request. Let me help you with that!',

        timestamp: new Date()

      };

      setChatMessages(prev => [...prev, aiMessage]);



      // Apply any returned assistant intent (actions)

      if (data.intent) {

        applyAssistantIntent(data.intent);

        
        // Add a system message showing what features were enabled
        const enabledFeatures = data.intent.enable_features || [];
        if (enabledFeatures.length > 0) {
          const systemMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `✅ Enabled: ${enabledFeatures.map((f: string) => f.replace(/-/g, ' ')).join(', ')}. Check the AI Features panel on the right! →`,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, systemMessage]);
          
          // Auto-switch to editor tab to see the enabled features
          setTimeout(() => setActiveTab('editor'), 1000);
        }
        
        // Show if processing will start
        if (data.intent.start_processing) {
          const startMessage: ChatMessage = {
            id: (Date.now() + 3).toString(),
            type: 'ai',
            content: `🚀 Starting AI processing now...`,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, startMessage]);
        }
      }

    } catch (error) {

      console.error('Chat error:', error);

      const aiMessage: ChatMessage = {

        id: (Date.now() + 1).toString(),

        type: 'ai',

        content: 'I understand your request. Let me help you with that!',

        timestamp: new Date()

      };

      setChatMessages(prev => [...prev, aiMessage]);

    }

  };



  const handleVoiceCommand = () => {

    setIsListening(!isListening);

    // Voice recognition would be implemented here

  };



  const generateAISuggestions = async () => {

    setIsGeneratingSuggestions(true);

    try {

      const response = await fetch(`${API_BASE_URL}/ai/suggestions`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ videoCount: videoTracks.length })

      });

      

      const data = await response.json();

      setViaChatSuggestions(data.suggestions || []);
    } catch (error) {

      console.error('Error generating suggestions:', error);

      setViaChatSuggestions(['Error generating suggestions. Please try again.']);
    } finally {

      setIsGeneratingSuggestions(false);

    }

  };



  // V-Port functions

  const isPlatformConnected = (platformId: string) => {

    if (platformId === 'youtube') return !!ytStatus?.connected;

    return false; // others pending real OAuth wiring

  };



  const connectPlatform = async (platformId: string) => {

    try {

      // Map platform IDs to backend endpoints

      const platformEndpoints: Record<string, string> = {

        'youtube': 'youtube',

        'tiktok': 'tiktok',

        'instagram': 'instagram',

        'linkedin': 'linkedin',

        'twitter': 'twitter',

        'facebook': 'instagram' // Facebook uses Instagram API

      };

      

      const endpoint = platformEndpoints[platformId];

      if (!endpoint) {

        alert(`Platform ${platformId} is not yet supported.`);

        return;

      }

      

      const res = await fetch(`${API_BASE_URL}/vport/connect/${endpoint}`);

      const data = await res.json();

      

      if (data.auth_url) {

        // Open OAuth in same window so callback can redirect back

        window.location.href = data.auth_url;

      } else if (data.error) {

        alert(`Connection error: ${data.error}`);

      }

    } catch (e) {

      console.error(e);

      alert(`Failed to connect to ${platformId}. Make sure the backend is running and credentials are configured.`);

    }

  };



  useEffect(() => {

    // Check for OAuth callback success in URL

    const urlParams = new URLSearchParams(window.location.search);

    const youtubeConnected = urlParams.get('youtube') === 'connected';

    const tiktokConnected = urlParams.get('tiktok') === 'connected';

    const instagramConnected = urlParams.get('instagram') === 'connected';

    const linkedinConnected = urlParams.get('linkedin') === 'connected';

    const twitterConnected = urlParams.get('twitter') === 'connected';

    

    if (youtubeConnected || tiktokConnected || instagramConnected || linkedinConnected || twitterConnected) {

      // Show success message

      const platform = youtubeConnected ? 'YouTube' : 

                       tiktokConnected ? 'TikTok' : 

                       instagramConnected ? 'Instagram' : 

                       linkedinConnected ? 'LinkedIn' : 'Twitter';

      alert(`✅ Successfully connected to ${platform}!`);

      

      // Clean URL

      window.history.replaceState({}, document.title, window.location.pathname);

    }

    

    // Fetch connection status for all platforms

    const fetchStatus = async () => {

      try {

        const r = await fetch(`${API_BASE_URL}/vport/status/youtube`);

        const j = await r.json();

        setYtStatus(j);

      } catch (e) {

        setYtStatus({ connected: false });

      }

    };

    fetchStatus();

  }, []);



  const schedulePost = async (platformId: string, content: any) => {

    try {

      const response = await fetch(`${API_BASE_URL}/vport/schedule`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ platform: platformId, content })

      });

      

      const data = await response.json();

      if (data.success) {

        const platform = publishingPlatforms.find(p => p.id === platformId);

        if (platform) {

          const scheduledPost = {

            id: Date.now().toString(),

            platform: platform.name,

            content,

            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),

            status: 'scheduled'

          };

          setScheduledPosts(prev => [...prev, scheduledPost]);

        }

      }

    } catch (error) {

      console.error('Error scheduling post:', error);

    }

  };



  // VIA Profiles functions

  const generateVoiceProfile = async (profileId: string) => {

    const text = prompt('Enter text to generate voice sample:');

    if (!text || !text.trim()) return;

    

    setIsGeneratingVoice(true);

    try {

      const profile = voiceProfiles.find(p => p.id === profileId);

      if (!profile) throw new Error('Profile not found');

      

      // Map profile IDs to OpenAI voice names

      const voiceMap: Record<string, string> = {

        'default': 'alloy',

        'professional': 'echo',

        'casual': 'nova',

        'dramatic': 'onyx'

      };

      

      const response = await fetch(`${API_BASE_URL}/voice/tts`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ 

          text: text.trim(), 

          voice: voiceMap[profileId] || 'alloy',

          language: 'en-US',

          style: 'professional'

        })

      });

      

      const data = await response.json();

      if (data.success && data.voiceUrl) {

        setVoiceProfiles(prev => 

          prev.map(p => p.id === profileId ? { ...p, previewUrl: data.voiceUrl } : p)

        );

        // Auto-play the generated sample

        const audio = new Audio(data.voiceUrl);

        audio.play().catch(err => console.error('Error playing audio:', err));

      } else {

        alert('Failed to generate voice sample: ' + (data.error || 'Unknown error'));

      }

    } catch (error: any) {

      console.error('Error generating voice:', error);

      alert('Error generating voice sample: ' + error.message);

    } finally {

      setIsGeneratingVoice(false);

    }

  };



  const activateVoiceProfile = (profileId: string) => {

    setVoiceProfiles(prev => 

      prev.map(p => ({ ...p, isActive: p.id === profileId }))

    );

  };



  // V-Editor functions

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;

    if (!files) return;



    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      

      // Create local blob URL for immediate display

      const blobUrl = URL.createObjectURL(file);



      // Insert immediately with blob for display; url will be updated after upload

      const tempId = `clip_${Date.now()}_${i}`;

      const tempClip: VideoClip = {

        id: tempId,

        name: file.name,

        url: blobUrl,

        displayUrl: blobUrl,

        startTime: 0,

        endTime: 10,

        duration: 10,

        track: 0,

        type: file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'image'

      };

      setVideoTracks(prev => [...prev, tempClip]);

      

      // Auto-select the newly added clip

      setSelectedClipsForMerge(prev => [...prev, tempId]);

      
      // ⚡ AUTO-APPLY AI ADJUSTMENTS (VEDIT's Auto-Enhance)
      setAiFeatures(prev => prev.map(f => {
        if (['auto-brightness', 'auto-contrast', 'auto-saturation', 'quality-enhancement'].includes(f.id)) {
          return {...f, enabled: true};
        }
        return f;
      }));


      // Upload to backend for processing - REQUIRED; then patch the clip's url

      try {

        const formData = new FormData();

        formData.append('file', file);

        console.log('Uploading file to server:', file.name);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {

          method: 'POST',

          body: formData

        });

        if (uploadResponse.ok) {

          const uploadData = await uploadResponse.json();

          const serverUrl = uploadData.secure_url;

          setVideoTracks(prev => prev.map(c => c.id === tempId ? { ...c, url: serverUrl } : c));

          console.log('Upload successful, server URL:', serverUrl);

        } else {

          console.error('Upload failed:', uploadResponse.status, uploadResponse.statusText);

          alert('Failed to upload file to server. Please try again.');

          // Keep the clip visible, but backend processing will fail until re-uploaded

        }

      } catch (error) {

        console.error('Upload to server failed:', error);

        alert('Failed to upload file to server. Please try again.');

      }

    }

  };



  const handleAIMerge = async () => {

    if (selectedClipsForMerge.length < 1) {

      if (videoTracks.length >= 1) {

        const autoSelectedClips = videoTracks.slice(0, 1).map(clip => clip.id);

        setSelectedClipsForMerge(autoSelectedClips);

      } else {

        alert('Please upload at least 1 video clip first');

        return;

      }

    }



    // Make a working copy to avoid state race conditions

    let workingTracks = [...videoTracks];



    // Pre-flight: upload any selected clips that still have blob URLs

    try {

      const selectedIds = (selectedClipsForMerge.length > 0

        ? selectedClipsForMerge

        : (videoTracks[0] ? [videoTracks[0].id] : []));

      const toUpload = videoTracks.filter(

        clip => selectedIds.includes(clip.id) && clip.url.startsWith('blob:')

      );

      for (const clip of toUpload) {

        const localUrl = clip.displayUrl || clip.url;

        const res = await fetch(localUrl);

        const blob = await res.blob();

        const formData = new FormData();

        formData.append('file', new File([blob], clip.name, { type: blob.type || 'video/mp4' }));

        const up = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });

        if (!up.ok) {

          const t = await up.text();

          throw new Error(`upload failed: ${t}`);

        }

        const data = await up.json();

        const serverUrl = data.secure_url;

        // Update state and our working copy

        setVideoTracks(prev => prev.map(c => c.id === clip.id ? { ...c, url: serverUrl } : c));

        workingTracks = workingTracks.map(c => c.id === clip.id ? { ...c, url: serverUrl } : c);

      }

    } catch (e) {

      console.error('Pre-upload failed:', e);

      alert('Upload failed. Please ensure the backend is running and try again.');

      return;

    }



    setIsProcessing(true);

    setShowProcessingModal(true);

    setProcessingStep('Starting AI processing...');

    setProcessingProgress(0);



    try {

      const enabledFeatures = aiFeatures.filter(f => f.enabled);

      const enabledIdsFromState = new Set(enabledFeatures.map(f => f.id));

      const enabledIds = new Set([...

        Array.from(enabledIdsFromState),

        ...(pendingFeatureIds || [])

      ]);

      // Ensure core effects when related options are chosen

      if (filterPreset) {

        enabledIds.add('color-correction');

      }

      if (titleFullOverlay) {

        enabledIds.add('smart-titles');

      }

      if (burnInSubtitles) {

        enabledIds.add('subtitle-generation');

      }

      const selectedIds = (selectedClipsForMerge.length > 0

        ? selectedClipsForMerge

        : (workingTracks[0] ? [workingTracks[0].id] : []));

      let clips = workingTracks.filter(clip => selectedIds.includes(clip.id));

      // Enforce pending trim seconds if set

      if (pendingTrimSeconds && clips.length > 0) {

        const secs = Math.max(0, pendingTrimSeconds);

        clips = clips.map(c => ({

          ...c,

          startTime: 0,

          endTime: Math.min(secs, c.duration || secs)

        }));

      }

      

      const requestData = {

        clips: clips.map(clip => ({

          id: clip.id,

          url: clip.url,

          startTime: clip.startTime,

          endTime: clip.endTime,

          duration: clip.duration,

          segments: clip.segments

        })),

        settings: {

          ...Array.from(enabledIds).reduce((acc, id) => {

            acc[id] = true;

            return acc;

          }, {} as Record<string, boolean>),

          burnInSubtitles: burnInSubtitles,

          titleFullOverlay: titleFullOverlay,

          filterPreset: filterPreset || undefined,

          requestedTrimSeconds: pendingTrimSeconds || undefined,

          testMode: false // Real AI processing

        },
        textOverlays: textOverlays,
        backgroundMusic: backgroundMusic || undefined,
        musicVolume: musicVolume || 50
      };



      console.log('Sending AI merge request:', requestData);



      const performMerge = async (attempt: number): Promise<void> => {

        try {

          const res = await fetch(`${API_BASE_URL}/ai/merge`, {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify(requestData)

          });

          if (!res.ok) {

            let msg = '';

            try { const ed = await res.json(); msg = ed.error || ''; } catch {}

            throw new Error(msg || `HTTP ${res.status}: ${res.statusText}`);

          }

          const data = await res.json();

          if (data.job_id) {

            setJobId(data.job_id);

            return;

          }

          throw new Error('No job ID returned');

        } catch (e) {

          if (attempt === 0) {

            console.warn('Merge start failed, retrying once...', e);

            await new Promise(r => setTimeout(r, 800));

            return performMerge(1);

          }

          throw e;

        }

      };



      await performMerge(0);

      setPendingFeatureIds([]);

      if (pendingTrimSeconds) setPendingTrimSeconds(null);

    } catch (error) {

      console.error('AI merge error:', error);

      setIsProcessing(false);

      setShowProcessingModal(false);

      alert('Error starting AI processing. Please try again.');

    }

  };



  const toggleAIFeature = (featureId: string) => {

    setAiFeatures(prev => 

      prev.map(f => f.id === featureId ? { ...f, enabled: !f.enabled } : f)

    );

    
    // If preview is open, regenerate with new features after a short delay
    if (showEffectsPreview) {
      setTimeout(() => {
        console.log('🔄 Feature toggled, regenerating preview...');
        handleGeneratePreview();
      }, 500);
    }
  };

  // Preview Effects Generation
  const handleGeneratePreview = async () => {
    if (videoTracks.length === 0) {
      alert('Please upload a video or image first');
      return;
    }
    
    // Get the first clip (video or image)
    const clip = videoTracks[0];
    
    // Collect enabled AI features
    const enabledIds = new Set(
      aiFeatures.filter(f => f.enabled).map(f => f.id)
    );
    
    // Determine which filter is active from enabled features (check all 15 filters)
    let activeFilter = null;
    const filterOrder = ['normal', 'cinematic', 'vintage', 'noir', 'fade', 'fade-warm', 'cool', 'warm', 
                         'graphite', 'simple', 'paris', 'los-angeles', 'moody', 'bright', 'portrait'];
    for (const filterId of filterOrder) {
      if (enabledIds.has(filterId)) {
        activeFilter = filterId;
        break; // Take first enabled filter
      }
    }
    
    // Check if we need to regenerate based on what changed
    const currentEnabledFeatures = Array.from(enabledIds).sort().join(',');
    const currentTextOverlaysCount = textOverlays.length;
    const currentActiveFilter = activeFilter;
    
    const hasChanged = 
      previewCache.enabledFeatures.join(',') !== currentEnabledFeatures ||
      previewCache.activeFilter !== currentActiveFilter ||
      previewCache.textOverlaysCount !== currentTextOverlaysCount ||
      !previewCache.hasPreview;
    
    // If nothing changed and we have preview, just show it
    if (!hasChanged && previewFrameOriginal && previewFrameWithEffects) {
      console.log('✅ Using cached preview:', { original: previewFrameOriginal?.substring(0, 50), withEffects: previewFrameWithEffects?.substring(0, 50) });
      setIsGeneratingPreview(false);
      setTimeout(() => setShowEffectsPreview(true), 0);
      return;
    }
    
    console.log('🔄 Regenerating preview:', { hasChanged, hasOriginal: !!previewFrameOriginal, hasEffects: !!previewFrameWithEffects });
    
    // Otherwise, regenerate
    setIsGeneratingPreview(true);
    setShowEffectsPreview(true);
    
    try {
      
      const settings = Array.from(enabledIds).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      // Upload to backend if still a blob URL
      let mediaUrl = clip.url;
      if (clip.url.startsWith('blob:')) {
        console.log('📤 Uploading blob for preview...');
        const response = await fetch(clip.url);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', new File([blob], clip.name, { type: blob.type || clip.type }));
        
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.secure_url;
        console.log('✅ Uploaded:', mediaUrl);
      }
      
      if (clip.type === 'image') {
        // Set original preview for images
        setPreviewFrameOriginal(mediaUrl);
        // For images: process entire image with effects AND text overlays
        const response = await fetch(`${API_BASE_URL}/ai/process-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: mediaUrl,
            textOverlays: textOverlays, // Include saved text overlays!
            filterPreset: activeFilter, // Use detected filter from enabled features
            settings: settings
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setPreviewFrameWithEffects(data.processedUrl);
          // Update cache after successful generation
          setPreviewCache({
            enabledFeatures: Array.from(enabledIds).sort(),
            activeFilter: activeFilter,
            textOverlaysCount: textOverlays.length,
            hasPreview: true
          });
        } else {
          setPreviewFrameWithEffects(mediaUrl);
        }
      } else {
        // For videos: extract original frame first, then apply effects
        console.log('🎬 Extracting video frames...');
        
        // Extract original frame
        const originalResponse = await fetch(`${API_BASE_URL}/ai/extract-video-frame`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoUrl: mediaUrl
          })
        });
        
        const originalData = await originalResponse.json();
        if (originalData.success) {
          setPreviewFrameOriginal(originalData.frameUrl);
          console.log('✅ Original frame extracted');
        }
        
        // Extract frame and apply effects
        const effectsResponse = await fetch(`${API_BASE_URL}/ai/preview-video-frame`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoUrl: mediaUrl,
            filterPreset: activeFilter, // Use detected filter from enabled features
            settings: settings,
            textOverlays: textOverlays // Include text overlays for preview!
          })
        });
        
        const effectsData = await effectsResponse.json();
        if (effectsData.success) {
          setPreviewFrameWithEffects(effectsData.processedUrl);
          console.log('✅ Video frame preview generated with real effects!');
          // Update cache after successful generation
          setPreviewCache({
            enabledFeatures: Array.from(enabledIds).sort(),
            activeFilter: activeFilter,
            textOverlaysCount: textOverlays.length,
            hasPreview: true
          });
        } else {
          console.error('Preview generation failed:', effectsData.error);
          setPreviewFrameWithEffects(clip.displayUrl || clip.url);
        }
      }
      
    } catch (error) {
      console.error('Preview generation error:', error);
      alert('Failed to generate preview. The video might be too large or in an incompatible format.');
      setPreviewFrameWithEffects(videoTracks[0].displayUrl || videoTracks[0].url);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Text Editor Functions
  const handleAddText = () => {
    const clip = videoTracks[0];
    const isImage = clip?.type === 'image';
    
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Your Text Here',
      position: 'custom',  // Always use custom positioning (VEDIT-style)
      fontSize: 48,
      color: '#FFFFFF',
      fontFamily: 'Arial',
      startTime: isImage ? 0 : 0,
      endTime: isImage ? 999 : (clip?.duration || 5),
      x: 50,  // Center X (0-100%)
      y: 50,  // Center Y (0-100%)
      bold: false,
      italic: false,
      underline: false,
      backgroundColor: 'transparent',
      strokeWidth: 2,
      strokeColor: '#000000',
      highlight: false,
      highlightColor: '#FFFF00'
    };
    setCurrentTextEdit(newText);
    setShowTextEditor(true);
  };

  const handleDeleteText = (id: string) => {
    setTextOverlays(prev => prev.filter(t => t.id !== id));
  };

  // AI Smart Analysis with Detailed Suggestions
  const handleAIAnalysis = async () => {
    if (videoTracks.length === 0) {
      alert('Please upload a video or image first');
      return;
    }
    
    setIsAnalyzing(true);
    setShowAIOptions(false);
    
    try {
      const clip = videoTracks[0];
      
      // Upload to backend if still a blob URL
      let mediaUrl = clip.url;
      if (clip.url.startsWith('blob:')) {
        console.log('📤 Uploading blob to backend for AI analysis...');
        const response = await fetch(clip.url);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', new File([blob], clip.name, { type: blob.type || 'image/jpeg' }));
        
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.secure_url;
        console.log('✅ Uploaded to Cloudinary:', mediaUrl);
      }
      
      const response = await fetch(`${API_BASE_URL}/ai/analyze-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: mediaUrl,
          mediaType: clip.type
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAiAnalysis(data.reasoning);
        setSuggestedFeatures(data.suggestedFeatures || []);
        
        // Create detailed suggestions with reasons
        const detailedSuggestions = (data.suggestedFeatures || []).map((feature: string) => {
          const reasons: Record<string, string> = {
            'auto-brightness': 'Your video/image appears dark. Increasing brightness will make it more visible.',
            'auto-contrast': 'Low contrast detected. Enhancing contrast will make details pop.',
            'auto-saturation': 'Colors look dull. Boosting saturation will make them more vibrant.',
            'color-correction': 'Color balance needs adjustment for a professional look.',
            'cinematic': 'Apply cinematic color grading for a film-like aesthetic.',
            'vintage': 'Add vintage effect for a nostalgic, warm feel.',
            'quality-enhancement': 'Sharpen details for crystal-clear quality.',
            'stabilization': 'Video shows camera shake. Stabilization will smooth it out.',
            'noise-reduction': 'Background noise detected. Cleaning it will improve audio quality.',
          };
          
          return {
            feature: feature.replace(/-/g, ' ').toUpperCase(),
            reason: reasons[feature] || 'Recommended for better quality',
            confidence: ['auto-brightness', 'auto-contrast'].includes(feature) ? 'High' : 'Medium'
          };
        });
        
        setAiSuggestions(detailedSuggestions);
        setShowAIOptions(true);
        
        // Show analysis in chat
        const analysisMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: `🔍 AI Professional Analysis Complete!\n\n${data.reasoning}\n\n💡 ${detailedSuggestions.length} Improvements Recommended!\n\nCheck the Editor tab to see suggestions with options.`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, analysisMessage]);
        
        // Auto-switch to Editor tab to see the options
        setActiveTab('editor');
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      alert('Failed to analyze media. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-Apply All AI Suggestions
  const handleAutoApplyAll = () => {
    setAiFeatures(prev =>
      prev.map(f => ({
        ...f,
        enabled: suggestedFeatures.includes(f.id) ? true : f.enabled
      }))
    );
    
    alert(`✅ Applied ${suggestedFeatures.length} AI-recommended features!\n\nClick "Process Video/Image with AI" to see the results.`);
    setShowAIOptions(false);
  };

  // Complete AI Auto-Edit Workflow (Analyze + Apply + Stop for User to Edit)
  const handleAIAutoEdit = async () => {
    if (videoTracks.length === 0) {
      alert('Please upload a video or image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const clip = videoTracks[0];
      
      // Upload to backend if still a blob URL
      let mediaUrl = clip.url;
      if (clip.url.startsWith('blob:')) {
        console.log('📤 Uploading blob to backend for AI analysis...');
        const response = await fetch(clip.url);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', new File([blob], clip.name, { type: blob.type || 'image/jpeg' }));
        
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.secure_url;
        console.log('✅ Uploaded to Cloudinary:', mediaUrl);
      }
      
      // Step 1: Analyze
      const response = await fetch(`${API_BASE_URL}/ai/analyze-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: mediaUrl,
          mediaType: clip.type
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.suggestedFeatures) {
        // Step 2: Auto-apply ALL suggested features + FILTER
        setAiFeatures(prev =>
          prev.map(f => {
            // Apply suggested features (brightness, contrast, saturation, etc.)
            const shouldEnable = data.suggestedFeatures.includes(f.id);
            
            // ALSO AUTO-APPLY RECOMMENDED FILTER
            let enabled = shouldEnable ? true : f.enabled;
            
            // If AI recommends a filter, apply it (disable all other filters first)
            if (data.recommendedFilter && f.id === data.recommendedFilter) {
              enabled = true;
            } else if (data.recommendedFilter && ['normal', 'cinematic', 'vintage', 'noir', 'fade', 'fade-warm', 'cool', 'warm', 'graphite', 'simple', 'paris', 'los-angeles', 'moody', 'bright', 'portrait'].includes(f.id)) {
              enabled = false; // Disable other filters
            }
            
            return {...f, enabled};
          })
        );
        
        setSuggestedFeatures(data.suggestedFeatures);
        
        // Show detailed analysis with MANY features applied + filter auto-applied
        const filterNote = data.recommendedFilter ? `\n\n🎨 AUTO-APPLIED FILTER: ${data.recommendedFilter.replace(/-/g, ' ').toUpperCase()}` : '';
        const filterOptions = data.alternativeFilters ? `\n\n🎨 Or try other filters:\n${data.alternativeFilters.map((f: string) => `• ${f.replace(/-/g, ' ').toUpperCase()}`).join('\n')}` : '';
        
        const analysisMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: `🤖 AI Smart Analysis Complete!\n\n📊 Your Video Needs:\n${data.reasoning}${filterNote}${filterOptions}\n\n✅ Auto-Applied ${data.suggestedFeatures.length} Improvements:\n${data.suggestedFeatures.map((f: string) => `• ${f.replace(/-/g, ' ')}`).join('\n')}\n\n✨ Next Steps:\n• Add text overlays (click "Add Text Overlay")\n• Add music (AI will suggest mood)\n• Try different filters (toggle in Effects)\n• Preview before processing\n• Click "Process" when ready!`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, analysisMessage]);
        
        // DON'T auto-process - let user review and add more!
        alert(`✅ AI Analysis Complete!\n\nApplied ${data.suggestedFeatures.length} improvements.\n\n🎨 AUTO-APPLIED FILTER: ${data.recommendedFilter ? data.recommendedFilter.replace(/-/g, ' ').toUpperCase() : 'None'}\n\nNow you can:\n• Add text overlays\n• Add music\n• Try different filters\n• Preview before processing\n• Click "Process" when ready!`);
        
        // Auto-switch to Editor tab so they can see & edit
        setActiveTab('editor');
      }
    } catch (error) {
      console.error('AI Auto-Edit error:', error);
      alert('Failed to run AI analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestedFeatures = () => {
    setAiFeatures(prev =>
      prev.map(f => ({
        ...f,
        enabled: suggestedFeatures.includes(f.id) ? true : f.enabled
      }))
    );
    
    const appliedMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `✅ Applied AI-suggested features: ${suggestedFeatures.map(f => f.replace(/-/g, ' ')).join(', ')}`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, appliedMessage]);
  };

  const handleSaveText = () => {
    if (currentTextEdit) {
      setTextOverlays(prev => {
        const exists = prev.find(t => t.id === currentTextEdit.id);
        if (exists) {
          return prev.map(t => t.id === currentTextEdit.id ? currentTextEdit : t);
        }
        return [...prev, currentTextEdit];
      });
      setShowTextEditor(false);
      setCurrentTextEdit(null);
      
      // If preview was already open, regenerate it with new text
      if (showEffectsPreview) {
        handleGeneratePreview();
      }
    }
  };

  const handleGenerateAIText = async () => {
    try {
      console.log('🤖 Generating AI text suggestions...');
      const response = await fetch(`${API_BASE_URL}/ai/generate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoUrl: videoTracks[0]?.url,
          context: 'social_media_caption'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ AI Text suggestions received:', data.suggestions);
      setAiTextSuggestions(data.suggestions || []);
      
      if (data.suggestions && data.suggestions.length > 0) {
        alert(`✨ ${data.suggestions.length} AI suggestions generated!`);
      }
    } catch (error) {
      console.error('AI text generation error:', error);
      alert('Failed to generate AI text. Please check if backend is running and OpenAI is configured.');
    }
  };

  const handleGenerateAIMusic = async () => {
    try {
      const clip = videoTracks[0];
      console.log('🎵 Generating AI music suggestions...');
      
      // AI-suggested music moods
      setSuggestedMusic(['Upbeat', 'Cinematic', 'Ambient', 'Energetic', 'Calm']);
      
      alert('🎵 AI Music Suggestions Generated!\n\nSelect a mood below. When you process the video, the music preference will be saved with your project.\n\n📝 Note: To add actual music files, you need to provide music URLs in the backend or integrate with a music library API.');
      
      // In production: Call GPT-4 Vision to analyze video and suggest music
      // then map to actual music files from a library
    } catch (error) {
      console.error('AI music generation error:', error);
    }
  };

  // Process Images (same features as video but for images)
  const handleProcessImage = async () => {
    const imageClips = videoTracks.filter(clip => clip.type === 'image');
    if (imageClips.length === 0) {
      alert('Please upload an image first');
      return;
    }
    
    setIsProcessing(true);
    setShowProcessingModal(true);
    setProcessingStep('Processing image with AI...');
    setProcessingProgress(20);
    
    try {
      const imageClip = imageClips[0];
      
      // Collect enabled AI features
      const enabledIds = new Set(
        aiFeatures.filter(f => f.enabled).map(f => f.id)
      );
      
      const settings = Array.from(enabledIds).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setProcessingProgress(40);
      setProcessingStep('Applying filters and effects...');
      
      const response = await fetch(`${API_BASE_URL}/ai/process-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageClip.url,
          textOverlays: textOverlays,
          filterPreset: filterPreset,
          settings: settings
        })
      });
      
      setProcessingProgress(80);
      setProcessingStep('Finalizing...');
      
      const data = await response.json();
      
      if (data.success) {
        setProcessedVideoUrl(data.processedUrl);
        
        // Update the clip's display URL to show the processed image instead of original
        setVideoTracks(prev =>
          prev.map(clip =>
            clip.type === 'image'
              ? { ...clip, displayUrl: data.processedUrl, url: data.processedUrl }
              : clip
          )
        );
        
        setProcessingProgress(100);
        setProcessingStep('Image processing complete!');
        
        setTimeout(() => {
          setShowProcessingModal(false);
          setIsProcessing(false);
        }, 2000);
      } else {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Image processing error:', error);
      alert('Failed to process image. Please try again.');
      setShowProcessingModal(false);
      setIsProcessing(false);
    }
  };



  const handleLogout = () => {

    signOut({ callbackUrl: '/' });

  };



  const enabledFeaturesCount = aiFeatures.filter(f => f.enabled).length;



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Header */}

      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2 sm:space-x-4">

            <div className="flex space-x-1">

              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>

              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>

              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>

            </div>

            <div className="flex items-center space-x-2">

              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">

                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />

              </div>

              <span className="text-white font-semibold text-lg sm:text-xl">VEDIT</span>
            </div>

          </div>

          

          <div className="flex items-center space-x-2 sm:space-x-4">

            <div className="hidden sm:flex items-center space-x-2">

              <div className="bg-gray-700 px-2 sm:px-3 py-1 rounded text-xs text-gray-300">1080p</div>

              <div className="bg-gray-700 px-2 sm:px-3 py-1 rounded text-xs text-gray-300">24fps</div>

              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>

            </div>

            

            <div className="flex items-center space-x-1 sm:space-x-2">

              <img 

                src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=0D8ABC&color=fff`}

                alt={session?.user?.name || 'User'} 

                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"

                onError={(e) => {

                  const target = e.currentTarget as HTMLImageElement;

                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=0D8ABC&color=fff`;

                }}

              />

              <span className="hidden sm:block text-gray-300 text-sm sm:text-base">{session?.user?.name || 'User'}</span>

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



      {/* Main Content */}

      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">

        {/* Left Sidebar - VIA Chatbot */}

        <motion.div 

          className="hidden lg:block lg:w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto"

          initial={{ x: -50, opacity: 0 }}

          animate={{ x: 0, opacity: 1 }}

          transition={{ duration: 0.5 }}

        >

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-white font-medium text-lg flex items-center">

              <Bot className="w-5 h-5 mr-2 text-blue-400" />

              VIA Assistant

            </h3>

            <button

              onClick={generateAISuggestions}

              disabled={isGeneratingSuggestions}

              className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"

            >

              {isGeneratingSuggestions ? (

                <Loader2 className="w-4 h-4 animate-spin" />

              ) : (

                <Sparkles className="w-4 h-4" />

              )}

            </button>

          </div>

          

          {/* Chat Messages */}

          <div className="h-64 overflow-y-auto mb-4 space-y-3">

            {chatMessages.map((message) => (

              <motion.div

                key={message.id}

                initial={{ opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}

              >

                <div className={`max-w-xs px-3 py-2 rounded-lg ${

                  message.type === 'user' 

                    ? 'bg-blue-600 text-white' 

                    : 'bg-gray-700 text-gray-200'

                }`}>

                  <p className="text-sm">{message.content}</p>

                  <p className="text-xs opacity-70 mt-1">

                    {message.timestamp.toLocaleTimeString()}

                  </p>

                </div>

              </motion.div>

            ))}

            <div ref={chatEndRef} />

          </div>

          

          {/* Chat Input */}

          <div className="flex space-x-2 mb-4">

            <input

              type="text"

              value={chatInput}

              onChange={(e) => setChatInput(e.target.value)}

              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}

              placeholder="Ask VIA anything..."

              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"

            />

            <button

              onClick={handleSendMessage}

              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"

            >

              <Send className="w-4 h-4" />

            </button>

          </div>

          

          {/* Voice Commands */}

          <div className="space-y-3">

            <button

              onClick={handleVoiceCommand}

              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${

                isListening 

                  ? 'bg-red-600 text-white' 

                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'

              }`}

            >

              <Mic className="w-4 h-4" />

              <span>{isListening ? 'Listening...' : 'Voice Commands'}</span>

            </button>

            

            {/* AI Suggestions */}

            {(aiSuggestions.length > 0 || isGeneratingSuggestions) && (

              <div className="space-y-2">

                <h4 className="text-sm font-medium text-gray-300">AI Suggestions:</h4>

                {isGeneratingSuggestions ? (

                  <div className="flex items-center justify-center p-4 bg-gray-700 rounded">

                    <Loader2 className="w-4 h-4 animate-spin text-blue-400 mr-2" />

                    <span className="text-gray-300 text-sm">Generating AI suggestions...</span>

                  </div>

                ) : (

                  aiSuggestions.map((suggestion, index) => (

                    <div

                      key={index}

                      className="p-2 bg-gray-700 rounded text-sm text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"

                    >

                      <div className="font-medium text-white">{suggestion.feature}</div>
                      <div className="text-gray-400 text-xs mt-1">{suggestion.reason}</div>
                      <div className="text-blue-400 text-xs mt-1">Confidence: {suggestion.confidence}</div>

                    </div>

                  ))

                )}

              </div>

            )}

          </div>

        </motion.div>



        {/* Center Content - Tabbed Interface */}

        <div className="flex-1 flex flex-col">

          {/* Tab Navigation */}

          <div className="bg-gray-800 border-b border-gray-700 px-3 sm:px-6 py-2 sm:py-3">

            <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">

              {[

                { id: 'via', name: 'VIA Chatbot', icon: <Bot className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-blue-400' },

                { id: 'editor', name: 'V-Editor', icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-purple-400' },

                { id: 'vport', name: 'V-Port', icon: <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-green-400' },

                { id: 'profiles', name: 'VIA Profiles', icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-orange-400' }

              ].map((tab) => (

                <button

                  key={tab.id}

                  onClick={() => setActiveTab(tab.id as any)}

                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${

                    activeTab === tab.id

                      ? 'bg-gray-700 text-white'

                      : 'text-gray-400 hover:text-white hover:bg-gray-700'

                  }`}

                >

                  <span className={tab.color}>{tab.icon}</span>

                  <span>{tab.name}</span>

                </button>

              ))}

            </div>

          </div>



          {/* Tab Content */}

          <div className="flex-1 overflow-hidden">

            <AnimatePresence mode="wait">

              {activeTab === 'via' && (

                <motion.div

                  key="via"

                  initial={{ opacity: 0, x: 20 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -20 }}

                  className="h-full p-6"

                >

                  <div className="text-center">

                    <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />

                    <h2 className="text-2xl font-bold text-white mb-2">VIA AI Assistant</h2>

                    <p className="text-gray-400 mb-8">Your intelligent video editing companion with VEDIT AI</p>

                    

                    {videoTracks.length > 0 && (

                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">

                        <div className="flex items-center justify-center space-x-2 mb-2">

                          <Sparkles className="w-5 h-5 text-blue-400" />

                          <span className="text-blue-400 font-medium">AI Suggestions Ready!</span>

                        </div>

                        <p className="text-gray-300 text-sm">

                          I've analyzed your {videoTracks.length} video{videoTracks.length !== 1 ? 's' : ''} and generated personalized editing suggestions. 

                          Check the sidebar for AI-powered recommendations!

                        </p>

                      </div>

                    )}

                    

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

                      <div className="bg-gray-800 p-6 rounded-lg">

                        <Mic className="w-8 h-8 text-blue-400 mb-4" />

                        <h3 className="text-lg font-semibold text-white mb-2">Voice Commands</h3>

                        <p className="text-gray-400 text-sm">Speak naturally to edit your videos</p>

                      </div>

                      <div className="bg-gray-800 p-6 rounded-lg">

                        <Sparkles className="w-8 h-8 text-purple-400 mb-4" />

                        <h3 className="text-lg font-semibold text-white mb-2">Smart Suggestions</h3>

                        <p className="text-gray-400 text-sm">AI analyzes and suggests improvements</p>

                      </div>

                      <div className="bg-gray-800 p-6 rounded-lg">

                        <Zap className="w-8 h-8 text-yellow-400 mb-4" />

                        <h3 className="text-lg font-semibold text-white mb-2">Auto Processing</h3>

                        <p className="text-gray-400 text-sm">One-click apply AI recommendations</p>

                      </div>

                    </div>

                  </div>

                </motion.div>

              )}



              {activeTab === 'editor' && (

                <motion.div

                  key="editor"

                  initial={{ opacity: 0, x: 20 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -20 }}

                  className="h-full flex flex-col"

                >

                {/* Video Editor Interface */}

                  <div className="flex-1 bg-black relative overflow-hidden">

                    {videoTracks.length > 0 ? (

                      <div className="h-full flex flex-col">

                        {/* Video Preview Area - SCROLLABLE */}

                        <div className="flex-1 bg-gray-900 p-4 pb-20 overflow-y-auto">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">

                              {videoTracks.map((clip, index) => (

                                <motion.div

                                  key={clip.id}

                                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"

                                  initial={{ opacity: 0, y: 20 }}

                                  animate={{ opacity: 1, y: 0 }}

                                  transition={{ delay: index * 0.1 }}

                                >

                                  <div className="aspect-video bg-black relative">

                                    {clip.type === 'video' ? (

                                      <video

                                        src={clip.displayUrl || clip.url}

                                        controls

                                        className="w-full h-full object-cover"

                                        onLoadedMetadata={(e) => {

                                          const video = e.target as HTMLVideoElement;

                                          const duration = video.duration;

                                          setVideoTracks(prev => 

                                            prev.map(v => 

                                              v.id === clip.id 

                                                ? { ...v, duration: duration, endTime: duration }

                                                : v

                                            )

                                          );

                                        }}

                                      />

                                    ) : clip.type === 'audio' ? (

                                      <div className="flex items-center justify-center h-full">

                                        <div className="text-center">

                                          <Music className="w-12 h-12 text-blue-400 mx-auto mb-2" />

                                          <p className="text-white text-sm">{clip.name}</p>

                                          <audio src={clip.displayUrl || clip.url} controls className="mt-2" />

                                        </div>

                                      </div>

                                    ) : (

                                      <div className="flex items-center justify-center h-full">

                                        <div className="text-center">

                                          <Image className="w-12 h-12 text-green-400 mx-auto mb-2" />

                                          <p className="text-white text-sm">{clip.name}</p>

                                          <img src={clip.displayUrl || clip.url} alt={clip.name} className="mt-2 max-h-32 object-cover rounded" />

                                        </div>

                                      </div>

                                    )}

                                  </div>

                                  <div className="p-3">

                                    <div className="flex items-center justify-between mb-2">

                                      <h4 className="text-white text-sm font-medium truncate">{clip.name}</h4>

                                      <div className="flex items-center space-x-2">

                                        <input

                                          type="checkbox"

                                          checked={selectedClipsForMerge.includes(clip.id)}

                                          onChange={(e) => {

                                            if (e.target.checked) {

                                              setSelectedClipsForMerge(prev => [...prev, clip.id]);

                                            } else {

                                              setSelectedClipsForMerge(prev => prev.filter(id => id !== clip.id));

                                            }

                                          }}

                                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"

                                        />

                                        <span className="text-xs text-gray-400">Select</span>

                                      </div>

                                    </div>

                                    <div className="text-xs text-gray-400">

                                      {clip.type === 'image' ? (
                                        <>📸 Image | Track: {clip.track + 1}</>
                                      ) : (
                                        <>Duration: {clip.duration.toFixed(1)}s | Track: {clip.track + 1}</>
                                      )}
                                    </div>

                                    
                                    {clip.type === 'video' && previewClipId === clip.id && (
                                      <div className="mt-3 border-2 border-purple-500 rounded-lg overflow-hidden bg-black shadow-lg">

                                        <div className="bg-purple-900/30 px-3 py-1.5 border-b border-purple-500/50">

                                          <div className="text-xs font-medium text-purple-300">

                                            🎬 Trim Preview: {Math.max(0, clip.startTime || 0).toFixed(1)}s → {Math.max(clip.startTime || 0, clip.endTime || clip.duration || 0).toFixed(1)}s

                                          </div>

                                        </div>

                                        <video

                                          src={clip.displayUrl || clip.url}

                                          muted

                                          autoPlay

                                          controls

                                          className="w-full h-32 object-contain bg-black"

                                          onLoadedMetadata={(e) => {

                                            const v = e.currentTarget;

                                            const start = Math.max(0, clip.startTime || 0);

                                            v.currentTime = start;

                                          }}

                                          onTimeUpdate={(e) => {

                                            const v = e.currentTarget as HTMLVideoElement;

                                            const start = Math.max(0, clip.startTime || 0);

                                            const end = Math.max(start + 0.1, clip.endTime || clip.duration || start + 0.1);

                                            if (v.currentTime < start) v.currentTime = start;

                                            if (v.currentTime >= end) v.currentTime = start;

                                          }}

                                        />

                                        <div className="px-3 py-1.5 bg-purple-900/30 border-t border-purple-500/50">

                                          <div className="text-xs text-purple-300">

                                            ↻ Looping trimmed section • Duration: {(Math.max(clip.startTime || 0, clip.endTime || clip.duration || 0) - Math.max(0, clip.startTime || 0)).toFixed(1)}s

                                          </div>

                                        </div>

                                      </div>

                                    )}

                                    {clip.effects && clip.effects.length > 0 && (

                                      <div className="mt-2">

                                        <div className="flex flex-wrap gap-1">

                                          {clip.effects.map((effect, i) => (

                                            <span key={i} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">

                                              {effect}

                                            </span>

                                          ))}

                                        </div>

                                      </div>

                                    )}

                                  </div>

                                </motion.div>

                              ))}

                          </div>

                        </div>

                        



                        {/* Processing Status */}

                        {isProcessing && (

                          <div className="bg-gray-800 border-t border-gray-700 p-4">

                            <div className="flex items-center justify-between mb-2">

                              <div className="flex items-center space-x-2">

                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />

                                <span className="text-white font-medium">{processingStep}</span>

                              </div>

                              <span className="text-gray-400 text-sm">{processingProgress}%</span>

                            </div>

                            <div className="w-full bg-gray-700 rounded-full h-2">

                              <motion.div

                                className="bg-blue-500 h-2 rounded-full"

                                initial={{ width: 0 }}

                                animate={{ width: `${processingProgress}%` }}

                                transition={{ duration: 0.5 }}

                              />

                            </div>

                          </div>

                        )}

                        

                        {/* AI Processing Button - STICKY AT BOTTOM */}

                        {!isProcessing && videoTracks.length > 0 && !processedVideoUrl && (

                          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 p-4 sticky bottom-0 z-20">

                            {selectedClipsForMerge.length === 0 ? (

                              <div className="flex items-center justify-center gap-3 text-yellow-400">

                                <AlertCircle className="w-5 h-5" />

                                <span className="font-medium">Please select at least one video clip by checking the "Select" checkbox above</span>

                              </div>

                            ) : (

                              <div className="flex items-center justify-between gap-4">

                                <div className="flex-1">

                                  <div className="text-white font-medium mb-1">

                                    {selectedClipsForMerge.length} clip{selectedClipsForMerge.length !== 1 ? 's' : ''} selected • {enabledFeaturesCount} AI feature{enabledFeaturesCount !== 1 ? 's' : ''} enabled

                                  </div>

                                  <div className="text-gray-400 text-sm">

                                    Click the button to start processing with VEDIT AI

                                  </div>

                                </div>

                                <motion.button

                                  onClick={() => {
                                    const hasImages = videoTracks.some(clip => clip.type === 'image');
                                    const hasVideos = videoTracks.some(clip => clip.type === 'video');
                                    
                                    if (hasImages && !hasVideos) {
                                      // Process as image
                                      handleProcessImage();
                                    } else {
                                      // Process as video (default)
                                      handleAIMerge();
                                    }
                                  }}
                                  disabled={selectedClipsForMerge.length === 0}

                                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"

                                  whileHover={selectedClipsForMerge.length > 0 ? { scale: 1.05 } : {}}

                                  whileTap={selectedClipsForMerge.length > 0 ? { scale: 0.95 } : {}}

                                >

                                  <Zap className="w-5 h-5" />

                                  {videoTracks.some(clip => clip.type === 'image') && !videoTracks.some(clip => clip.type === 'video') 
                                    ? 'Process Image with AI' 
                                    : 'Start AI Processing'}
                                </motion.button>

                              </div>

                            )}

                          </div>

                        )}

                        

                        {/* Processed Video Result */}

                        {processedVideoUrl && (

                          <div className="bg-green-900/20 border-t border-green-500/30 p-4 sticky bottom-0 z-20">

                            <div className="flex items-center justify-between">

                              <div>

                                <div className="text-green-400 text-sm font-medium mb-1">✅ AI Processing Complete!</div>

                                <div className="text-gray-300 text-sm">

                                  Your video has been processed with VEDIT AI and is ready for download.

                                </div>

                              </div>

                              <div className="flex items-center gap-2">

                                {/* Download Video or Image */}
                                <a 

                                  href={processedVideoUrl} 

                                  target="_blank" 

                                  rel="noopener noreferrer"

                                  download
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                                >

                                  <Download className="w-4 h-4" />
                                  {videoTracks.some(c => c.type === 'image') && !videoTracks.some(c => c.type === 'video') ? 'Download Image' : 'Download Video'}
                                </a>

                                

                                {/* Export Anywhere Button */}

                                <button

                                  onClick={() => setActiveTab('vport')}

                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"

                                >

                                  <Upload className="w-4 h-4" />

                                  Export Anywhere

                                </button>

                              </div>

                            </div>

                          </div>

                        )}

                      </div>

                    ) : (

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

                              {isProcessing ? 'VEDIT AI processing in progress...' : 'Upload your media to get started'}

                            </div>

                          </div>

                        </motion.div>

                      </div>

                    )}

                  </div>



                  {/* Multi-Track Timeline with Drag & Drop */}

                  <div className="bg-gray-900 border-t border-gray-700 p-4">

                    <div className="flex items-center justify-between mb-3">

                      <div className="flex items-center space-x-4">

                        <h3 className="text-white font-medium">Multi-Track Timeline</h3>

                        <div className="flex space-x-1">

                          <div className="w-2 h-2 bg-blue-500 rounded" title="Video Track"></div>

                          <div className="w-2 h-2 bg-green-500 rounded" title="Audio Track"></div>

                          <div className="w-2 h-2 bg-red-500 rounded" title="Effects Track"></div>

                        </div>

                      </div>

                      <div className="text-gray-400 text-sm">
                        
                        {(() => {
                          if (videoTracks.length === 0) return '00:00:00:00';
                          
                          // Check if all clips are images
                          const allImages = videoTracks.every(clip => clip.type === 'image');
                          if (allImages) return '';
                          
                          // For videos, calculate total duration
                          const videoOnlyTracks = videoTracks.filter(clip => clip.type !== 'image');
                          const totalDuration = videoOnlyTracks.reduce((sum, clip) => sum + clip.duration, 0);
                          return `${totalDuration.toFixed(1)}s total`;
                        })()}
                        
                      </div>

                    </div>

                    

                    {/* Interactive Timeline Tracks */}

                    <div className="bg-gray-800 rounded min-h-[120px] relative overflow-x-auto">

                      {[0, 1, 2].map((trackNum) => (

                        <div 

                          key={trackNum}

                          className="h-10 border-b border-gray-700 relative flex items-center px-2"

                          onDragOver={(e) => e.preventDefault()}

                          onDrop={(e) => {

                            e.preventDefault();

                            const clipId = e.dataTransfer.getData('clipId');

                            if (clipId) {

                              setVideoTracks(prev => 

                                prev.map(clip => 

                                  clip.id === clipId ? { ...clip, track: trackNum } : clip

                                )

                              );

                            }

                          }}

                        >

                          <span className="text-gray-500 text-xs mr-2">Track {trackNum + 1}</span>

                          

                          {/* Render clips on this track */}

                          {videoTracks

                            .filter(clip => clip.track === trackNum)

                            .map((clip, idx) => (

                              <motion.div

                                key={clip.id}

                                draggable

                                onDragStart={(e) => {

                                  (e as unknown as React.DragEvent).dataTransfer.setData('clipId', clip.id);

                                }}

                                className={`absolute h-8 rounded cursor-move flex items-center justify-center text-xs text-white font-medium ${

                                  selectedClipsForMerge.includes(clip.id)

                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 ring-2 ring-blue-400'

                                    : 'bg-gradient-to-r from-gray-600 to-gray-700'

                                } hover:brightness-110 transition-all`}

                                style={{

                                  left: `${80 + idx * 120}px`,

                                  width: `${Math.max(80, clip.duration * 10)}px`

                                }}

                                onClick={() => {

                                  if (selectedClipsForMerge.includes(clip.id)) {

                                    setSelectedClipsForMerge(prev => prev.filter(id => id !== clip.id));

                                  } else {

                                    setSelectedClipsForMerge(prev => [...prev, clip.id]);

                                  }

                                }}

                                initial={{ scale: 0.8, opacity: 0 }}

                                animate={{ scale: 1, opacity: 1 }}

                                transition={{ delay: idx * 0.1 }}

                              >

                                <span className="truncate px-2">{clip.name}</span>

                              </motion.div>

                            ))}

                          

                          {/* Drop zone indicator */}

                          {videoTracks.filter(c => c.track === trackNum).length === 0 && (

                            <span className="text-gray-600 text-xs italic">Drop clips here...</span>

                          )}

                        </div>

                      ))}

                    </div>

                    

                    {/* Timeline Instructions */}

                    {videoTracks.length > 0 && (

                      <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">

                        <span>💡 Drag clips to reorder or move between tracks</span>

                        <span>•</span>

                        <span>Click clips to select for merging</span>

                      </div>

                    )}

                  </div>

                </motion.div>

              )}



              {activeTab === 'vport' && (

                <motion.div

                  key="vport"

                  initial={{ opacity: 0, x: 20 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -20 }}

                  className="h-full p-6 overflow-y-auto"

                >

                  <div className="text-center mb-8">

                    <Share2 className="w-16 h-16 text-green-400 mx-auto mb-4" />

                    <h2 className="text-2xl font-bold text-white mb-2">V-Port Publishing</h2>

                    <p className="text-gray-400">Automate publishing & scheduling across all social platforms</p>

                  </div>

                  

                  {/* Publishing Platforms */}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

                    {publishingPlatforms.map((platform) => (

                      <div

                        key={platform.id}

                        className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"

                      >

                        <div className="flex items-center justify-between mb-3">

                          <div className="flex items-center space-x-3">

                            <span className={platform.color}>{platform.icon}</span>

                            <span className="text-white font-medium">{platform.name}</span>

                          </div>

                          <button

                            onClick={() => connectPlatform(platform.id)}

                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${

                              isPlatformConnected(platform.id)

                                ? 'bg-green-600 text-white'

                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'

                            }`}

                          >

                            {isPlatformConnected(platform.id) ? (platform.id === 'youtube' && ytStatus?.channelTitle ? `Connected` : 'Connected') : 'Connect'}

                          </button>

                        </div>

                        <div className="text-sm text-gray-400">

                          {isPlatformConnected(platform.id)

                            ? 'Ready to publish'

                            : 'Click to connect your account'}

                        </div>

                      </div>

                    ))}

                  </div>

                  

                  {/* Publish Video Section */}

                  {processedVideoUrl && (

                    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30 p-6 mb-6">

                      <div className="flex items-center justify-between flex-wrap gap-4">

                        <div>

                          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">

                            <Rocket className="w-5 h-5 text-green-400" />

                            Publish Your Video

                          </h3>

                          <p className="text-gray-300 text-sm">

                            Ready to publish your processed video to connected platforms

                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                                                     {publishingPlatforms.filter(p => isPlatformConnected(p.id)).map((platform) => (

                             <button

                               key={platform.id}

                               onClick={async () => {

                                 if (!processedVideoUrl) {

                                   alert('No video to publish. Please process a video first.');

                                   return;

                                 }

                                 

                                 setIsPublishing(true);

                                 try {

                                   // Directly send the processed video URL to the backend publish endpoint

                                   const response = await fetch(`${API_BASE_URL}/vport/publish/${platform.id}`, {

                                     method: 'POST',

                                     headers: { 'Content-Type': 'application/json' },

                                     body: JSON.stringify({

                                       videoUrl: processedVideoUrl,

                                       title: 'VEDIT Processed Video',

                                       description: 'Created with VEDIT AI Video Editor',

                                       privacyStatus: 'unlisted'

                                     })

                                   });

                                   

                                   const data = await response.json();

                                   

                                   if (data.success) {

                                     alert(`✅ Successfully published to ${platform.name}!`);

                                   } else {

                                     alert(`Failed to publish to ${platform.name}: ${data.error || 'Unknown error'}`);

                                   }

                                 } catch (error: any) {

                                   console.error('Publish error:', error);

                                   alert(`Error publishing to ${platform.name}: ${error.message}`);

                                 } finally {

                                   setIsPublishing(false);

                                 }

                               }}

                               disabled={isPublishing}

                               className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl ${

                                 isPublishing ? 'opacity-50 cursor-not-allowed' : ''

                               }`}

                             >

                               {isPublishing ? (

                                 <>

                                   <Loader2 className="w-4 h-4 animate-spin" />

                                   Publishing...

                                 </>

                               ) : (

                                 <>

                                   <span className="w-4 h-4">{platform.icon}</span>

                                   Publish to {platform.name}

                                 </>

                               )}

                             </button>

                           ))}

                          {publishingPlatforms.filter(p => isPlatformConnected(p.id)).length === 0 && (

                            <button

                              disabled

                              className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg font-medium cursor-not-allowed"

                            >

                              No platforms connected

                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  )}

                  

                  {/* Scheduled Posts */}

                  <div className="bg-gray-800 rounded-lg p-6">

                    <h3 className="text-lg font-semibold text-white mb-4">Scheduled Posts</h3>

                    {scheduledPosts.length > 0 ? (

                      <div className="space-y-3">

                        {scheduledPosts.map((post) => (

                          <div key={post.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">

                            <div>

                              <div className="text-white font-medium">{post.platform}</div>

                              <div className="text-gray-400 text-sm">

                                Scheduled for {post.scheduledTime.toLocaleString()}

                              </div>

                            </div>

                            <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">

                              {post.status}

                            </span>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div className="text-center text-gray-400 py-8">

                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />

                        <p>No scheduled posts yet</p>

                        <p className="text-sm">Connect platforms and schedule your content</p>

                      </div>

                    )}

                  </div>

                </motion.div>

              )}



              {activeTab === 'profiles' && (

                <motion.div

                  key="profiles"

                  initial={{ opacity: 0, x: 20 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -20 }}

                  className="h-full p-6 overflow-y-auto"

                >

                  <div className="text-center mb-8">

                    <Headphones className="w-16 h-16 text-orange-400 mx-auto mb-4" />

                    <h2 className="text-2xl font-bold text-white mb-2">VIA Profiles</h2>

                    <p className="text-gray-400">AI-generated voice clones for personalized voiceovers</p>

                  </div>

                  

                  {/* Voice Profiles */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {voiceProfiles.map((profile) => (

                      <div

                        key={profile.id}

                        className={`bg-gray-800 p-6 rounded-lg border-2 transition-colors ${

                          profile.isActive 

                            ? 'border-orange-500 bg-orange-500/10' 

                            : 'border-gray-700 hover:border-gray-600'

                        }`}

                      >

                        <div className="flex items-center justify-between mb-4">

                          <div>

                            <h3 className="text-lg font-semibold text-white">{profile.name}</h3>

                            <p className="text-gray-400 text-sm">{profile.voiceType} Voice</p>

                          </div>

                          <button

                            onClick={() => activateVoiceProfile(profile.id)}

                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${

                              profile.isActive

                                ? 'bg-orange-600 text-white'

                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'

                            }`}

                          >

                            {profile.isActive ? 'Active' : 'Activate'}

                          </button>

                        </div>

                        

                        {profile.previewUrl && (

                          <div className="mb-4">

                            <audio controls className="w-full">

                              <source src={profile.previewUrl} type="audio/mpeg" />

                              Your browser does not support the audio element.

                            </audio>

                          </div>

                        )}

                        

                        <button

                          onClick={() => generateVoiceProfile(profile.id)}

                          disabled={isGeneratingVoice}

                          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

                        >

                          {isGeneratingVoice ? (

                            <div className="flex items-center justify-center space-x-2">

                              <Loader2 className="w-4 h-4 animate-spin" />

                              <span>Generating...</span>

                            </div>

                          ) : (

                            'Generate Voice Sample'

                          )}

                        </button>

                      </div>

                    ))}

                  </div>

                  

                  {/* Voice Recording */}

                  <div className="bg-gray-800 rounded-lg p-6">

                    <h3 className="text-lg font-semibold text-white mb-4">Record New Voice</h3>

                    <div className="text-center">

                      <button

                        onClick={() => setIsRecording(!isRecording)}

                        className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-colors ${

                          isRecording

                            ? 'bg-red-600 text-white animate-pulse'

                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'

                        }`}

                      >

                        <Mic className="w-8 h-8" />

                      </button>

                      <p className="text-gray-400 mt-4">

                        {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}

                      </p>

                    </div>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        </div>



        {/* Right Sidebar - AI Features */}

        <motion.div 

          className="hidden lg:block lg:w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto max-h-[calc(100vh-80px)]"

          initial={{ x: 50, opacity: 0 }}

          animate={{ x: 0, opacity: 1 }}

          transition={{ duration: 0.5, delay: 0.4 }}

        >

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-white font-medium text-lg">VEDIT AI Features</h3>

            <div className="flex items-center space-x-2">

              <Sparkles className="w-5 h-5 text-yellow-400" />

              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{enabledFeaturesCount}</span>

            </div>

          </div>

          

          {/* File Upload */}

          <div className="bg-gray-700 rounded-lg p-4 mb-4">

            <h4 className="text-white font-medium mb-3">Upload Media</h4>

            <label className="cursor-pointer">

              <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">

                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />

                <p className="text-gray-300 text-sm">Click to upload</p>

                <p className="text-gray-500 text-xs">Videos, Images & Audio</p>
              </div>

              <input

                type="file"

                multiple

                accept="video/*,audio/*,image/*"

                onChange={handleFileUpload}

                className="hidden"

                title="Upload videos, images, or audio"
              />

            </label>

          </div>

          

          {/* Quick Actions */}
          {videoTracks.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h4 className="text-white font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {/* AI AUTO-EDIT - Main Feature */}
                <button
                  onClick={handleAIAutoEdit}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-lg hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all disabled:opacity-50 shadow-lg border-2 border-purple-400/50 animate-pulse hover:animate-none font-bold text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>AI Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>🤖 AI AUTO-EDIT</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 -mt-1 mb-2">
                  ⚡ One-click professional editing with AI
                </p>
                
                
                <button
                  onClick={handleGeneratePreview}
                  disabled={isGeneratingPreview}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {isGeneratingPreview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Preview Effects</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleAddText}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  <Type className="w-4 h-4" />
                  <span>Add Text Overlay</span>
                </button>
                
                {textOverlays.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {textOverlays.length} text overlay{textOverlays.length !== 1 ? 's' : ''} added
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* AI Features by Category - Full Editing Controls */}
          <div className="space-y-4">

            {['video', 'effects', 'text', 'audio'].map((category) => (
              <div key={category} className="bg-gray-700 rounded-lg p-4">

                <h4 className="text-white font-medium mb-3 capitalize">{category} Features</h4>

                <div className="space-y-2">

                  {aiFeatures

                    .filter(f => f.category === category)

                    .map((feature) => (

                      <label key={feature.id} className="flex items-center space-x-3 cursor-pointer">

                        <input

                          type="checkbox"

                          checked={feature.enabled}

                          onChange={() => toggleAIFeature(feature.id)}

                          className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"

                        />

                        <span className={`${feature.color} text-sm`}>{feature.icon}</span>

                        <div className="flex-1">

                          <div className="text-gray-300 text-sm font-medium">{feature.name}</div>

                          <div className="text-gray-500 text-xs">{feature.description}</div>

                        </div>

                      </label>

                    ))}

                  {/* Burn-in toggle (mapped backend key: burnInSubtitles) */}

                  {category === 'text' && (

                    <label className="flex items-center space-x-3 cursor-pointer">

                      <input

                        type="checkbox"

                        checked={burnInSubtitles}

                        onChange={() => setBurnInSubtitles(!burnInSubtitles)}

                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"

                      />

                      <span className="text-cyan-400 text-sm"><Captions className="w-5 h-5" /></span>

                      <div className="flex-1">

                        <div className="text-gray-300 text-sm font-medium">Burn-in Subtitles (requires ImageMagick)</div>

                        <div className="text-gray-500 text-xs">Embeds captions into video frames</div>

                      </div>

                    </label>

                  )}

                </div>

              </div>

            ))}

          </div>

        </motion.div>

      </div>



      {/* Processing Modal */}

      <AnimatePresence>

        {showProcessingModal && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"

          >

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4"

            >

              <div className="text-center">

                <motion.div

                  className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"

                  animate={{ rotate: 360 }}

                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}

                >

                  <Loader2 className="w-8 h-8 text-white" />

                </motion.div>

                

                <h3 className="text-xl font-semibold text-white mb-2">VEDIT AI Processing</h3>

                <p className="text-gray-400 mb-6">{processingStep}</p>

                

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">

                  <motion.div

                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"

                    initial={{ width: 0 }}

                    animate={{ width: `${processingProgress}%` }}

                    transition={{ duration: 0.5 }}

                  />

                </div>

                

                <p className="text-sm text-gray-400">{Math.round(processingProgress)}% complete</p>

                <p className="text-xs text-gray-500 mt-2">Using VEDIT AI - No Fallbacks</p>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>


      {/* Preview Effects Modal */}
      <AnimatePresence>
        {showEffectsPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEffectsPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Eye className="w-6 h-6 text-purple-400" />
                  Preview Effects Before Processing
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleGeneratePreview}
                    disabled={isGeneratingPreview}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    title="Refresh Preview with Latest Changes"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Preview
                  </button>
                  <button
                    onClick={() => setShowEffectsPreview(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Before */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    BEFORE (Original)
                  </h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-700">
                    {previewFrameOriginal ? (
                      <img
                        src={previewFrameOriginal}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No preview available
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {videoTracks[0]?.type === 'image' ? 'Raw, unprocessed image' : 'Raw video frame (no effects)'}
                  </p>
                </div>

                {/* After */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    AFTER (With AI Effects)
                  </h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden border-2 border-green-600">
                    {isGeneratingPreview ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
                        <p className="text-sm">Extracting frame and applying effects...</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {videoTracks[0]?.type === 'video' ? 'Processing video frame...' : 'Processing image...'}
                        </p>
                      </div>
                    ) : previewFrameWithEffects ? (
                      <img
                        src={previewFrameWithEffects}
                        alt="With Effects"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No preview available
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-green-400 mt-2">
                    {isGeneratingPreview ? 
                      '⏳ Generating preview...' : 
                      `✨ ${enabledFeaturesCount} AI feature${enabledFeaturesCount !== 1 ? 's' : ''} applied`
                    }
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">Enabled Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {aiFeatures.filter(f => f.enabled).map(feature => (
                    <span key={feature.id} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {feature.name}
                    </span>
                  ))}
                  {filterPreset && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                      {filterPreset} Filter
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Info Message */}
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3 mb-2">
                  <p className="text-yellow-200 text-sm text-center">
                    💡 Want to add text or music? Click "Keep Editing" first!
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowEffectsPreview(false);
                      const hasImages = videoTracks.some(clip => clip.type === 'image');
                      const hasVideos = videoTracks.some(clip => clip.type === 'video');
                      
                      if (hasImages && !hasVideos) {
                        handleProcessImage();
                      } else {
                        handleAIMerge();
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    {videoTracks[0]?.type === 'image' 
                      ? 'Looks Great! Process Image' 
                      : 'Looks Great! Process Full Video'}
                  </button>
                  <button
                    onClick={() => {
                      // Debug: Log preview state before closing
                      console.log('🔍 Keep Editing clicked:', {
                        hasPreviewEffects: !!previewFrameWithEffects,
                        previewUrl: previewFrameWithEffects?.substring(0, 80),
                        originalUrl: videoTracks[0]?.displayUrl?.substring(0, 80)
                      });
                      
                      // Store the processed preview URL for text editor
                      setTextEditorPreviewUrl(previewFrameWithEffects || videoTracks[0]?.displayUrl || null);
                      
                      // Close preview modal BUT KEEP previewFrameWithEffects
                      setShowEffectsPreview(false);
                      
                      // Automatically open text editor
                      // If no text overlay exists, create a default one
                      setTimeout(() => {
                        if (textOverlays.length === 0) {
                          handleAddText();
                        } else {
                          // Edit existing first text overlay
                          setCurrentTextEdit(textOverlays[0]);
                          setShowTextEditor(true);
                        }
                      }, 100);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Keep Editing & Add Text
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Editor Modal */}
      <AnimatePresence>
        {showTextEditor && currentTextEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTextEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Type className="w-6 h-6 text-blue-400" />
                  Professional Text Editor
                </h2>
                <button
                  onClick={() => setShowTextEditor(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Preview:</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-700 relative">
                  {videoTracks[0] && (
                    videoTracks[0].type === 'image' ? (
                      <img
                        src={videoTracks[0].displayUrl || videoTracks[0].url}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={videoTracks[0].displayUrl || videoTracks[0].url}
                        className="w-full h-full object-contain"
                        muted
                        loop
                        autoPlay
                      />
                    )
                  )}
                  
                  {/* Text Overlay Preview */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      alignItems: currentTextEdit.position === 'top' ? 'flex-start' : 
                                currentTextEdit.position === 'bottom' ? 'flex-end' : 'center'
                    }}
                  >
                    <div 
                      className="px-4 py-2"
                      style={{
                        color: currentTextEdit.color,
                        fontSize: `${currentTextEdit.fontSize}px`,
                        fontFamily: currentTextEdit.fontFamily,
                        fontWeight: currentTextEdit.bold ? 'bold' : 'normal',
                        fontStyle: currentTextEdit.italic ? 'italic' : 'normal',
                        textDecoration: currentTextEdit.underline ? 'underline' : 'none',
                        backgroundColor: currentTextEdit.backgroundColor !== 'transparent' ? currentTextEdit.backgroundColor : undefined,
                        padding: currentTextEdit.backgroundColor !== 'transparent' ? '8px 16px' : undefined,
                        borderRadius: currentTextEdit.backgroundColor !== 'transparent' ? '8px' : undefined,
                        textShadow: currentTextEdit.strokeWidth ? `${currentTextEdit.strokeWidth}px ${currentTextEdit.strokeWidth}px ${currentTextEdit.strokeWidth * 2}px ${currentTextEdit.strokeColor}` : undefined
                      }}
                    >
                      {currentTextEdit.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Controls */}
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-white font-medium mb-2">Text:</label>
                  <input
                    type="text"
                    value={currentTextEdit.text}
                    onChange={(e) => setCurrentTextEdit({...currentTextEdit, text: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your text..."
                  />
                </div>

                {/* Position - VEDIT Style Drag & Drop */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Move className="w-5 h-5 text-blue-400" />
                    Position - Click to Place!
                  </h4>
                  
                  {/* Visual Click-to-Place Area */}
                  <div 
                    className="relative w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-blue-500/50 mb-3 overflow-hidden cursor-crosshair"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setCurrentTextEdit({...currentTextEdit, x: Math.round(x), y: Math.round(y)});
                    }}
                  >
                    {/* Preview Background - Use processed preview if available */}
                    {(() => {
                      // Priority: textEditorPreviewUrl (from "Keep Editing") > previewFrameWithEffects (with effects) > processed displayUrl (already processed image) > original
                      const previewUrl = textEditorPreviewUrl || previewFrameWithEffects || (videoTracks[0]?.displayUrl && videoTracks[0].displayUrl.startsWith('http') ? videoTracks[0].displayUrl : null) || videoTracks[0]?.url;
                      console.log('📝 Text Editor Preview URL:', { 
                        usingStoredUrl: !!textEditorPreviewUrl,
                        storedUrl: textEditorPreviewUrl?.substring(0, 80),
                        hasEffects: !!previewFrameWithEffects,
                        effectsUrl: previewFrameWithEffects?.substring(0, 80),
                        displayUrl: videoTracks[0]?.displayUrl?.substring(0, 80),
                        url: videoTracks[0]?.url?.substring(0, 80),
                        finalUrl: previewUrl?.substring(0, 100)
                      });
                      return previewUrl && (
                        <img key={previewUrl} src={previewUrl} alt="Preview (AFTER)" className="absolute inset-0 w-full h-full object-contain opacity-60" />
                      );
                    })()}
                    
                    {/* Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 border-t border-blue-500/20"></div>
                      <div className="absolute top-2/3 left-0 right-0 border-t border-blue-500/20"></div>
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-blue-500/20"></div>
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-blue-500/20"></div>
                    </div>
                    
                    {/* Text Preview */}
                    <div 
                      className="absolute pointer-events-none"
                      style={{
                        left: `${currentTextEdit.x}%`,
                        top: `${currentTextEdit.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${Math.max(12, currentTextEdit.fontSize / 4)}px`,
                        color: currentTextEdit.color,
                        fontWeight: currentTextEdit.bold ? 'bold' : 'normal',
                        fontStyle: currentTextEdit.italic ? 'italic' : 'normal',
                        textDecoration: currentTextEdit.underline ? 'underline' : 'none',
                        backgroundColor: currentTextEdit.highlight ? currentTextEdit.highlightColor : 'transparent',
                        padding: currentTextEdit.highlight ? '4px 8px' : '0',
                        borderRadius: currentTextEdit.highlight ? '4px' : '0',
                        textShadow: '0 0 4px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {currentTextEdit.text || 'Your Text Here'}
                    </div>
                    
                    {/* Position Marker - Hidden */}
                  </div>
                  
                  <p className="text-xs text-blue-300 mb-3 text-center">
                    👆 Click anywhere to position text • Current: X:{currentTextEdit.x}%, Y:{currentTextEdit.y}%
                  </p>
                  
                  {/* Quick Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, x: 50, y: 10})}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-all"
                    >
                      ⬆️ Top
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, x: 50, y: 50})}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-all"
                    >
                      🎯 Center
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, x: 50, y: 90})}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-all"
                    >
                      ⬇️ Bottom
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10})}
                      className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-sm transition-all"
                    >
                      🎲 Random
                    </button>
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-white font-medium mb-2">Font Family:</label>
                  <select
                    value={currentTextEdit.fontFamily}
                    onChange={(e) => setCurrentTextEdit({...currentTextEdit, fontFamily: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Arial Black">Arial Black</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-white font-medium mb-2">Font Size: {currentTextEdit.fontSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={currentTextEdit.fontSize}
                    onChange={(e) => setCurrentTextEdit({...currentTextEdit, fontSize: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                {/* Text Style (Bold, Italic, Underline) */}
                <div>
                  <label className="block text-white font-medium mb-2">Text Style:</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, bold: !currentTextEdit.bold})}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${
                        currentTextEdit.bold ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, italic: !currentTextEdit.italic})}
                      className={`px-4 py-2 rounded-lg italic font-medium transition-all ${
                        currentTextEdit.italic ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      I
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, underline: !currentTextEdit.underline})}
                      className={`px-4 py-2 rounded-lg underline font-medium transition-all ${
                        currentTextEdit.underline ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      U
                    </button>
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, highlight: !currentTextEdit.highlight})}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentTextEdit.highlight ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      title="Highlight (VEDIT-style)"
                    >
                      🖍️ H
                    </button>
                  </div>
                  
                  {/* Highlight Color Picker */}
                  {currentTextEdit.highlight && (
                    <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <label className="block text-yellow-300 text-sm font-medium mb-2">Highlight Color:</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          '#FFFF00', '#FFD700', '#FFA500', '#FF69B4', '#00FFFF', 
                          '#00FF00', '#FF00FF', '#FF0000', '#0000FF', '#FFFFFF'
                        ].map(color => (
                          <button
                            key={color}
                            onClick={() => setCurrentTextEdit({...currentTextEdit, highlightColor: color})}
                            className={`w-10 h-10 rounded border-2 transition-all ${
                              currentTextEdit.highlightColor === color ? 'border-white scale-110' : 'border-gray-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-yellow-300 mt-2">
                        💡 Highlight will appear behind your text like VEDIT professional editing!
                      </p>
                    </div>
                  )}
                </div>

                {/* Text Color (Extended Palette) */}
                <div>
                  <label className="block text-white font-medium mb-2">Text Color:</label>
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                      '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#00FF7F', '#4169E1'
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setCurrentTextEdit({...currentTextEdit, color})}
                        className={`w-10 h-10 rounded border-2 transition-all ${
                          currentTextEdit.color === color ? 'border-white scale-110' : 'border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-white font-medium mb-2">Background Color:</label>
                  <div className="grid grid-cols-8 gap-2">
                    <button
                      onClick={() => setCurrentTextEdit({...currentTextEdit, backgroundColor: 'transparent'})}
                      className={`w-10 h-10 rounded border-2 transition-all ${
                        currentTextEdit.backgroundColor === 'transparent' ? 'border-white scale-110' : 'border-gray-600 hover:scale-105'
                      }`}
                      style={{ 
                        background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, #999 25%, #999 75%, #f0f0f0 75%)',
                        backgroundSize: '10px 10px',
                        backgroundPosition: '0 0, 5px 5px'
                      }}
                      title="No background"
                    />
                    {[
                      '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                      '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#00FF7F', '#4169E1'
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setCurrentTextEdit({...currentTextEdit, backgroundColor: color})}
                        className={`w-10 h-10 rounded border-2 transition-all ${
                          currentTextEdit.backgroundColor === color ? 'border-white scale-110' : 'border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Stroke/Outline */}
                <div>
                  <label className="block text-white font-medium mb-2">Stroke Width: {currentTextEdit.strokeWidth}px</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={currentTextEdit.strokeWidth}
                    onChange={(e) => setCurrentTextEdit({...currentTextEdit, strokeWidth: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                {/* Time Controls - Only for Videos */}
                {videoTracks[0]?.type === 'video' && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Text Timing (Video Only)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm mb-2">Start Time (seconds):</label>
                        <input
                          type="number"
                          min="0"
                          max={videoTracks[0]?.duration || 60}
                          step="0.1"
                          value={currentTextEdit.startTime}
                          onChange={(e) => setCurrentTextEdit({...currentTextEdit, startTime: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="range"
                          min="0"
                          max={videoTracks[0]?.duration || 60}
                          step="0.1"
                          value={currentTextEdit.startTime}
                          onChange={(e) => setCurrentTextEdit({...currentTextEdit, startTime: parseFloat(e.target.value)})}
                          className="w-full mt-2"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm mb-2">End Time (seconds):</label>
                        <input
                          type="number"
                          min="0"
                          max={videoTracks[0]?.duration || 60}
                          step="0.1"
                          value={currentTextEdit.endTime}
                          onChange={(e) => setCurrentTextEdit({...currentTextEdit, endTime: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="range"
                          min="0"
                          max={videoTracks[0]?.duration || 60}
                          step="0.1"
                          value={currentTextEdit.endTime}
                          onChange={(e) => setCurrentTextEdit({...currentTextEdit, endTime: parseFloat(e.target.value)})}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Text will appear from {currentTextEdit.startTime}s to {currentTextEdit.endTime}s
                    </p>
                  </div>
                )}

                {videoTracks[0]?.type === 'image' && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm text-blue-300 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Text will appear permanently on the image (no timing needed)
                    </p>
                  </div>
                )}

                {/* AI Suggestions */}
                <div>
                  <button
                    onClick={handleGenerateAIText}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate AI Text Suggestions
                  </button>
                  
                  {aiTextSuggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-400">AI Suggestions (Click to use):</p>
                      {aiTextSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentTextEdit({...currentTextEdit, text: suggestion})}
                          className="w-full text-left px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-sm"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Background Music */}
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    Background Music (AI-Powered)
                  </h4>
                  
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={handleGenerateAIMusic}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Mood
                    </button>
                    <button
                      onClick={() => setShowMusicLibrary(true)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Music className="w-4 h-4" />
                      Browse Library
                    </button>
                  </div>

                  {suggestedMusic.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-2">AI Suggested Moods:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedMusic.map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setBackgroundMusic(mood)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                              backgroundMusic === mood
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {backgroundMusic && (
                    <div>
                      <label className="block text-white text-sm mb-2">
                        Selected: <span className="font-bold text-purple-400">{backgroundMusic}</span>
                      </label>
                      <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="w-4 h-4 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={musicVolume}
                          onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-white text-sm w-12">{musicVolume}%</span>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2 mt-2">
                        <p className="text-xs text-purple-300">
                          ✓ Music preference saved! This will be included when processing your video.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Text Overlays List */}
              {textOverlays.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Saved Text Overlays ({textOverlays.length}):</h4>
                  <div className="space-y-2">
                    {textOverlays.map((overlay, idx) => (
                      <div key={overlay.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium">{idx + 1}. {overlay.text}</p>
                          <p className="text-xs text-gray-400">
                            {overlay.position.charAt(0).toUpperCase() + overlay.position.slice(1)} • 
                            {overlay.fontSize}px • 
                            {overlay.bold && ' Bold'}
                            {overlay.italic && ' Italic'}
                            {overlay.underline && ' Underline'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCurrentTextEdit(overlay);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteText(overlay.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 border-t border-gray-700 pt-6">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleSaveText}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      {textOverlays.find(t => t.id === currentTextEdit?.id) ? 'Update' : 'Save'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleSaveText();
                      // Don't close the editor - keep editing
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span className="hidden sm:inline">Keep Editing</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowTextEditor(false);
                      setCurrentTextEdit(null);
                    }}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </div>
                
                <div className="mt-3 text-center text-xs text-gray-400">
                  💡 Tip: Use "Keep Editing" to save and continue adding more text/music
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Music Library Modal */}
        {showMusicLibrary && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
              onClick={() => setShowMusicLibrary(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Music className="w-6 h-6 text-purple-400" />
                      Free Music Library
                    </h2>
                    <button
                      onClick={() => setShowMusicLibrary(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {freeMusicLibrary.map((track) => (
                      <div key={track.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{track.name}</h3>
                            <p className="text-gray-400 text-sm">{track.mood}</p>
                          </div>
                          <audio controls className="ml-4">
                            <source src={track.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <button
                            onClick={() => {
                              setBackgroundMusic(track.name);
                              setShowMusicLibrary(false);
                            }}
                            className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center text-gray-400 text-sm">
                    ✨ These tracks are free to use for commercial purposes
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>

  );

}



export default function RealAIDashboardPage() {

  return (

    <ProtectedRoute>

      <RealAIDashboard />

    </ProtectedRoute>

  );

}






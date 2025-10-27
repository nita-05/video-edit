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
  Headphones as Headphones2,
  Calendar as CalendarIcon,
  Globe as GlobeIcon,
  Instagram as InstagramIcon,
  Youtube as YoutubeIcon,
  Twitter as TwitterIcon,
  Linkedin as LinkedinIcon,
  Facebook as FacebookIcon
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiService, API_BASE_URL } from '@/lib/api';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;

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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
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
    { id: 'default', name: 'Default Voice', voiceType: 'Natural', isActive: true, previewUrl: `${API_URL}/voice/sample/default.mp3` },
    { id: 'professional', name: 'Professional', voiceType: 'Business', isActive: false, previewUrl: `${API_URL}/voice/sample/professional.mp3` },
    { id: 'casual', name: 'Casual', voiceType: 'Friendly', isActive: false, previewUrl: `${API_URL}/voice/sample/casual.mp3` },
    { id: 'dramatic', name: 'Dramatic', voiceType: 'Theatrical', isActive: false, previewUrl: `${API_URL}/voice/sample/dramatic.mp3` }
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
    
    // Color & Effects
    { id: 'color-correction', name: 'Color Correction', description: 'Professional color correction', icon: <Palette className="w-5 h-5" />, color: 'purple', enabled: false, category: 'effects' },
    { id: 'auto-brightness', name: 'Auto Brightness', description: 'Automatic brightness adjustment', icon: <Wand2 className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'auto-contrast', name: 'Auto Contrast', description: 'Intelligent contrast enhancement', icon: <Wand2 className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'auto-saturation', name: 'Auto Saturation', description: 'Smart saturation adjustment', icon: <Wand2 className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'effects' },
    { id: 'auto-effects', name: 'Auto Effects', description: 'AI-generated visual effects', icon: <Sparkles className="w-5 h-5" />, color: 'pink', enabled: false, category: 'effects' },
    { id: 'filter-effects', name: 'Filter Effects', description: 'Apply artistic filters', icon: <Filter className="w-5 h-5" />, color: 'pink', enabled: false, category: 'effects' },
    
    // Audio Processing
    { id: 'audio-enhancement', name: 'Audio Enhancement', description: 'Noise reduction and normalization', icon: <Volume2 className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'audio' },
    { id: 'remove-silence', name: 'Remove Silence', description: 'Remove silent parts', icon: <VolumeX className="w-5 h-5" />, color: 'red', enabled: false, category: 'audio' },
    { id: 'remove-pauses', name: 'Remove Pauses', description: 'Remove speech pauses', icon: <Volume1 className="w-5 h-5" />, color: 'red', enabled: false, category: 'audio' },
    { id: 'normalize-volume', name: 'Normalize Volume', description: 'Volume level normalization', icon: <Volume2Icon className="w-5 h-5" />, color: 'blue', enabled: false, category: 'audio' },
    { id: 'remove-background-noise', name: 'Remove Background Noise', description: 'AI noise reduction', icon: <VolumeX className="w-5 h-5" />, color: 'red', enabled: false, category: 'audio' },
    { id: 'enhance-voice', name: 'Enhance Voice', description: 'Voice clarity enhancement', icon: <Mic2 className="w-5 h-5" />, color: 'blue', enabled: false, category: 'audio' },
    { id: 'auto-music', name: 'Auto Music', description: 'AI-generated background music', icon: <Music2 className="w-5 h-5" />, color: 'purple', enabled: false, category: 'audio' },
    
    // Text & Subtitles
    { id: 'subtitle-generation', name: 'Subtitle Generation', description: 'AI-generated subtitles', icon: <Mic className="w-5 h-5" />, color: 'cyan', enabled: false, category: 'text' },
    { id: 'auto-captions', name: 'Auto Captions', description: 'Automatic caption generation', icon: <Captions className="w-5 h-5" />, color: 'cyan', enabled: false, category: 'text' },
    { id: 'smart-titles', name: 'Smart Titles', description: 'AI-generated titles', icon: <Type className="w-5 h-5" />, color: 'blue', enabled: false, category: 'text' },
    { id: 'add-text', name: 'Add Text', description: 'Add text overlays', icon: <Type className="w-5 h-5" />, color: 'white', enabled: false, category: 'text' },
    { id: 'smart-graphics', name: 'Smart Graphics', description: 'AI-generated graphics', icon: <ImageIcon className="w-5 h-5" />, color: 'pink', enabled: false, category: 'text' },
    
    // Advanced AI
    { id: 'face-detection', name: 'Face Detection', description: 'Detect and track faces', icon: <Eye className="w-5 h-5" />, color: 'blue', enabled: false, category: 'advanced' },
    { id: 'object-detection', name: 'Object Detection', description: 'Detect objects in video', icon: <Target className="w-5 h-5" />, color: 'green', enabled: false, category: 'advanced' },
    { id: 'emotion-analysis', name: 'Emotion Analysis', description: 'Analyze emotions in video', icon: <Smile className="w-5 h-5" />, color: 'yellow', enabled: false, category: 'advanced' },
    { id: 'content-moderation', name: 'Content Moderation', description: 'AI content moderation', icon: <Shield className="w-5 h-5" />, color: 'red', enabled: false, category: 'advanced' },
    { id: 'auto-thumbnails', name: 'Auto Thumbnails', description: 'Generate video thumbnails', icon: <ImageIcon className="w-5 h-5" />, color: 'purple', enabled: false, category: 'advanced' },
    { id: 'smart-compression', name: 'Smart Compression', description: 'Intelligent video compression', icon: <Compress className="w-5 h-5" />, color: 'blue', enabled: false, category: 'advanced' },
    { id: 'quality-enhancement', name: 'Quality Enhancement', description: 'AI quality improvement', icon: <Wand2 className="w-5 h-5" />, color: 'purple', enabled: false, category: 'advanced' },
    { id: 'auto-format', name: 'Auto Format', description: 'Automatic format optimization', icon: <RefreshCw className="w-5 h-5" />, color: 'green', enabled: false, category: 'advanced' },
    { id: 'video-summarization', name: 'Video Summary', description: 'AI video summarization', icon: <Brain className="w-5 h-5" />, color: 'pink', enabled: false, category: 'advanced' }
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
          const response = await fetch(`${API_URL}/status/${jobId}`);
          const status = await response.json();
          
          setProcessingStep(status.status || 'Processing...');
          setProcessingProgress(status.progress || 0);
          
          if (status.status === 'COMPLETED' && status.result) {
            setProcessedVideoUrl(status.result.processed_video_url);
            if (status.result.captions_url) {
              setProcessedCaptionsUrl(`${API_URL}${status.result.captions_url}`);
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
      const response = await fetch(`${API_URL}/ai/chat`, {
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
      const response = await fetch(`${API_URL}/ai/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoCount: videoTracks.length })
      });
      
      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setAiSuggestions(['Error generating suggestions. Please try again.']);
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
      
      const res = await fetch(`${API_URL}/vport/connect/${endpoint}`);
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
        const r = await fetch(`${API_URL}/vport/status/youtube`);
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
      const response = await fetch(`${API_URL}/vport/schedule`, {
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
      
      const response = await fetch(`${API_URL}/voice/tts`, {
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

      // Upload to backend for processing - REQUIRED; then patch the clip's url
      try {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading file to server:', file.name);
        const uploadResponse = await fetch(`${API_URL}/upload`, {
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
        const up = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
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
        }
      };

      console.log('Sending AI merge request:', requestData);

      const performMerge = async (attempt: number): Promise<void> => {
        try {
          const res = await fetch(`${API_URL}/ai/merge`, {
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
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const enabledFeaturesCount = aiFeatures.filter(f => f.enabled).length;

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
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">REAL AI</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">1080p</div>
            <div className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">24fps</div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            {/* Header download removed to avoid duplicates; use sticky footer button only */}
            
            <div className="flex items-center space-x-2">
              <img 
                src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=0D8ABC&color=fff`}
                alt={session?.user?.name || 'User'} 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'User')}&background=0D8ABC&color=fff`;
                }}
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

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-gray-900" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Sidebar - Navigation */}
        <div className="w-full lg:w-64 bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-700 p-4 overflow-y-auto lg:overflow-y-auto flex-shrink-0">
          <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-white mb-6">Navigation</h2>
          </div>
          {/* Navigation tabs - responsive */}
          <nav className="flex lg:flex-col gap-2">
            {['editor', 'voice', 'effects', 'social'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap lg:w-full text-sm font-medium transition-colors flex-1 lg:flex-none ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area - Center */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 bg-black overflow-auto min-h-0 flex items-center justify-center p-4">
            {selectedClipsForMerge.length > 0 && videoTracks.length > 0 ? (
              <video
                src={processedVideoUrl || videoTracks[0].url}
                controls
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Select a clip to preview</p>
                <p className="text-sm">Upload files from the sidebar</p>
              </div>
            )}
          </div>

          {/* Timeline - Fixed height */}
          <div className="bg-gray-800 border-t border-gray-700 p-4 h-40 lg:h-32 overflow-y-auto flex-shrink-0">
            <h3 className="text-white font-medium mb-3 text-sm">Multi-Track Timeline</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((track) => (
                <div key={track} className="bg-gray-700 rounded p-3">
                  <p className="text-gray-300 text-sm mb-2">Track {track}</p>
                  <div className="flex flex-wrap gap-2">
                    {videoTracks
                      .filter((c) => c.track === track)
                      .map((clip) => (
                        <button
                          key={clip.id}
                          onClick={() => selectClip(clip)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            selectedClipsForMerge.includes(clip.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          {clip.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="font-bold">{selectedClipsForMerge.length} clip{selectedClipsForMerge.length !== 1 ? 's' : ''} selected</div>
                <div className="text-sm opacity-90">{enabledFeaturesCount} AI feature{enabledFeaturesCount !== 1 ? 's' : ''} enabled</div>
              </div>
              <button
                onClick={handleAIMerge}
                disabled={selectedClipsForMerge.length === 0}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start AI Processing
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Features (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto flex-col flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-lg">Real AI Features</h3>
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{enabledFeaturesCount}</span>
          </div>
          
          {/* File Upload */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="text-white font-medium mb-3 text-sm">Upload Media</h4>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">Click to upload</p>
                <p className="text-gray-500 text-xs">Videos</p>
              </div>
              <input
                type="file"
                multiple
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {/* AI Features by Category */}
          <div className="space-y-3 overflow-y-auto">
            {['video', 'audio', 'text', 'effects', 'advanced'].map((category) => (
              <div key={category} className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2 text-sm capitalize">{category} Features</h4>
                <div className="space-y-2">
                  {aiFeatures
                    .filter(f => f.category === category)
                    .map((feature) => (
                      <label key={feature.id} className="flex items-start space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feature.enabled}
                          onChange={() => toggleAIFeature(feature.id)}
                          className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-300 text-xs font-medium">{feature.name}</div>
                          <div className="text-gray-500 text-xs">{feature.description}</div>
                        </div>
                      </label>
                    ))}
                  {/* Burn-in toggle */}
                  {category === 'text' && (
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={burnInSubtitles}
                        onChange={() => setBurnInSubtitles(!burnInSubtitles)}
                        className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-300 text-xs font-medium">Burn-in Subtitles</div>
                        <div className="text-gray-500 text-xs">Embeds captions into video</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
                
                <h3 className="text-xl font-semibold text-white mb-2">Real AI Processing</h3>
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
                <p className="text-xs text-gray-500 mt-2">Using Real AI - No Fallbacks</p>
              </div>
            </motion.div>
          </motion.div>
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

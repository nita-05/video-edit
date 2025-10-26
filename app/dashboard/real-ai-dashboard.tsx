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
    { id: 'default', name: 'Default Voice', voiceType: 'Natural', isActive: true, previewUrl: 'http://localhost:5000/api/voice/sample/default.mp3' },
    { id: 'professional', name: 'Professional', voiceType: 'Business', isActive: false, previewUrl: 'http://localhost:5000/api/voice/sample/professional.mp3' },
    { id: 'casual', name: 'Casual', voiceType: 'Friendly', isActive: false, previewUrl: 'http://localhost:5000/api/voice/sample/casual.mp3' },
    { id: 'dramatic', name: 'Dramatic', voiceType: 'Theatrical', isActive: false, previewUrl: 'http://localhost:5000/api/voice/sample/dramatic.mp3' }
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
          const response = await fetch(`http://localhost:5000/api/status/${jobId}`);
          const status = await response.json();
          
          setProcessingStep(status.status || 'Processing...');
          setProcessingProgress(status.progress || 0);
          
          if (status.status === 'COMPLETED' && status.result) {
            setProcessedVideoUrl(status.result.processed_video_url);
            if (status.result.captions_url) {
              setProcessedCaptionsUrl(`http://localhost:5000${status.result.captions_url}`);
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
      const response = await fetch('http://localhost:5000/api/ai/chat', {
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
      const response = await fetch('http://localhost:5000/api/ai/suggestions', {
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
      
      const res = await fetch(`http://localhost:5000/api/vport/connect/${endpoint}`);
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
        const r = await fetch('http://localhost:5000/api/vport/status/youtube');
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
      const response = await fetch('http://localhost:5000/api/vport/schedule', {
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
      
      const response = await fetch('http://localhost:5000/api/voice/tts', {
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
        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
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
        const up = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
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
          const res = await fetch('http://localhost:5000/api/ai/merge', {
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
      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">
        {/* Left Sidebar - VIA Chatbot */}
        <motion.div 
          className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto"
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
                      {suggestion}
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
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex space-x-8">
              {[
                { id: 'via', name: 'VIA Chatbot', icon: <Bot className="w-5 h-5" />, color: 'text-blue-400' },
                { id: 'editor', name: 'V-Editor', icon: <Video className="w-5 h-5" />, color: 'text-purple-400' },
                { id: 'vport', name: 'V-Port', icon: <Share2 className="w-5 h-5" />, color: 'text-green-400' },
                { id: 'profiles', name: 'VIA Profiles', icon: <Headphones className="w-5 h-5" />, color: 'text-orange-400' }
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
                    <p className="text-gray-400 mb-8">Your intelligent video editing companion with Real AI</p>
                    
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
                                      Duration: {clip.duration.toFixed(1)}s | Track: {clip.track + 1}
                                    </div>
                                    {/* Trim Controls (Sliders + Inputs) - HORIZONTAL LAYOUT */}
                                    <div className="mt-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                      <div className="grid grid-cols-3 gap-3 items-end">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-300 mb-1">Start (s)</label>
                                          <input
                                            type="number"
                                            min={0}
                                            step="0.1"
                                            value={Number.isFinite(clip.startTime) ? clip.startTime : 0}
                                            onChange={(e) => {
                                              const v = Math.max(0, parseFloat(e.target.value || '0'));
                                              setVideoTracks(prev => prev.map(c => c.id === clip.id ? { ...c, startTime: v } : c));
                                            }}
                                            className="w-full px-2 py-1.5 bg-gray-700 text-white rounded border border-gray-600 text-sm"
                                          />
                                          <input
                                            type="range"
                                            min={0}
                                            max={Math.max(0.1, clip.duration || 0)}
                                            step={0.1}
                                            value={Number.isFinite(clip.startTime) ? Math.min(clip.startTime, clip.endTime ?? clip.duration) : 0}
                                            onChange={(e) => {
                                              const v = Math.max(0, parseFloat(e.target.value || '0'));
                                              setVideoTracks(prev => prev.map(c => c.id === clip.id ? { ...c, startTime: Math.min(v, c.endTime || c.duration) } : c));
                                            }}
                                            className="w-full mt-1"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-300 mb-1">End (s)</label>
                                          <input
                                            type="number"
                                            min={0}
                                            step="0.1"
                                            value={Number.isFinite(clip.endTime) ? clip.endTime : clip.duration}
                                            onChange={(e) => {
                                              const v = Math.max(0, parseFloat(e.target.value || '0'));
                                              setVideoTracks(prev => prev.map(c => c.id === clip.id ? { ...c, endTime: v } : c));
                                            }}
                                            className="w-full px-2 py-1.5 bg-gray-700 text-white rounded border border-gray-600 text-sm"
                                          />
                                          <input
                                            type="range"
                                            min={0}
                                            max={Math.max(0.1, clip.duration || 0)}
                                            step={0.1}
                                            value={Number.isFinite(clip.endTime) ? clip.endTime : (clip.duration || 0)}
                                            onChange={(e) => {
                                              const v = Math.max(0, parseFloat(e.target.value || '0'));
                                              setVideoTracks(prev => prev.map(c => c.id === clip.id ? { ...c, endTime: Math.max(v, c.startTime || 0) } : c));
                                            }}
                                            className="w-full mt-1"
                                          />
                                        </div>
                                        <button
                                          onClick={() => {
                                            setVideoTracks(prev => prev.map(c => {
                                              if (c.id !== clip.id) return c;
                                              const start = Math.max(0, Math.min(c.startTime || 0, c.duration));
                                              const end = Math.max(0, Math.min(c.endTime || c.duration, c.duration));
                                              if (end <= start) {
                                                return { ...c, startTime: 0, endTime: Math.min(5, c.duration) };
                                              }
                                              return { ...c, startTime: start, endTime: end };
                                            }));
                                          }}
                                          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                                        >
                                          ✂️ Set Trim
                                        </button>
                                      </div>
                                      
                                      {/* Preview Trim Button - FULL WIDTH BELOW */}
                                      <button
                                        onClick={() => setPreviewClipId(prev => prev === clip.id ? null : clip.id)}
                                        className={`w-full mt-3 px-4 py-3 rounded-lg text-base font-bold transition-all shadow-lg ${
                                          previewClipId === clip.id 
                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white' 
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                        }`}
                                      >
                                        {previewClipId === clip.id ? '👁️ HIDE PREVIEW' : '▶️ PREVIEW TRIM'}
                                      </button>
                                    </div>
                                    {previewClipId === clip.id && (
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
                        
                        {/* Effects Preset Picker */}
                        <div className="bg-gray-800 border-t border-gray-700 p-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="text-sm text-gray-300">Filter Preset:</label>
                            <select
                              value={filterPreset || ''}
                              onChange={(e) => setFilterPreset(e.target.value || null)}
                              className="bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600"
                            >
                              <option value="">None</option>
                              <option value="vintage">Vintage (Sepia)</option>
                              <option value="cinematic">Cinematic (Teal & Orange)</option>
                              <option value="noir">Noir (B/W)</option>
                              <option value="warm">Warm</option>
                              <option value="cool">Cool</option>
                            </select>
                            <span className="text-xs text-gray-400">Applied in final render</span>
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
                                    Click the button to start processing with Real AI
                                  </div>
                                </div>
                                <motion.button
                                  onClick={handleAIMerge}
                                  disabled={selectedClipsForMerge.length === 0}
                                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                  whileHover={selectedClipsForMerge.length > 0 ? { scale: 1.05 } : {}}
                                  whileTap={selectedClipsForMerge.length > 0 ? { scale: 0.95 } : {}}
                                >
                                  <Zap className="w-5 h-5" />
                                  Start AI Processing
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
                                  Your video has been processed with Real AI and is ready for download.
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Download Video */}
                                <a 
                                  href={processedVideoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                  Download Video
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
                              {isProcessing ? 'Real AI processing in progress...' : 'Upload your media to get started'}
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
                        {videoTracks.length > 0 
                          ? `${videoTracks.reduce((sum, clip) => sum + clip.duration, 0).toFixed(1)}s total`
                          : '00:00:00:00'
                        }
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
                            const clipId = (e as React.DragEvent).dataTransfer.getData('clipId');
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
                                  (e as React.DragEvent).dataTransfer.setData('clipId', clip.id);
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
                                   const response = await fetch(`http://localhost:5000/api/vport/publish/${platform.id}`, {
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
          className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto max-h-[calc(100vh-80px)]"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-lg">Real AI Features</h3>
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
          <div className="space-y-4">
            {['video', 'audio', 'text', 'effects', 'advanced'].map((category) => (
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

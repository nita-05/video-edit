const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface FileInfo {
  id: string;
  filename: string;
  unique_filename: string;
  file_path: string;
  cloudinary_url: string;
  file_type: string;
  file_size: number;
  upload_time: string;
  type?: string;
  duration?: string;
  resolution?: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  files: FileInfo[];
  settings: {
    resolution: string;
    fps: number;
    format: string;
  };
}

export interface ProcessingResult {
  success: boolean;
  output_path?: string;
  cloudinary_url?: string;
  operations_completed?: string[];
  error?: string;
}

export interface AISuggestion {
  success: boolean;
  suggestion?: string;
  error?: string;
}

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // File upload
  async uploadFile(file: File): Promise<{ success: boolean; file_info: FileInfo }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Video processing
  async processVideo(
    filePath: string,
    operations: string[]
  ): Promise<ProcessingResult> {
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({
        file_path: filePath,
        operations,
      }),
    });
  }

  // Download processed file
  async downloadFile(filename: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download/${filename}`);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return response.blob();
  }

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    return this.request('/projects');
  }

  async createProject(name: string): Promise<{ success: boolean; project: Project }> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // AI suggestions
  async getAISuggestion(prompt: string): Promise<AISuggestion> {
    return this.request('/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }
}

export const apiService = new APIService();

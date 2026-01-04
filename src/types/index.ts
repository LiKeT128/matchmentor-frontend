// Authentication types
export interface User {
    id: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user?: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

// Match types
export interface Match {
    id: string;
    user_id: string;
    filename: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}

export interface MatchAnalysis {
    match_id: string;
    hero: string;
    duration: number;
    result: 'win' | 'loss';
    kills: number;
    deaths: number;
    assists: number;
    gpm: number;
    xpm: number;
    last_hits: number;
    denies: number;
    insights: AnalysisInsight[];
    created_at: string;
}

export interface AnalysisInsight {
    type: 'tip' | 'improvement' | 'strength' | 'weakness';
    category: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

export interface UploadResponse {
    match_id: string;
    status: string;
    message: string;
}

// Coach types
export interface Coach {
    id: string;
    name: string;
    avatar_url: string;
    specialization: string[];
    rating: number;
    reviews_count: number;
    hourly_rate: number;
    bio: string;
    available: boolean;
}

// API Error type
export interface ApiError {
    detail: string;
    status_code?: number;
}

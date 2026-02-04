export interface ResumeResult {
    enhanced_text: string;
    bullet_points: string[];
    ats_keywords: string[];
    ats_score: number;
    readability_flesch: number;
    original_readability_flesch?: number;
    readability_kincaid: number;
    original_readability_kincaid?: number;
    strengths?: string[];
    suggestions?: string[];
}

export interface User {
    email: string;
    id: number;
}

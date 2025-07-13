// API Configuration
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' // Use proxy in development
  : (import.meta.env.VITE_API_BASE_URL || 'http://t9d.store/api'); // Use direct URL in production
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEuY2hlcmthc292QGlubm9wb2xpcy51bml2ZXJzaXR5IiwiZXhwIjoxNzUxODI3Mzg1LCJpYXQiOjE3NTE3NDA5ODUsImF1ZCI6InNwb3J0In0.Fr3cpK1hQtdqZC5-5F-l9NM-iH-AEfACo68o-psshq2BhYhOwjGdwIGEcxgZxWPu5ITU3Vxzd7kapYNGM_2xEqy7m_V8u8sqmY-Ujg9STgitaq_s6AiJqX7SvsDt1dFrR4HHUiJmlp09sihXVSJ9FDXKx_t3G6xs2eDL9oiBZSK_wYCUjOqPCnv1J7zf0A2OPyH4Aj55ep1tVN3U6Xw-sbvA4kom294ZiymmWiDNpVZNVCZPB6LTqF_Gfw68zFJiv1f8UsKEBylMRrpbqT0RyigaWFueYxpRlOj9NXO-Q1MW1gm__A4vXtrKBCY2dBWY8QpqRNmNYSuD6sw74TqvaQ';

// API Error handling
class APIError extends Error {
  constructor(public status: number, public statusText: string, public details?: any) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    mode: 'cors', // Explicitly enable CORS
    credentials: 'omit', // Don't send credentials
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorDetails = await response.json().catch(() => null);
      
      // Log detailed error information for debugging
      console.error(`API Error: ${response.status} ${response.statusText}`, {
        url,
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      });
      
      throw new APIError(response.status, response.statusText, errorDetails);
    }
    
    // Handle empty responses
    const text = await response.text();
    if (!text) return null as T;
    
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof APIError) {
      // For 401/403 errors, provide a more helpful message
      if (error.status === 401 || error.status === 403) {
        console.warn(`Authentication error for ${url}. Token may be expired or invalid.`);
        throw new Error(`Authentication failed: ${error.details?.detail || 'Access denied'}`);
      }
      throw error;
    }
    
    // Handle CORS errors and other network issues
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn(`CORS or network error for ${url}. Using fallback data.`);
      throw new Error(`Network error: Unable to connect to API at ${url}. This might be a CORS issue or the server is unavailable.`);
    }
    
    throw new Error(`Network error: ${error}`);
  }
}

// Types for FAQ
export interface FAQResponse {
  [question: string]: string;
}

// Types for Clubs
export interface ClubGroup {
  id: number;
  name: string;
  description: string;
  capacity: number;
  current_enrollment: number;
  free_places: number;
  is_club: boolean;
  accredited: boolean;
  is_enrolled: boolean;
  schedule: Array<{
    weekday: number;
    weekday_name: string;
    start_time: string;
    end_time: string;
    training_class: string;
  }>;
  trainers: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  allowed_medical_groups: string[];
}

export interface Club {
  id: number;
  name: string;
  description: string;
  groups: ClubGroup[];
  total_groups: number;
  total_free_places: number;
}

export type ClubsResponse = Club[];

// FAQ API
export const faqAPI = {
  /**
   * Get all FAQ entries as a dictionary
   */
  getFAQ: async (): Promise<FAQResponse> => {
    return apiRequest<FAQResponse>('/faq');
  }
};

// Clubs API
export const clubsAPI = {
  /**
   * Get all available clubs with detailed groups information
   */
  getClubs: async (): Promise<ClubsResponse> => {
    return apiRequest<ClubsResponse>('/clubs');
  }
};

export default apiRequest;
export { APIError };

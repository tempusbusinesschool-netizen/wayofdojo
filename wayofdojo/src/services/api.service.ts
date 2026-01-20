/**
 * 🌐 API SERVICE
 * Service centralisé pour les appels API
 * Gère automatiquement le préfixe d'API selon l'environnement
 */

const API_PREFIX = typeof window !== 'undefined' && window.location.hostname.includes('preview.emergentagent.com') 
  ? '/next-api' 
  : '/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('wayofdojo_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_PREFIX}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profile?: string;
    sport?: string;
    grade?: string;
    locale?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    
    const queryString = searchParams.toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request('/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ userId, role }),
    });
  }

  // Stages endpoints
  async getStages(params?: { sport?: string; level?: string; search?: string; upcoming?: boolean; featured?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.sport) searchParams.set('sport', params.sport);
    if (params?.level) searchParams.set('level', params.level);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.upcoming) searchParams.set('upcoming', 'true');
    if (params?.featured) searchParams.set('featured', 'true');
    
    const queryString = searchParams.toString();
    return this.request(`/stages${queryString ? `?${queryString}` : ''}`);
  }

  async getStage(id: string) {
    return this.request(`/stages/${id}`);
  }

  async createStage(stageData: Record<string, unknown>) {
    return this.request('/stages', {
      method: 'POST',
      body: JSON.stringify(stageData),
    });
  }

  async updateStage(id: string, stageData: Record<string, unknown>) {
    return this.request(`/stages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stageData),
    });
  }

  async deleteStage(id: string) {
    return this.request(`/stages/${id}`, {
      method: 'DELETE',
    });
  }

  async seedStages() {
    return this.request('/stages/seed', {
      method: 'POST',
    });
  }

  // Gamification endpoints
  async addXp(amount: number, reason?: string) {
    return this.request('/gamification/xp', {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  }

  async completeChallenge(challengeId: string, virtueId?: string) {
    return this.request('/gamification/challenge', {
      method: 'POST',
      body: JSON.stringify({ challengeId, virtueId }),
    });
  }

  async updateTechniqueProgress(techniqueId: string, status: string, kyuId?: string) {
    return this.request('/gamification/technique', {
      method: 'POST',
      body: JSON.stringify({ techniqueId, status, kyuId }),
    });
  }

  async getProgress() {
    return this.request('/gamification/progress');
  }

  async recordDailyLogin() {
    return this.request('/gamification/progress', {
      method: 'POST',
    });
  }

  async getBadges() {
    return this.request('/gamification/badges');
  }

  async checkBadges() {
    return this.request('/gamification/badges', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;

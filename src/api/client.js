const API_BASE_URL = 'https://nickly24-tgbot-cpm-8f22.twc1.net/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API Error');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Служебные endpoints
  async checkHealth() {
    return this.request('/health');
  }

  async getStatuses() {
    return this.request('/statuses');
  }

  async getStats() {
    return this.request('/stats');
  }

  // Чаты
  async getChats() {
    return this.request('/chats');
  }

  async getChatHistory(chatId) {
    return this.request(`/chats/${chatId}`);
  }

  async sendMessage(chatId, message, adminName = 'Администратор') {
    return this.request(`/chats/${chatId}/send`, {
      method: 'POST',
      body: JSON.stringify({ message, admin_name: adminName }),
    });
  }

  async markAsRead(chatId) {
    return this.request(`/chats/${chatId}/mark-read`, {
      method: 'POST',
    });
  }

  // Пользователи
  async getUserInfo(chatId) {
    return this.request(`/chats/${chatId}/user`);
  }

  async updateUserName(chatId, name) {
    return this.request(`/chats/${chatId}/name`, {
      method: 'PUT',
      body: JSON.stringify({ name: name.trim() }),
    });
  }

  async deleteChat(chatId) {
    return this.request(`/chats/${chatId}`, {
      method: 'DELETE',
    });
  }

  async getUserStatus(chatId) {
    return this.request(`/chats/${chatId}/status`);
  }

  async updateUserStatus(chatId, status) {
    return this.request(`/chats/${chatId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Массовая рассылка
  async sendBroadcast(message, statuses = null, adminName = 'Администратор') {
    const body = { message, admin_name: adminName };
    if (statuses && statuses.length > 0) {
      body.statuses = statuses;
    }
    
    return this.request('/broadcast', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();


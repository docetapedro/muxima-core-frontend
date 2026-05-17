import http from './http'

export const authApi = {
  login: (credentials) =>
    http.post('/api/login', credentials),

  logout: () =>
    http.post('/api/logout'),

  refresh: (refreshToken) =>
    http.post('/api/refresh-token', { refresh_token: refreshToken }),

  me: () =>
    http.get('/api/user'),

  sessions: () =>
    http.get('/api/auth/sessions'),

  revokeSession: (tokenId) =>
    http.delete(`/api/auth/sessions/${tokenId}`),
}

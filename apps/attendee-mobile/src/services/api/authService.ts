import attendeeApiClient from './attendeeApiClient';

export const authService = {
  loginWithEmail: (credentials: { email: string; password: string }) => 
    attendeeApiClient.post('/auth/login', credentials),
  
  loginWithQR: (qrData: { data: string }) => 
    attendeeApiClient.post('/auth/qr-verify', qrData),
  
  verifyMFA: (code: string) => 
    attendeeApiClient.post('/auth/verify-mfa', { code }),
  
  refreshToken: (refreshToken: string) => 
    attendeeApiClient.post('/auth/refresh-token', { refreshToken }),
  
  logout: () => 
    attendeeApiClient.post('/auth/logout'),
};

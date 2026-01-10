
import request from 'supertest';
import { app }  from '../app'


// Clear
export const requestDelete = async () => {
  return await request(app).delete('/clear');
};

// Auth
export const requestAuthRegister = async (firstName: string, lastName: string, password: string, email: string) => {
  return await request(app).post('/auth/register').send({ firstName, lastName, password, email });
};

export const requestAuthLogin = async (email: string, password: string) => {
  return await request(app)
    .post('/auth/login')
    .send({ email, password });
};

export const requestAuthUserDetails = async (token: string) => {
  return await request(app)
    .get('/auth/user-details')
    .set('Authorization', `Bearer ${token}`);
};

export const requestVerifyEmail = async (verificationCode: string) => {
  return await request(app).post('/auth/verify-email').send({verificationCode});
}

export const requestResendVerification = async (email: string) => {
  return await request(app).post('/auth/resend-verification').send({email})
}

export const requestRefreshToken = async (cookie: string) => {
  return await request(app)
    .post('/auth/refresh')
    .set('Cookie', cookie);
};

export const resetPassword = async (resetCode: string, newPassword: string) => {
  return await request(app).post('/auth/reset-password').send({resetCode, newPassword});
}

export const requestVerifyResetCode = async(resetCode: string) => {
  return await request(app).post('/auth/verify-reset-code').send({resetCode})
}

export const requestResetPassword = async (email: string) => {
  return await request(app).post('/auth/request-reset-password').send({email})
}



import request from 'supertest';
import { app }  from '../server'



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

export const requestAuthLogout = async (accessToken: string, cookie: string) => {
  return await request(app)
    .post('/auth/logout')
    .set('Cookie', cookie)
    .set('Authorization', `Bearer ${accessToken}`);
};

export const requestRefreshToken = async (cookie: string) => {
  return await request(app)
    .post('/auth/refresh')
    .set('Cookie', cookie);
};



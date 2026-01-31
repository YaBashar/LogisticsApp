
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

export const requestChangePassword = async (token: string, currentPassword: string, newPassword: string) => {
  return await request(app)
    .post('/auth/change-password')
    .send({currentPassword, newPassword})
    .set('Authorization', `Bearer ${token}`);
};

export const requestVerifyEmail = async (verificationCode: string) => {
  return await request(app).post('/auth/verify-email').send({verificationCode});
}

export const requestResendVerification = async (email: string) => {
  return await request(app).post('/auth/resend-verification').send({email})
}

export const requestResendResetCode = async (email: string) => {
  return await request(app).post('/auth/resend-reset-code').send({email});
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


// ShipmentCustomers
export const requestNewShipment = async (
    token: string, 
    packageType: string,
    itemDescription: string, 
    quantity: number, 
    weight: number,
    height: number,
    width: number,
    length: number,
    destination: string, 
    origin: string,
    senderEmail: string,
    senderPhone: string,
    recipientEmail: string,
    recipientPhone: string
) => {
  return await request(app).post('/shipments-customer/')
    .send({ packageType, itemDescription, quantity, weight, height, width, length, origin, destination, senderEmail, senderPhone, recipientEmail, recipientPhone })
    .set('Authorization', `Bearer ${token}`);
}

export const requestCompletedShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get('/shipments-customer/completed')
    .query({ page, limit})
    .set('Authorization', `Bearer ${token}`);
}

export const requestActiveShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get('/shipments-customer/active')
    .set('Authorization', `Bearer ${token}`)
    .query({ page, limit});
}

// Admin Customer
export const requestAllActiveShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get('/shipments-admin/active')
    .query({ page, limit})
    .set('Authorization', `Bearer ${token}`);
}

export const requestUpdateShipmentStatus = async (token: string, shipmentId: string, status: string) => {
  return (await request(app).put(`/shipments-admin/${shipmentId}/status`)
        .send({ status })
        .set('Authorization', `Bearer ${token}`)
      )
}
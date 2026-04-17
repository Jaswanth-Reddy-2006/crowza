import * as admin from 'firebase-admin';

export const initAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
};

export const verifyToken = async (token: string) => {
  return admin.auth().verifyIdToken(token);
};

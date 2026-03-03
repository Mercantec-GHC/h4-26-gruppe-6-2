import { updateUser } from '../api';

export const updateUserService = async (token: string, userData: {
  username?: string;
  email?: string;
  passwordHash?: string;
}) => {
  return await updateUser(token, userData);
};
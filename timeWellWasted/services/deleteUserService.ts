import { deleteUser } from '../api';

export const deleteUserService = async (token: string) => {
  console.log("DeletedUserService loaded with token:", token); // DEV PURPOSE, LEAVE OUT OF PRODUCTION
  return await deleteUser(token);
};
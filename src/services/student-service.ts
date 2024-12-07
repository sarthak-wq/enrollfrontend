import axios from 'axios';
import { User } from '../models/UserModel';
import { SERVER_URL } from './config';

/**
 * Fetches student data from the server.
 * 
 * This function makes a GET request to the server's user profile endpoint.
 * The server is expected to return a `User` object.
 *
 * @returns {Promise<User>} A Promise that resolves to the student's profile data.
 * @throws {Error} If the request fails or the server does not return valid data.
 */
export const getStudentData = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${SERVER_URL}/user/profile`,{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw new Error('Unable to fetch student data.');
  }
};

/**
 * Updates student data on the server.
 * 
 * This function makes a PUT request to the server's user profile endpoint with the updated data.
 * The data provided can be a partial object containing only the fields that need to be updated.
 *
 * @param {Partial<User>} updatedData - A partial object containing the updated student data.
 * @returns {Promise<void>} A Promise that resolves when the update is successfully completed.
 * @throws {Error} If the request fails or the server does not process the update.
 */
export const updateStudentData = async (
  updatedData: Partial<User>
): Promise<void> => {
  try {
    await axios.put(`${SERVER_URL}/user/profile`, updatedData, { withCredentials: true });
  } catch (error) {
    console.error('Error updating student data:', error);
    throw new Error('Unable to update student data.');
  }
};

/**
 * Uploads a new profile image for the student.
 * 
 * This function makes a PUT request to the server's profile image endpoint with the uploaded image file.
 * It uses `FormData` to package the file for the request.
 *
 * @param {File} file - The image file to be uploaded as the new profile picture.
 * @returns {Promise<void>} A Promise that resolves when the image upload is successfully completed.
 * @throws {Error} If the request fails or the server does not process the image upload.
 */
export const uploadProfileImage = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    await axios.put(`${SERVER_URL}/user/profile/image`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Unable to upload profile image.');
  }
};

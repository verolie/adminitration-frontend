import axios from 'axios';
import { API_BASE_URL } from '@/utils/config';

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    is_employee: boolean;
  };
}

export const getUserData = async (token: string): Promise<UserResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch user data');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error fetching user data:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
}; 
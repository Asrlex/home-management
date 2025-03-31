import axios from 'axios';
import api_config from '../config/apiconfig';

export const axiosRequest = async (method, url, params = {}, body = {}, token = '') => {
  try {
    const authToken = token || localStorage.getItem('token') || '';

    const response = await axios({
      method,
      url,
      headers: {
        'X-api-key': api_config.global_api_key,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      params,
      data: body,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

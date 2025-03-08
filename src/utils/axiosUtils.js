import axios from 'axios';
import api_config from '../config/apiconfig';

export const axiosRequest = async (method, url, params = {}, body = {}) => {
  try {
    const response = await axios({
      method,
      url,
      headers: {
        'X-api-key': api_config.global_api_key,
      },
      params,
      data: body,
    });
    return response.data.data;
  } catch (error) {
    console.error('Axios request error:', error);
    throw error;
  }
};
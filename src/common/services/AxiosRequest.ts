import { RequestException } from '@/common/exceptions/request.exception';
import { HttpEnum } from '@/entities/enums/http.enum';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import axios from 'axios';

export const axiosRequest = async (method: HttpEnum, url: string, params: any = {}, body: any = {}, token: string = '') => {
  try {
    const authToken = token || localStorage.getItem(StoreEnum.TOKEN) || '';

    const response = await axios({
      method,
      url,
      headers: {
        'X-api-key': import.meta.env.VITE_API_KEY,
        'Content-Type': HttpEnum.APPLICATION_JSON,
        'Accept': HttpEnum.CONTENT_TYPE_JSON,
        ...(authToken && {
          'Authorization': `${HttpEnum.BEARER} ${authToken}`
        }),
      },
      params,
      data: body,
    });
    return response.data.data;
  } catch (error) {
    throw new RequestException(
      error?.response?.data?.message || error?.message || 'An error occurred while making the request.'
    );
  }
};

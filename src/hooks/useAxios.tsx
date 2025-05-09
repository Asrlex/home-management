import { RequestException } from '@/common/exceptions/request.exception';
import { HttpEnum } from '@/entities/enums/http.enum';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import axios, { AxiosResponse } from 'axios';

interface AxiosRequestConfig<T = any> {
  method: HttpEnum;
  url: string;
  params?: Record<string, any>;
  body?: T;
  token?: string;
}

export const axiosRequest = async <T = any, R = any>(
  method: HttpEnum,
  url: string,
  params: Record<string, any> = {},
  body: T = {} as T,
  token: string = ''
): Promise<R> => {
  try {
    const authToken = token || localStorage.getItem(StoreEnum.TOKEN) || '';

    const response: AxiosResponse<R> = await axios({
      method,
      url,
      headers: {
        'X-api-key': import.meta.env.VITE_API_KEY,
        'Content-Type': HttpEnum.APPLICATION_JSON,
        'Accept': HttpEnum.CONTENT_TYPE_JSON,
        ...(authToken && {
          'Authorization': `${HttpEnum.BEARER} ${authToken}`,
        }),
      },
      params,
      data: body,
    });

    return response.data;
  } catch (error: any) {
    throw new RequestException(
      error?.response?.data?.message || error?.message || 'An error occurred while making the request.'
    );
  }
};
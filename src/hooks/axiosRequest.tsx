import { RequestException } from '@/common/exceptions/request.exception';
import { HttpEnum } from '@/entities/enums/http.enum';
import { FormattedResponseI } from '@/entities/types/api.entity';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import axios, { AxiosResponse } from 'axios';

interface AxiosRequestConfig<T = any> {
  method: HttpEnum;
  url: string;
  params?: Record<string, any>;
  body?: T;
  token?: string;
}

export const axiosRequest = async <T = any>(
  method: HttpEnum,
  url: string,
  params: Record<string, any> = {},
  body: T = {} as T,
  token: string = ''
): Promise<FormattedResponseI> => {
  try {
    if (!navigator.onLine) {
      throw new RequestException('No internet connection.');
    }
    
    const authToken = token || localStorage.getItem(StoreEnum.TOKEN) || '';

    const response = await axios({
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

    const formattedResponse: FormattedResponseI = response.data as FormattedResponseI;

    return formattedResponse;
  } catch (error: any) {
    throw new RequestException(
      error?.response?.data?.message || error?.message || 'An error occurred while making the request.'
    );
  }
};
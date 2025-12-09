import { RequestException } from '@/common/exceptions/request.exception';
import { HttpEnum } from '@/entities/enums/http.enum';
import { FormattedResponseI } from '@/entities/types/api.entity';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import axios from 'axios';
import { addRequest } from './offline/offlineQueue';

export const axiosRequest = async <T extends object>(
  method: HttpEnum,
  url: string,
  params: Record<string, string | number | boolean> = {},
  body: T = {} as T,
  token: string = ''
): Promise<FormattedResponseI> => {
  try {
    const authToken = token || localStorage.getItem(StoreEnum.TOKEN) || '';
    const headers = {
      'X-api-key': import.meta.env.VITE_API_KEY as string,
      'Content-Type': HttpEnum.APPLICATION_JSON,
      Accept: HttpEnum.APPLICATION_JSON,
      ...(authToken && {
        Authorization: `${HttpEnum.BEARER} ${authToken}`,
      }),
    };
    if (method === HttpEnum.POST && !navigator.onLine) {
      await addRequest({ method, url, headers, params, body });
      console.log('Request queued for offline sync:', { method, url });
      return;
    }

    const response = await axios({
      method,
      url,
      headers,
      params,
      data: body,
    });

    const formattedResponse: FormattedResponseI =
      response.data as FormattedResponseI;

    return formattedResponse;
  } catch (error) {
    throw new RequestException(
      error?.response?.data?.message ||
        error?.message ||
        'An error occurred while making the request.'
    );
  }
};

export enum HttpEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',

  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',

  API_KEY = 'X-api-key',
  CONTENT_TYPE = 'Content-Type',
  ACCEPT = 'Accept',
  AUTH = 'Authorization',
  BEARER = 'Bearer',
  CONTENT_TYPE_JSON = 'application/json',
  APPLICATION_JSON = 'application/json',
  CONTENT_TYPE_FORM_URLENCODED = 'application/x-www-form-urlencoded',
  CONTENT_TYPE_MULTIPART = 'multipart/form-data',
  CONTENT_TYPE_TEXT = 'text/plain',
}

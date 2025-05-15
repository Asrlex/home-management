export enum UserExceptionMessages {
  LoginException = 'Error logging in user: ',
  SignupException = 'Error registering user: ',
  TokenValidationException = 'Error validating token: ',
  TokenExpiredOrInvalid = 'Token expired or invalid. Logging out...',
}

export enum UserExceptionNames {
  LoginException = 'LoginException',
  SignupException = 'RegisterException',
  TokenValidationException = 'TokenValidationException',
  TokenExpiredOrInvalid = 'TokenExpiredOrInvalid',
}

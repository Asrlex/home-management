const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const ApiEndpoints = {
  base: API_BASE_URL,
  hm: '/home-management',
  hm_url: `${API_BASE_URL}/home-management`,
  health_check_url: `${API_BASE_URL}/control/health`,
} as const;

export enum AuthEndpoints {
  // base_url
  me = '/auth/me',
  login = '/auth/login',
  signup = '/auth/signup',
  logout = '/auth/logout',
  pairBiometricsRegister = '/auth/biometrics/register',
  biometricsAuth = '/auth/biometrics/authenticate',
  biometricsAuthOptions = '/auth/biometrics/options',
}

export enum SettingsEndpoints {
  // home_management_url
  base = '/settings',
  byID = '/settings/id/',
}

export enum TareasEndpoints {
  // home_management_url
  base = '/tasks',
  all = '/tasks/all',
  completed = '/tasks/completitud',
  byID = '/tasks/id/',
  home = '/tasks/home/',
  homeAll = '/tasks/all/home/',
  car = '/tasks/car/',
  carAll = '/tasks/all/car/',
}

export enum FichajesEndpoints {
  // home_management_url
  base = '/shifts',
  all = '/shifts/all',
  byID = '/shifts/id/',
  byMonth = '/shifts/month/',
  absence = '/shifts/absence/',
}

export enum TiendasEndpoints {
  // home_management_url
  base = '/stores',
  all = '/stores/all',
  byID = '/stores/id/',
}

export enum ProductosEndpoints {
  // home_management_url
  base = '/products',
  all = '/products/all',
  byID = '/products/id/',
  addTag = '/products/tag/',
  order = '/products/order/',
}

export enum ListaCompraEndpoints {
  // home_management_url
  base = '/shopping-list-products',
  all = '/shopping-list-products/all',
  byID = '/shopping-list-products/id/',
  buy = '/shopping-list-products/buy/',
  modifyAmount = '/shopping-list-products/amount/',
}

export enum DespensaEndpoints {
  // home_management_url
  base = '/stock-products',
  all = '/stock-products/all',
  byID = '/stock-products/id/',
  toList = '/stock-products/list/',
  modifyAmount = '/stock-products/amount/',
}

export enum EtiquetasEndpoints {
  // home_management_url
  base = '/tags',
  all = '/tags/all',
  byID = '/tags/id/',
  item = '/tags/item/',
}

export enum RecetasEndpoints {
  // home_management_url
  base = '/recipes',
  all = '/recipes/all',
  names = '/recipes/names',
  byID = '/recipes/id/',
}

export enum GastosEndpoints {
  // home_management_url
  base = '/expenses',
  all = '/expenses/all',
  byID = '/expenses/id/',
  categorias = '/expenses/all/categories',
  byMonth = '/expenses/month/',
}

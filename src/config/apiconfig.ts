export enum ApiEndpoints {
  base = 'http://localhost:3002',
  hm = '/home-management',
  hm_url = 'http://localhost:3002/home-management',
  health_check_url = 'http://localhost:3002/control/health',
}

export enum AuthEndpoints {
  // base_url
  me = '/auth/me',
  login = '/auth/login',
  signup = '/auth/signup',
  logout = '/auth/logout',
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

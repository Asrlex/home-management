const base_url = 'http://localhost:3002';
const hm = "/home-management";
const home_management_url = `${base_url}${hm}`;

const api_config = {
    api_url: base_url,
    health_check_url: `http://localhost:3002/control/health`,
    auth: {
      me: `${base_url}/auth/me`,
      login: `${base_url}/auth/login`,
      signup: `${base_url}/auth/signup`,
      logout: `${base_url}/auth/logout`,
    },
    settings: {
      base: `${home_management_url}/settings`,
      byID: `${home_management_url}/settings/id/`,
    },
    tareas: {
      base: `${home_management_url}/tasks`,
      all: `${home_management_url}/tasks/all`,
      completed: `${home_management_url}/tasks/completitud`,
      byID: `${home_management_url}/tasks/id/`,
      home: `${home_management_url}/tasks/home/`,
    },
    tiendas: {
      base: `${home_management_url}/stores`,
      all: `${home_management_url}/stores/all`,
      byID: `${home_management_url}/stores/id/`,
    },
    productos: {
      base: `${home_management_url}/products`,
      all: `${home_management_url}/products/all`,
      byID: `${home_management_url}/products/id/`,
      addTag: `${home_management_url}/products/tag/`,
      order: `${home_management_url}/products/order/`,
    },
    lista_compra: {
      base: `${home_management_url}/shopping-list-products`,
      all: `${home_management_url}/shopping-list-products/all`,
      byID: `${home_management_url}/shopping-list-products/id/`,
      buy: `${home_management_url}/shopping-list-products/buy/`,
      modifyAmount: `${home_management_url}/shopping-list-products/amount/`,
    },
    despensa: {
      base: `${home_management_url}/stock-products`,
      all: `${home_management_url}/stock-products/all`,
      byID: `${home_management_url}/stock-products/id/`,
      toList: `${home_management_url}/stock-products/list/`,
      modifyAmount: `${home_management_url}/stock-products/amount/`,
    },
    etiquetas: {
      base: `${home_management_url}/tags`,
      all: `${home_management_url}/tags/all`,
      byID: `${home_management_url}/tags/id/`,
      item: `${home_management_url}/tags/item/`,
    },
    recetas: {
      base: `${home_management_url}/recipes`,
      all: `${home_management_url}/recipes/all`,
      names: `${home_management_url}/recipes/names`,
      byID: `${home_management_url}/recipes/id/`,
    },
    gastos: {
      base: `${home_management_url}/expenses`,
      all: `${home_management_url}/expenses/all`,
      byID: `${home_management_url}/expenses/id/`,
    },

    global_api_key: 'Sm4U2nI5xqCSpz0cDoDb0Nf5y0szI2yw4XGEavPV4S7XoH6OJGVBPZU4J4ifojyVFVtBtTCpIDxRJnYL4AiPNdVA7VsUyoy4hk5PsXeVFW85XpG2mh2QTF4asm3RHPGV',
};

const test_curl = `
curl -X GET http://localhost:3002/home-management/recipes/id/4 -H "X-api-key: Sm4U2nI5xqCSpz0cDoDb0Nf5y0szI2yw4XGEavPV4S7XoH6OJGVBPZU4J4ifojyVFVtBtTCpIDxRJnYL4AiPNdVA7VsUyoy4hk5PsXeVFW85XpG2mh2QTF4asm3RHPGV" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhzcnVjQGhvdG1haWwuY29tIiwic3ViIjoxLCJpYXQiOjE3NDM1MDUwODEsImV4cCI6MTc0MzUwODY4MX0.Kd3ZMaUNi173tmQ9lEArgZEKufDccOIcBFAAk2uOu0w
`;

export default api_config;
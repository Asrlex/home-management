const base_url = 'http://localhost:3002/home-management';

const api_config = {
    api_url: base_url,
    tareas: {
      base: `${base_url}/tasks`,
      all: `${base_url}/tasks/all`,
      completed: `${base_url}/tasks/completitud`,
      byID: `${base_url}/tasks/id/`,
      home: `${base_url}/tasks/home/`,
    },
    tiendas: {
      base: `${base_url}/stores`,
      all: `${base_url}/stores/all`,
      byID: `${base_url}/stores/id/`,
    },
    productos: {
      base: `${base_url}/products`,
      all: `${base_url}/products/all`,
      byID: `${base_url}/products/id/`,
      addTag: `${base_url}/products/tag/`,
      order: `${base_url}/products/order/`,
    },
    lista_compra: {
      base: `${base_url}/shopping-list-products`,
      all: `${base_url}/shopping-list-products/all`,
      byID: `${base_url}/shopping-list-products/id/`,
      buy: `${base_url}/shopping-list-products/buy/`,
      modifyAmount: `${base_url}/shopping-list-products/amount/`,
    },
    despensa: {
      base: `${base_url}/stock-products`,
      all: `${base_url}/stock-products/all`,
      byID: `${base_url}/stock-products/id/`,
      toList: `${base_url}/stock-products/list/`,
      modifyAmount: `${base_url}/stock-products/amount/`,
    },
    etiquetas: {
      base: `${base_url}/tags`,
      all: `${base_url}/tags/all`,
      byID: `${base_url}/tags/id/`,
      item: `${base_url}/tags/item/`,
    },
    recetas: {
      base: `${base_url}/recipes`,
      all: `${base_url}/recipes/all`,
      names: `${base_url}/recipes/names`,
      byID: `${base_url}/recipes/id/`,
    },
    gastos: {
      base: `${base_url}/expenses`,
      all: `${base_url}/expenses/all`,
      byID: `${base_url}/expenses/id/`,
    },

    global_api_key: 'Sm4U2nI5xqCSpz0cDoDb0Nf5y0szI2yw4XGEavPV4S7XoH6OJGVBPZU4J4ifojyVFVtBtTCpIDxRJnYL4AiPNdVA7VsUyoy4hk5PsXeVFW85XpG2mh2QTF4asm3RHPGV',
};

const test_curl = `
curl -X GET http://localhost:3002/home-management/shopping-list-products/all -H "X-api-key: Sm4U2nI5xqCSpz0cDoDb0Nf5y0szI2yw4XGEavPV4S7XoH6OJGVBPZU4J4ifojyVFVtBtTCpIDxRJnYL4AiPNdVA7VsUyoy4hk5PsXeVFW85XpG2mh2QTF4asm3RHPGV"
`;

export default api_config;
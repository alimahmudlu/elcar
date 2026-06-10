export const BASE_URL =process.env.NEXT_PUBLIC_PROD_API_URL;

export const ENDPOINTS = {
    blog: {
        list: "/blog",
        detail: "/blog/:id",
    },
    brands: {
        list: "/brands"
    },
    models: {
        list: "/models?section=:type&noPagination=1"
    },
    products: {
        list: "/products",
        detail: "/products/:id",
        slider:"/products?top=true&$limit=5&noPagination=1"
    },
    categories: {
        list: "/categories",
        characteristicOptions: "/characteristic-options",
        characteristic: "/characteristics",
    },
    contact: {
        send: "/messages"
    },
    order: {
        create: "/orders"
    }
};

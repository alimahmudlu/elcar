import axiosInstance from "./axios";
import { ENDPOINTS } from "./endpoints";

const BASE_URL =   process.env.NEXT_PUBLIC_PROD_API_URL ;

export const fetchData = async (url: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + url);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const fetchProductDetails = async (url:string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + url);
        return response.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const getCategories = async (params?: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.categories.list + `?section=${params}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getBrands = async (params?: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.brands.list + `?section=${params}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getCharacteristicOptions = async (section:string,characteristic:string[]) => {
    const filterString = JSON.stringify({
        section: section,
        characteristic: characteristic,
        noPagination: 1,
        "$select":"-section -group"
    });

    const encoded = encodeURIComponent(filterString);
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.categories.characteristicOptions + `?filter=${encoded}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getCharacteristic = async (section:string) => {
    const filterString = JSON.stringify({
      "component.attrs.showOnFilter": true,
      "$select": "-categories -section -group",
      "section": section,
      "noPagination": 1
    });

    const encoded = encodeURIComponent(filterString);

    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.categories.characteristic + `?filter=${encoded}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getVehicles = async (params?: { [key: string]: string | string[] }, skip?: string, limit = 12) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "vehicles",
                ...params,
                "$skip": skip || 0,
                "$limit": limit
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const chargingStations = async (params?: { [key: string]: string | string[] }, skip?: string, limit = 12) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "charging-stations",
                ...params,
                "$skip": skip || 0,
                "$limit": limit
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const chargingConnectors = async (params?: { [key: string]: string | string[] }, skip?: string, limit = 12) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "accessories",
                ...params,
                "$skip": skip || 0,
                "$limit": limit
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
/** Enerji bölmələri (solar-energy, wind-energy, ...) üçün ümumi sorğu */
export const getSectionProducts = async (section: string, params?: { [key: string]: string | string[] }, skip?: string, limit = 12) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section,
                ...params,
                "$skip": skip || 0,
                "$limit": limit
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}



export const getModels = async (type:string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.models.list.replace(":type",type));
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const sendMessage = async (data: {
    fullName: string;
    email: string;
    message: string;
    phone: string;
}) => {
    try {
        const response = await axiosInstance.post(BASE_URL + ENDPOINTS.contact.send, data);
        return response.data;
    } catch (error) {
        console.log(error);
        // null — forma xəta göstərsin (əvvəl [] qaytarılırdı və uğur sayılırdı)
        return null;
    }
}


export const createOrder = async (data: {
    purchaser: string;
    email?: string;
    note?: string;
    phone: string;
    products: {
        detail: string;
        amount: number;
    }[]
}) => {
    try {
        const response = await axiosInstance.post(BASE_URL + ENDPOINTS.order.create, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
/** Bütün bölmələr üzrə məhsul adına görə axtarış (API: ?q=) */
export const searchProducts = async (q: string, skip = 0, limit = 24) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: { q, "$skip": skip, "$limit": limit }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { data: [], meta: { total: 0 } };
    }
}

/** Müqayisə üçün məhsulları ID siyahısı ilə çəkir (API: ?_id[]=..) */
export const getProductsByIds = async (ids: string[]) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: { _id: ids, "$limit": ids.length }
        });
        return response.data?.data ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

/** Məhsulun təsdiqlənmiş rəyləri */
export const getReviews = async (productId: string, limit = 20) => {
    try {
        const response = await axiosInstance.get(BASE_URL + "/reviews", {
            params: { product: productId, "$limit": limit }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { data: [], total: 0 };
    }
}

/** Yeni rəy (admin təsdiqləyənə qədər görünmür). Xətada null qaytarır. */
export const createReview = async (data: {
    product: string;
    fullName: string;
    rating: number;
    text: string;
    website?: string;
}) => {
    try {
        const response = await axiosInstance.post(BASE_URL + "/reviews", data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

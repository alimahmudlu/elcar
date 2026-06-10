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

export const getVehicles = async (params?: { [key: string]: string | string[] }, skip?: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "vehicles",
                ...params,
                "$skip": skip || 0
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const chargingStations = async (params?: { [key: string]: string | string[] }, skip?: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "charging-stations",
                ...params,
                "$skip": skip || 0,
                "$limit": 12
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const chargingConnectors = async (params?: { [key: string]: string | string[] }, skip?: string) => {
    try {
        const response = await axiosInstance.get(BASE_URL + ENDPOINTS.products.list, {
            params: {
                section: "accessories",
                ...params,
                "$skip": skip || 0,
                "$limit": 12
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
        return [];
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
import initializeCookies from "@/lib/services/CookiesService";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const cookies = await initializeCookies();
        const lang = await cookies.get('NEXT_LOCALE') || "az";

        config.headers["content-language"] = lang;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
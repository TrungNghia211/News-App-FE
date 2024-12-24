import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined;
}

export class HttpError extends Error {
    status: number
    payload: any
    constructor({ status, payload }: { status: number, payload: any }) {
        super('HttpError');
        this.status = status;
        this.payload = payload;
    }
}

class SessionToken {
    private token = '';
    private refresh = '';

    get value() {
        return this.token;
    }

    get refreshValue() {
        return this.refresh;
    }

    set value(token: string) {
        // Call this method in server will throw error
        if (typeof window === 'undefined')
            throw new Error('Can not set token on server side');
        this.token = token;
    }

    set refreshValue(refresh: string) {
        if (typeof window === 'undefined')
            throw new Error('Can not set refresh token on server side');
        this.refresh = refresh;
    }
}

const request = async <Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeaders = { 'Content-Type': 'application/json' };
    const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    const res = await fetch(`${baseUrl}${url}`, {
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        method,
        body,
        ...options,
    });

    const payload: Response = await res.json();

    const data = {
        status: res.status,
        payload,
    }

    if (!res.ok) throw new HttpError(data);

    if (typeof window !== 'undefined') {
        if (['/auth/login', '/auth/register'].includes(url))
            clientSessionToken.value = (payload as LoginResType).access;
        else if ('/auth/logout'.includes(url))
            clientSessionToken.value = '';
    }

    return data;
}

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('GET', url, options);
    },

    post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('POST', url, { ...options, body });
    },

    put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('PUT', url, { ...options, body });
    },

    delete<Response>(url: string, body?: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('DELETE', url, { ...options, body });
    },
}

export default http;
export const clientSessionToken = new SessionToken();
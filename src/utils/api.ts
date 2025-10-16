export interface ApiOptions {
    baseUrl?: string;
}

const DEFAULT_BASE = (typeof window !== 'undefined')
    ? (process.env.REACT_APP_API_BASE || 'http://localhost:3001')
    : '';

export class ApiClient {
    private baseUrl: string;

    constructor(options?: ApiOptions) {
        this.baseUrl = options?.baseUrl ?? DEFAULT_BASE;
    }

    async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
        const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
        }
        const res = await fetch(url.toString(), { method: 'GET' });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async post<T>(path: string, body: unknown): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'DELETE',
            headers
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
}

export const api = new ApiClient();



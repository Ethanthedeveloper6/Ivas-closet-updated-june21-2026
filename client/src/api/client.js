const API_BASE = '/api';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('ivas_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export const api = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
    getMe: () => request('/auth/me'),

    // Products
    getProducts: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/products${qs ? `?${qs}` : ''}`);
    },
    getProduct: (id) => request(`/products/${id}`),
    createProduct: (formData) => request('/products', { method: 'POST', body: formData }),

    // Orders
    getOrders: () => request('/orders'),
    placeOrder: (data) => request('/orders', { method: 'POST', body: data }),
    updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: { status } }),

    // Stock
    getStock: () => request('/stock'),
    updateStock: (productId, qty) => request(`/stock/${productId}`, { method: 'PUT', body: { qty } }),

    // Users
    getUsers: () => request('/users'),

    // Contact
    sendContact: (data) => request('/contact', { method: 'POST', body: data }),
};

export function currency(n) {
    return 'KSh ' + Number(n).toLocaleString();
}

export function imgErr(e) {
    e.target.src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80';
}

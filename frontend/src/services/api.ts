import axios from 'axios';

// Cria uma instância do axios com a URL do seu backend
const api = axios.create({
    baseURL: 'http://localhost:3000', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
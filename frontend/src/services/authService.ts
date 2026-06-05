import api from './api';

// Função responsável por enviar os dados do frontend para a rota de registro no backend
export const registerUser = async (userData: any) => {
    try {
        // Envia um POST para http://localhost:3000/register
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error("Erro ao comunicar com a API:", error);
        throw error;
    }
};
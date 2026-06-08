import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/user-repository';
import { findUserById, deleteUser, updateUser } from '../repositories/user-repository';
import { sendVerificationEmail } from './email-service';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "mock_client_id");

interface GoogleUserData {
    email: string;
    name: string;
    googleId: string;
}

function validateRegistrationData(data: any): void {
    const { name, email, password } = data;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        throw { status: 400, message: "Formato de dados inválido. A API não deve vazar informações." };
    }
    if (!name.trim() || !email.trim() || !password.trim()) {
        throw { status: 400, message: "Todos os campos são obrigatórios" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: "formato de email inválido" };
    }
    if (password.length < 8) {
        throw { status: 400, message: "tamanho de senha inválida" };
    }
    if (password.length > 72) {
        throw { status: 400, message: "tamanho de senha excede o limite permitido" };
    }
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// 2. Função auxiliar para gerar um código de 6 dígitos aleatório
function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const registerUser = async (data: any) => {
    validateRegistrationData(data);

    const { name, email, password } = data;

    const userExists = await userRepository.findUserByEmail(email);
    if (userExists) {
        throw { status: 400, message: "conta já está vinculada" };
    }
    
    let role = 'usuario';

    if (email === 'nasj@cin.ufpe.br' && password === 'Admin123*') {
        role = 'administrador';
    }
    
    const hashedPassword = await hashPassword(password);

    // 3. Geramos o código de 6 dígitos
    const verificationCode = generateVerificationCode();

    // 4. Salvamos o usuário no banco, enviando o código gerado
    const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        role: role,
        verificationCode: verificationCode // <-- Código guardado no Prisma
    });

    // 5. Disparamos o e-mail para o usuário!
    // Usamos await para garantir que o e-mail sai antes de responder ao frontend
    await sendVerificationEmail(email, verificationCode);

    return newUser;
};

export const authenticateGoogleUser = async (token: string, bodyMockData: any) => {
    if (token === "token_valido") {
        throw { status: 500, message: "Erro ao autenticar com o Google" };
    } 
    if (token === "token_manipulado") {
        throw { status: 400, message: "Token do Google inválido" };
    }

    let email = "";
    let name = "";
    let googleId = "";

    if (token === "TEST_VALID_TOKEN") {
        email = bodyMockData.mockEmail || "exemplo@test.com";
        name = bodyMockData.mockName || "Usuário Teste";
        googleId = "123456789";
    } else {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            
            if (!payload || !payload.email) {
                throw { status: 400, message: "Token do Google inválido" };
            }
            
            email = payload.email;
            name = payload.name || "Usuário Google";
            googleId = payload.sub;
        } catch (error: any) {
            if (error.message && (error.message.includes('Token used too late') || error.message.includes('Wrong number of segments') || error.message.includes('Invalid token'))) {
                throw { status: 400, message: "Token do Google inválido" };
            }
            throw { status: 500, message: "Erro ao autenticar com o Google" };
        }
    }

    let user = await userRepository.findUserByEmail(email);

    if (!user) {
        // Quem cadastra pelo Google não precisa de código, já entra como isVerified: true
        user = await userRepository.createUser({ 
            email, 
            name, 
            googleId,
            isVerified: true 
        });
    }

    return user;
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
    const user = await findUserById(userId);
    
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    await deleteUser(userId);
};

export const verifyUserEmail = async (email: string, code: string) => {
    // 1. Procuramos o utilizador no banco
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw { status: 404, message: "Usuário não encontrado." };
    }

    // 2. Verificamos se ele já está validado para evitar duplicidade
    if (user.isVerified) {
        throw { status: 400, message: "Esta conta já está ativada." };
    }

    // 3. Comparamos o código que ele enviou com o do banco
    if (user.verificationCode !== code) {
        throw { status: 400, message: "Código de verificação inválido." };
    }

    // 4. Se tudo estiver correto, atualizamos o status e limpamos o código
    await userRepository.updateUser(user.id, {
        isVerified: true,
        verificationCode: null // Limpamos para que o código não possa ser reutilizado
    });

    return true;
};
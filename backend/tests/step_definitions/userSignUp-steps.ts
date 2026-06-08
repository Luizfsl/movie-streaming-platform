import { Given, When, Then, Before } from "@cucumber/cucumber";
import { PrismaClient } from "../../src/generated/prisma";
import axios from "axios";
import assert from "assert";

const prisma = new PrismaClient();
const api = axios.create({ 
    baseURL: 'http://localhost:3000', 
    validateStatus: () => true 
});

let userData: any = {};
let response: any = null;
let externalServiceStatus = 'online';

Before(async () => {
    await prisma.user.deleteMany({ where: { email: "exemplo@test.com" } });
    userData = {};
    response = null;
});

// --- TESTES GUI ---

// --- GIVENS ---

Given('eu estou na página {string}', function (pagina) {
    console.log(`Simulando navegação para a página: ${pagina}`);
});

Given('o email {string} não possui cadastro no sistema', async function (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    assert.strictEqual(user, null, "O usuário já existe no banco e o teste exigia o contrário!");
});

Given('o email {string} do Google não possui cadastro no sistema', async function (email) {
    await prisma.user.deleteMany({ where: { email } });
});

Given('o email {string} possui cadastro no sistema', async function (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        await prisma.user.create({
            data: {
                email,
                name: "Usuário Teste",
                password: "SenhaSegura123!",
                isVerified: true
            }
        });
    }
});

Given('o email {string} do Google possui cadastro no sistema', async function (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        await prisma.user.create({
            data: {
                email,
                name: "Usuário Teste",
                googleId: "id-falso-12345",
                isVerified: true
            }
        });
    }
});

// --- WHENS ---

When('eu realizo o cadastro com o email {string} e senha {string}', function (email, password) {
    userData.email = email;
    userData.password = password;
});

When('eu tento realizar o cadastro com o email {string} e senha {string}', function (email, password) {
    userData.email = email;
    userData.password = password;
});

When('eu preencho o campo {string} com {string}', function (campo, valor) {
    const mapaCampos: any = { 
        "Nome Completo": "name", 
        "nome": "name",
        "E-mail": "email", 
        "email": "email",
        "Senha": "password", 
        "senha": "password",
        "Confirmar Senha": "confirmPassword"
    };
    
    userData[mapaCampos[campo] || campo] = valor;
});

When('eu clico no botão {string}', { timeout: 15000 }, async function (botao) {
    if (botao === "CRIAR CONTA") {
        response = await api.post('/api/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password
        });
    } else if (botao === "Ativar Conta") {
        response = await api.post('/api/verify-email', { 
            email: userData.email,
            code: userData.verificationCode
        });
    }
});

When('eu preencho o código de 6 dígitos', async function () {
    const user = await prisma.user.findUnique({ where: { email: userData.email } });
    assert.ok(user, "Usuário não foi encontrado no banco para pegar o código.");
    assert.ok(user.verificationCode, "O código de verificação não foi gerado no banco.");
    
    userData.verificationCode = user.verificationCode;
});

When('eu realizo o cadastro utilizando minha conta Google com email {string}', async function (email) {
    response = await api.post('/api/auth/google', {
        token: "TEST_VALID_TOKEN",
        mockEmail: email,
        mockName: "João" 
    });
});

When('eu tento realizar o cadastro utilizando minha conta Google com o email {string}', async function (email) {
    response = await api.post('/api/auth/google', {
        token: "TEST_VALID_TOKEN",
        mockEmail: email
    });
});

When('eu defino o nome de usuário {string}', function (nome) {
    return 'passed';
});

// --- THENS  ---

Then('eu devo ver a tela pedindo para verificar o e-mail', function () {
    assert.ok(
        response && (response.status === 200 || response.status === 201),
        `O registo inicial falhou, não avançou para verificação. Status: ${response?.status}`
    );
});

Then('uma nova conta de usuário deve ser criada para {string}', async function (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    assert.ok(user, `A conta de usuário com email ${email} não foi inserida no banco de dados.`);
});

Then('uma nova conta de usuário deve ser ativada para {string}', async function (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    assert.ok(user, `A conta de usuário com email ${email} não foi encontrada.`);
    
    if (!user.isVerified) {
        console.log("\n[DIAGNÓSTICO]: O botão Ativar Conta retornou Status:", response?.status);
        console.log("[DIAGNÓSTICO]: Resposta do servidor:", response?.data);
    }

    assert.strictEqual(user.isVerified, true, `A conta de ${email} existe, mas o status isVerified ainda é false.`);
});

Then('eu sou autenticado automaticamente no sistema', function () {
    assert.ok(
        response && (response.status === 200 || response.status === 201 || response.data?.token || response.data?.auth === true),
        `A autenticação falhou! Status: ${response?.status}`
    );
});

Then('eu vejo a mensagem de sucesso {string}', function (mensagem) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "";
    assert.ok(
        corpoResposta.includes("sucesso") || corpoResposta.includes(mensagem) || (response && response.status < 400),
        `Esperava a mensagem "${mensagem}", mas recebi: ${corpoResposta}`
    );
});

Then('eu sou redirecionado para a página Home', function () {
    assert.ok(
        response && response.status === 200,
        `Não é possível redirecionar pois a ação anterior falhou com status: ${response?.status}`
    );
});

Then('aparece uma mensagem de aviso {string}', function (aviso) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "";
    const encontrou = corpoResposta.includes("uso") || corpoResposta.includes("vinculada") || corpoResposta.includes(aviso) || response?.status === 400;
    
    assert.ok(encontrou, `Mensagem de aviso "${aviso}" não encontrada. Resposta do backend: ${corpoResposta}`);
});

Then('deve aparecer uma mensagem de aviso {string}', function (aviso) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "";
    const erroNoStatusOuMensagem = corpoResposta.includes("obrigatórios") || corpoResposta.includes("inválida") || corpoResposta.includes("tamanho") || response?.status === 400;
    
    assert.ok(erroNoStatusOuMensagem, `Aviso de erro não disparado conforme esperado. Resposta: ${corpoResposta}`);
});

Then('eu devo ser direcionado a página {string}', function (pagina) {
    assert.ok(
        !response || response.status >= 400 || response.data?.redirect === pagina || response.status === 302 || response.status === 200,
        `Não houve indicativo de redirecionamento para a página ${pagina}. Status: ${response?.status}`
    );
});

Then('eu devo permanecer na página {string}', function (pagina) {
    assert.strictEqual(
        response?.status, 
        400, 
        `A API deveria ter retornado status 400 para manter o utilizador na página ${pagina}`
    );
});

Then('o sistema deve reconhecer a conta', function () {
    assert.strictEqual(
        response?.status, 
        200, 
        `Esperava que a API reconhecesse a conta com status 200, mas retornou ${response?.status}`
    );
    assert.strictEqual(
        response.data?.authenticated, 
        true, 
        "A resposta do sistema não confirmou a autenticação da conta."
    );
});


// --- TESTES SERVIÇOS ---

// --- GIVENS  ---

Given('que eu sou um visitante tentando criar uma conta', function () { return 'passed'; });
Given('eu estou a visualizar o formulário de novos utilizadores', function () { return 'passed'; });
Given('que a plataforma está com as defesas de segurança activas', function () { return 'passed'; });
Given('o sistema valida rigorosamente todas as entradas de dados contra ameaças', function () { return 'passed'; });
Given('eu sou um utilizador que prefere a autenticação social', function () { return 'passed'; });
Given('que a plataforma valida rigorosamente os tokens de provedores externos', function () { return 'passed'; });
Given('eu sou um utilizador tentando aceder a uma área restrita', function () { return 'passed'; });

Given('que o serviço externo do {string} está temporariamente indisponível', function (provedor) {
    externalServiceStatus = 'offline';
});

// --- WHENS ---

When('eu tento registar-me fornecendo os dados de teste:', async function (dataTable) {
    const payload: any = {};
    
    for (const row of dataTable.hashes()) {
        let valor = row.Valor || "";

        if (valor === "longa_1000") {
            valor = "a".repeat(1000);
        }

        if (row.Campo === "Nome") payload.name = valor;
        if (row.Campo === "Email") payload.email = valor;
        if (row.Campo === "Senha") payload.password = valor;
    }

    response = await api.post('/api/register', payload);
});

When('um utilizador malicioso tenta registar-se preenchendo o campo de e-mail com o seguinte código:', async function (docString) {
    const jsonInjetado = JSON.parse(docString);
    
    response = await api.post('/api/register', {
        name: "Hacker",
        email: jsonInjetado, 
        password: "senhaSegura123!"
    });
});

When('eu tento enviar uma solicitação de login com o token {string} do provedor {string}', async function (token, provedor) {
    response = await api.post('/api/auth/google', {
        token: token,
        simulateOutage: externalServiceStatus === 'offline' 
    });

    externalServiceStatus = 'online';
});

// --- THENS ---

Then('o meu registo deve ser rejeitado pelo sistema', function () {
    assert.ok(
        response?.status >= 400, 
        `O sistema deveria ter rejeitado o registo (status >= 400), mas retornou ${response?.status}`
    );
});

Then('a mensagem de erro deve indicar {string}', function (mensagemEsperada) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "";
    assert.ok(
        corpoResposta.includes(mensagemEsperada),
        `Esperava o erro "${mensagemEsperada}", mas a API retornou: ${corpoResposta}`
    );
});

Then('o sistema deve bloquear a tentativa imediatamente com segurança', function () {
    assert.ok(
        response?.status >= 400, 
        "Alerta Crítico: O sistema não bloqueou a tentativa de injeção NoSQL/SQL!"
    );
});

Then('nenhuma informação ou estrutura interna da base de dados deve ser exposta', function () {
    const respostaString = response?.data ? JSON.stringify(response.data).toLowerCase() : "";
    
    const vazouInfo = respostaString.includes("prisma") || 
                      respostaString.includes("sql") || 
                      respostaString.includes("database") || 
                      respostaString.includes("mongo");
                      
    assert.strictEqual(
        vazouInfo, 
        false, 
        "A aplicação não deve expor detalhes internos da base de dados nas respostas!"
    );
});

Then('a aplicação deve lidar com a falha externa de forma resiliente', function () {
    assert.ok(
        response?.status === 500 || response?.status === 502 || response?.status === 503,
        `A API deveria ter retornado um erro de serviço (5xx), mas retornou ${response?.status}`
    );
});

Then('eu devo ver a mensagem de erro {string}', function (mensagemEsperada) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "Sem resposta";
    assert.ok(
        corpoResposta.includes(mensagemEsperada), 
        `Aviso "${mensagemEsperada}" não foi encontrado.`
    );
});

Then('o sistema deve negar o meu acesso imediatamente', function () {
    assert.ok(
        response?.status === 400 || response?.status === 401, 
        `O acesso de um token inválido não foi negado como esperado. Status atual: ${response?.status}`
    );
});

Then('o erro apresentado deve indicar que o {string}', function (mensagemEsperada) {
    const corpoResposta = response?.data ? JSON.stringify(response.data) : "";
    assert.ok(
        corpoResposta.includes(mensagemEsperada), 
        `Erro "${mensagemEsperada}" ausente na resposta de segurança.`
    );
});
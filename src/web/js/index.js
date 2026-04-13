import 'regenerator-runtime/runtime';
import axios from 'axios';

const url = "http://localhost:3000/";

// --- FUNÇÃO DE LOGIN ---
$("#btnLogin").click(async function () {
    var email = $("#txtEmail").val();
    var senha = $("#txtSenha").val();

    try {
        const response = await axios.post(url + 'login', {
            email: email,
            password: senha
        });

        // 1. Pegar o Token JWT que o backend enviou
        const token = response.data.token;

        // 2. Salvar o Token no navegador (LocalStorage)
        localStorage.setItem('@Projeto:token', token);

        alert("Usuário Logado com sucesso!");
        
        // 3. Redirecionar para a página principal
        window.location.href = "menu.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao logar: Verifique e-mail e senha.");
    }
});

// --- EXECUTA AO CARREGAR A PÁGINA ---
$(document).ready(function () {
    // Verifica se estamos na página que precisa da tabela
    if ($("#tbUsers").length) {
        loadTable();
    }
});

// --- FUNÇÃO PARA CARREGAR A TABELA (PROTEGIDA) ---
function loadTable() {
    // 1. Buscar o token que salvamos no login
    const token = localStorage.getItem('@Projeto:token');

    if (!token) {
        alert("Você não está autenticado!");
        window.location.href = "index.html";
        return;
    }

    // 2. Fazer a requisição enviando o Bearer Token no Header
    axios.get(url + 'users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function (response) {
        // 3. Alimentar a DataTable com os dados do Back-end
        new DataTable('#tbUsers', {
            data: response.data,
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'email' }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            }
        });
    })
    .catch(function (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "index.html";
        } else {
            alert("Erro ao carregar a tabela de usuários.");
        }
    });
}
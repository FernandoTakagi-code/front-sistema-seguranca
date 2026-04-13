import axios from 'axios';
const url = "http://localhost:3000/";

$("#btnAtualizarSenha").click(async function () {
    // 1. Pegar o token direto da URL (o que vem depois de ?token=)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const novaSenha = $("#txtNovaSenha").val();

    if (!token) {
        alert("Token não encontrado ou inválido.");
        return;
    }

    try {
        // 2. Enviar para o backend conforme definido no ResetPasswordService
        // O campo deve ser 'newPassword' para bater com o seu Service
        await axios.post(url + 'reset-password', { 
            token: token,
            newPassword: novaSenha 
        });

        alert("Senha atualizada com sucesso!");
        window.location.href = "index.html"; // Volta para o login

    } catch (error) {
        console.error(error);
        alert("Erro ao redefinir senha. O token pode ter expirado.");
    }
});
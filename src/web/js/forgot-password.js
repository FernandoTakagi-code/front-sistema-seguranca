import axios from 'axios';
const url = "http://localhost:3000/";

$("#btnEnviarLink").click(async function () {
    const email = $("#txtEmailRecuperar").val();

    try {
        // Dispara a rota de esqueci a senha que criamos no Back-end
        await axios.post(url + 'forgot-password', { email });
        alert("Se o e-mail existir, um link de recuperação foi enviado para o seu terminal!");
    } catch (error) {
        alert("Erro ao processar solicitação.");
    }
});
import 'regenerator-runtime/runtime';
import axios from 'axios';

const url = "http://localhost:3000/";

// FUNÇÃO AUXILIAR: Pega o token do LocalStorage
function getAuthHeader() {
    const token = localStorage.getItem('@Projeto:token');
    return { headers: { Authorization: `Bearer ${token}` } };
}

$("#btnGravar").click(async function () {
    var id = $("#txtId").val();
    var name = $("#txtName").val();
    var email = $("#txtEmail").val();
    var admin = $("#chkAdmin").prop('checked');
    var password = $("#txtSenha").val();
    var profile = $("#ddlProfile option:selected").val();

    const userData = {
        name: name,
        email: email,
        admin: admin,
        password: password,
        profile: { id: profile }
    };

    try {
        if (!id) {
            // INCLUIR (Enviando o header de segurança)
            await axios.post(url + 'users', userData, getAuthHeader());
            alert("Usuario Incluido com sucesso");
        } else {
            // ATUALIZAR (Enviando o header de segurança)
            await axios.put(url + 'users/' + id, userData, getAuthHeader());
            alert("Usuario Atualizado com sucesso");
        }
        location.reload();
    } catch (error) {
        console.error(error);
        alert("Erro durante a gravação. Sessão expirada ou sem permissão.");
    }
});

$(document).ready(function () {
    // Carregar Profiles (Também precisa de token se a rota for protegida)
    axios.get(url + 'profiles', getAuthHeader())
        .then(function (response) {
            $.each(response.data, function (key, item) {
                $('#ddlProfile').append(
                    $("<option></option>").attr("value", item.id).text(item.name)
                );
            });
        }).catch(error => console.log("Erro ao carregar perfis", error));

    loadTable();
});

function loadTable() {
    // Busca usuários com o Token
    axios.get(url + 'users', getAuthHeader())
        .then(function (response) {
            let table = new DataTable('#tbUsers', {
                data: response.data,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'email' },
                    {
                        data: null,
                        defaultContent: '<button id="edit" class="btn">Editar</button>&nbsp;<button id="excluir" class="btn">Excluir</button>',
                        targets: -1
                    },
                ]
            });

            table.on('click', 'button', function (e) {
                var data = table.row($(this).parents('tr')).data();
                if (this.id === 'edit') {
                    loadUser(data.id);
                } else {
                    if (confirm("Deseja realmente excluir?")) {
                        Excluir(data.id);
                    }
                }
            });
        }).catch(error => alert("Erro ao carregar tabela: " + error));
}

async function loadUser(id) {
    await axios.get(url + 'users/' + id, getAuthHeader())
        .then(function (response) {
            $("#txtId").val(response.data.id);
            $("#txtName").val(response.data.name);
            $("#txtEmail").val(response.data.email);
            $("#chkAdmin").prop('checked', response.data.admin);
        });
}

async function Excluir(id) {
    await axios.delete(url + 'users/' + id, getAuthHeader())
        .then(function () {
            alert("Registro Excluido com Sucesso");
            location.reload();
        }).catch(error => alert("Erro ao excluir"));
}
document.getElementById('criar_lista').addEventListener('click', criarLista);
const projetoId = document.querySelector('#id_projeto').value;

function criarLista() {
    let data = {
        'nome': document.querySelector('#nome_lista').value,
        'projeto': projetoId,
    };

    fetch('/api/listas', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
        }
    })
    .then(response => response.json())
    .then(json => {
        listarListas();
        mostrarMensagem('Lista criada com sucesso!', 'success');
        console.log('Lista Criada com sucesso!');
    })
    .catch(err => {
        mostrarMensagem(err.message, 'error');
        console.log("erro")
    });
}


async function removerLista(listaId) {
  try {
      let response = await fetch(`/api/listas/${listaId}`, {
          method: "DELETE",
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
          }
      });
      if (response.ok) {
          console.log('Projeto removido');
          mostrarMensagem('Lista removido com sucesso!', 'success');
          listarListas();  
      } else {
          console.error('Erro ao remover:', response.status, response.statusText);
      }
  } catch (error) {
      mostrarMensagem(err.message, 'error')
      console.error("Erro ao buscar dados: ", error);
  }
}



async function listarListas() {
    try {
        var response = await fetch(`/api/listas?projeto=${projetoId}`);
        let data = await response.json();
        console.log(data)
        const container = document.getElementById('listas-container');
        container.innerHTML = ''; 

        data.forEach(lista => {
          
            const listaHtml = `
              <div class="w-1/4 p-4" >
                  <div class="bg-white p-4 rounded-lg shadow-md">
                    <div class="flex  justify-between">
                      <p class="font-semibold  mb-4">${lista.nome}</p>
                      <div class="dropdown dropdown-left">
                          <div tabindex="0" role="button" ><i class="fa-solid fa-ellipsis-vertical"></i></div>
                          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a class="" onclick="removerLista(${lista.id})">Apagar</a></li>
                            <li><a>Item 2</a></li>
                          </ul>
                      </div>
                    </div>
                      <div class="bg-gray-100 p-2 rounded-lg">
                          <h3 class="font-semibold">Card 3</h3>
                          <p>Details about card 3.</p>
                      </div>
                  </div>
              </div>

            `;
            container.insertAdjacentHTML('beforeend', listaHtml);
        });
    } catch (error) {
        console.error("Erro ao buscar listas: ", error);
    }
}

function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.getElementById('alert-mensagem');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.className = `alert alert-${tipo}`;
    mensagemDiv.style.display = 'block';
    mensagemDiv.style.color = '#fff';

    setTimeout(() => {
        mensagemDiv.style.display = 'none';
    }, 5000); 
}

document.addEventListener('DOMContentLoaded', () => {
    listarListas();
});
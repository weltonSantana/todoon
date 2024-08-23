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
        console.log(data);
        const container = document.getElementById('listas-container');
        container.innerHTML = ''; 

        data.forEach(lista => {
            const listaHtml = `
                <div class="w-1/4 p-4 lista-dropzone" id="lista-${lista.id}" ondragover="allowDrop(event)" ondrop="drop(event, ${lista.id})" ondragleave="dragLeave(event)">
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <div class="flex justify-between">
                            <p class="font-semibold mb-4">${lista.nome}</p>
                            <div class="dropdown dropdown-left">
                                <div tabindex="0" role="button"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li><a class="" onclick="removerLista(${lista.id})">Apagar</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div id="cartoes-container-${lista.id}" class="cartao-container" ondragover="dragOverCartao(event)">
                        </div>
                        
                        <div id="form-criar-cartao-${lista.id}" style="display: none;" class="mt-2">
                            <input type="text" name="titulo" id="nome_cartao_${lista.id}" placeholder="Título do cartão" class="input input-bordered w-full mb-2">
                            <div class="flex justify-between mt-2">
                                <button onclick="criarCartao(${lista.id})" class="btn btn-sm bg-[#fff] border-1 border-[#202127] hover:text-[#fff] hover:bg-[#202127] m-0">Adicionar Cartão</button>
                                <button onclick="cancelarCriacaoCartao(${lista.id})" class="btn btn-sm text-gray-600">Cancelar</button>
                            </div>
                        </div>

                        <div id="adicionar-cartao-btn-${lista.id}" class="mt-2">
                            <button onclick="mostrarFormCriarCartao(${lista.id})" class="btn bg-gray-200 text-gray-700">+ Adicionar um cartão</button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', listaHtml);
            listarCartoes(lista.id);
        });
    } catch (error) {
        console.error("Erro ao buscar listas: ", error);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
    const target = ev.currentTarget;
    target.classList.add('hovered', 'expanded');
}

function drag(ev, cartaoId) {
    ev.dataTransfer.setData("cartaoId", cartaoId);
}

function drop(ev, listaId) {
    ev.preventDefault();
    const cartaoId = ev.dataTransfer.getData("cartaoId");
    atualizarCartaoLista(cartaoId, listaId);

    const target = ev.currentTarget;
    target.classList.remove('hovered', 'expanded');
}

function dragLeave(ev) {
    const target = ev.currentTarget;
    target.classList.remove('hovered', 'expanded');
}

function dragOverCartao(ev) {
    ev.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const target = ev.target.closest('.cartao');

    if (target && draggingElement !== target) {
        const container = target.parentNode;
        const bounding = target.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;

        if (ev.clientY - offset > 0) {
            container.insertBefore(draggingElement, target.nextSibling);
        } else {
            container.insertBefore(draggingElement, target);
        }
    }
}


function atualizarCartaoLista(cartaoId, novaListaId) {
    const container = document.getElementById(`cartoes-container-${novaListaId}`);
    const cartoes = Array.from(container.children);
    const novoIndex = cartoes.findIndex(cartao => cartao.id === `cartao-${cartaoId}`);

    let data = {
        'lista': novaListaId,
        'ordem': novoIndex,
    };

    fetch(`/api/cartoes/${cartaoId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
        }
    })
    .then(response => response.json())
    .then(json => {
        listarListas(); 
    })
    .catch(err => {
    });
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



function mostrarFormCriarCartao(listaId) {
  document.getElementById(`adicionar-cartao-btn-${listaId}`).style.display = 'none';
  document.getElementById(`form-criar-cartao-${listaId}`).style.display = 'block';
}

function cancelarCriacaoCartao(listaId) {
  document.getElementById(`adicionar-cartao-btn-${listaId}`).style.display = 'block';
  document.getElementById(`form-criar-cartao-${listaId}`).style.display = 'none';
}

function criarCartao(listaId) {
  const nomeCartao = document.querySelector(`#nome_cartao_${listaId}`).value;

  let data = {
      'titulo': nomeCartao,
      'lista': listaId,
  };

  fetch('/api/cartoes', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
      }
  })
  .then(response => response.json())
  .then(json => {
      listarCartoes(listaId);
      mostrarMensagem('Cartão criado com sucesso!', 'success');
      cancelarCriacaoCartao(listaId); 
  })
  .catch(err => {
      mostrarMensagem(err.message, 'error');
  });
}


async function listarCartoes(listaId) {
    try {
        let response = await fetch(`/api/cartoes?lista=${listaId}`);
        let data = await response.json();

        const container = document.getElementById(`cartoes-container-${listaId}`);
        container.innerHTML = ''; 

        data.forEach(cartao => {
            const cartaoHtml = `
                <div class="bg-gray-100 p-2 rounded-lg mt-2 cartao" draggable="true" ondragstart="drag(event, ${cartao.id})" id="cartao-${cartao.id}">
                    <h3 class="font-semibold">${cartao.titulo}</h3>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cartaoHtml);
        });

        const cartoes = document.querySelectorAll('.cartao');
        cartoes.forEach(cartao => {
            cartao.addEventListener('dragstart', () => {
                cartao.classList.add('dragging');
            });

            cartao.addEventListener('dragend', () => {
                cartao.classList.remove('dragging');
            });
        });

    } catch (error) {
        console.error("Erro ao buscar cartões: ", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    listarListas();
});
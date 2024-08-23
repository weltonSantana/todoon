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
                <div class="w-[400px] p-2 lista-dropzone" id="lista-${lista.id}" ondragover="allowDrop(event)" ondrop="drop(event, ${lista.id})" ondragleave="dragLeave(event)">
                    <div class="">
                        <div class="bg-gray-200 dark:bg-[#0F0E13] dark:text-[#fff] rounded-[10px] p-3 flex items-center justify-between">
                            <p class="font-semibold ">${lista.nome}</p>
                            <div class="dropdown dropdown-left">
                                <div tabindex="0" role="button"><i class="fa-solid fa-ellipsis"></i></div>
                                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li><a class="" onclick="removerLista(${lista.id})">Apagar</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div id="cartoes-container-${lista.id}" class="cartao-container " ondragover="dragOverCartao(event)">
                        </div>
                        
                        <div id="form-criar-cartao-${lista.id}" style="display: none;" class="mt-2 ">
                            <input type="text" name="titulo" id="nome_cartao_${lista.id}" placeholder="Título do cartão" class="input input-bordered w-full mb-2">
                            <div class="flex justify-between mt-2">
                                <button onclick="criarCartao(${lista.id})" class="btn btn-sm bg-[#fff] border-1 border-[#202127] hover:text-[#fff] hover:bg-[#202127] m-0">Adicionar Cartão</button>
                                <button onclick="cancelarCriacaoCartao(${lista.id})" class="btn btn-sm text-gray-600">Cancelar</button>
                            </div>
                        </div>

                        <div id="adicionar-cartao-btn-${lista.id}" class="mt-4">
                            <button onclick="mostrarFormCriarCartao(${lista.id})" class="outline-2 transition-all duration-300 rounded-[10px] w-full outline-dashed hover:p-6 p-4 bg-gray-100 text-gray-700 dark:text-white dark:outline-[#fff] dark:bg-[#1D1C1F]">+ Adicionar um cartão</button>
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
    const cartaoElement = document.getElementById(`cartao-${cartaoId}`);
    const novaListaContainer = document.getElementById(`cartoes-container-${novaListaId}`);
    
    cartaoElement.remove();

    novaListaContainer.appendChild(cartaoElement);

    const cartoes = Array.from(novaListaContainer.children);

    cartoes.forEach((cartao, index) => {
        const ordemAtualizada = {
            'lista': novaListaId,
            'ordem': index
        };

        console.log(index)

        fetch(`/api/cartoes/${cartao.id.replace('cartao-', '')}`, {
            method: "PUT",
            body: JSON.stringify(ordemAtualizada),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(`Cartão ${cartao.id} atualizado para ordem ${index}`);
            console.log(json)

        })
        .catch(err => {
            console.error("Erro ao atualizar a ordem do cartão: ", err);
        });
    });
}


async function atualizarUmaLista(listaId) {
    try {
        let response = await fetch(`/api/cartoes?lista=${listaId}`);
        let data = await response.json();
        
        const container = document.getElementById(`cartoes-container-${listaId}`);
        container.innerHTML = ''; 

        data.forEach(cartao => {
            const cartaoHtml = `
                <div class="bg-gray-200 rounded-[10px] dark:bg-[#0F0E13] dark:text-[#fff]  p-3 mt-2 h-16 cartao" draggable="true" ondragstart="drag(event, ${cartao.id})" id="cartao-${cartao.id}">
                    <h3 class="font-semibold">${cartao.titulo}</h3>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cartaoHtml);
        });

        adicionarListenersDeDrag();

    } catch (error) {
        console.error("Erro ao buscar cartões: ", error);
    }
}

function adicionarListenersDeDrag() {
    const cartoes = document.querySelectorAll('.cartao');
    cartoes.forEach(cartao => {
        cartao.addEventListener('dragstart', () => {
            cartao.classList.add('dragging');
        });

        cartao.addEventListener('dragend', () => {
            cartao.classList.remove('dragging');
        });
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

        console.log(data)

        data.forEach(cartao => {
            const cartaoHtml = `
                <div class="bg-gray-200 rounded-[10px] dark:bg-[#0F0E13] dark:text-[#fff]  p-3 mt-2 h-16 cartao" draggable="true" ondragstart="drag(event, ${cartao.id})" id="cartao-${cartao.id}">
                    <h3 class="font-semibold">${cartao.titulo}</h3>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cartaoHtml);
        });

        adicionarListenersDeDrag();

    } catch (error) {
        console.error("Erro ao buscar cartões: ", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    listarListas();
});
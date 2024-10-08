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
        // console.log('Lista Criada com sucesso!');
    })
    .catch(err => {
        mostrarMensagem(err.message, 'error');
        // console.log("erro")
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
        //   console.log('Projeto removido');
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
        const container = document.getElementById('listas-container');
        container.innerHTML = ''; 

        if (data.length === 0) {
            $('#ErroMensagem').show(); 
        } else{
            $('#ErroMensagem').hide(); 

            container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2';  

            data.forEach(lista => {
                const listaHtml = `
                    <div class="text-black w-full sm:w-[300px] lg:w-[350px] p-2 lista-dropzone dark:lista-dropzones" id="lista-${lista.id}" ondragover="allowDrop(event)" ondrop="drop(event, ${lista.id})" ondragleave="dragLeave(event)">
                        <div class="">
                            <div class="bg-gray-200 dark:bg-[#0F0E13] dark:text-[#fff] rounded-[10px] p-3 flex items-center justify-between">
                                <p class="font-semibold ">${lista.nome}</p>
                                <div class="dropdown dropdown-left">
                                    <div tabindex="0" role="button"><i class="fa-solid fa-ellipsis"></i></div>
                                    <ul tabindex="0" class="dropdown-content dark:border-[#fff] dark:bg-[#3b3b3b] dark:text-white menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li><a class="" onclick="removerLista(${lista.id})">Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div id="cartoes-container-${lista.id}" class="cartao-container " ondragover="dragOverCartao(event)">
                            </div>
                            
                            <div id="form-criar-cartao-${lista.id}" style="display: none;" class="mt-2 ">
                                <input type="text" name="titulo" id="nome_cartao_${lista.id}" placeholder="Título do cartão" class="dark:bg-[#3b3b3b] input input-bordered dark:text-white w-full mb-2">
                                <div class="flex justify-between mt-2">
                                    <button onclick="criarCartao(${lista.id})" class="dark:hover:bg-[#fff] dark:hover:text-[#1D1C1F]  dark:border-[#fff] dark:text-[#fff] dark:bg-[#1D1C1F] btn btn-sm bg-[#fff] border-1 border-[#202127] hover:text-[#fff] hover:bg-[#202127] m-0">Adicionar Cartão</button>
                                    <button onclick="cancelarCriacaoCartao(${lista.id})" class="btn btn-sm text-gray-600">Cancelar</button>
                                </div>
                            </div>
    
                            <div id="adicionar-cartao-btn-${lista.id}" class="mt-4">
                                <button onclick="mostrarFormCriarCartao(${lista.id})" class="outline-2 transition-all duration-300 rounded-[10px] w-full outline-dashed hover:p-6 p-4 bg-gray-100 text-gray-700 dark:text-white dark:outline-[#fff] dark:bg-[#1D1C1F]">+ Adicionar um cartão</button>
                            </div>
                        </div>
                        <hr class="mt-4 mb-2 dark:border-[#3b3b3b]">
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', listaHtml);
                listarCartoes(lista.id);
            });
        }

    } catch (error) {
        console.error("Erro ao buscar listas: ", error);
        $('#tabela-alimentos-projetos').html('<tr><td colspan="5" class="text-center">Erro ao carregar dados.</td></tr>');
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

        // console.log(index)

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
            // console.log(`Cartão ${cartao.id} atualizado para ordem ${index}`);
            // console.log(json)

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
    const container = document.getElementById('alert-mensagem-container');

    let icone, iconeColor;
    if (tipo === 'success') {
        icone = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
        </svg>`;
        iconeColor = 'text-[#2b9875]';
    } else if (tipo === 'error') {
        icone = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg>`;
        iconeColor = 'text-red-600';
    }

    const alertHTML = `
      <div id="alert-mensagem" class="fade-in fixed bottom-4 right-4 mb-14 flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50">
        <div class="cursor-default flex items-center dark:bg-white justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] px-[10px]">
          <div class="flex gap-2">
            <div class="${iconeColor} bg-white/5 backdrop-blur-xl p-1 rounded-lg">
              ${icone}
            </div>
            <div>
              <p class="text-white dark:text-black">${mensagem}</p>
              <p class="text-gray-500">This is the ${tipo} message</p>
            </div>
          </div>
          <button class="text-gray-600 hover:bg-white/5 p-1 rounded-md transition-colors ease-linear" onclick="fecharMensagem()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = alertHTML;

    const alertMensagem = document.getElementById('alert-mensagem');
    setTimeout(() => {
        alertMensagem.classList.add('show');
    }, 10);

    setTimeout(() => {
        fecharMensagem();
    }, 5000);
}

function fecharMensagem() {
    const alertMensagem = document.getElementById('alert-mensagem');
    
    alertMensagem.classList.remove('show');
    alertMensagem.classList.add('hide');
    
    setTimeout(() => {
        const container = document.getElementById('alert-mensagem-container');
        container.innerHTML = '';
    }, 500);
}


function fecharMensagem() {
    const container = document.getElementById('alert-mensagem-container');
    container.innerHTML = ''; 
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
    //   mostrarMensagem('Cartão criado com sucesso!', 'success');
      cancelarCriacaoCartao(listaId); 
  })
  .catch(err => {
    //   mostrarMensagem(err.message, 'error');
  });
}


async function listarCartoes(listaId) {
    try {
        let response = await fetch(`/api/cartoes?lista=${listaId}`);
        let data = await response.json();

        const container = document.getElementById(`cartoes-container-${listaId}`);
        container.innerHTML = ''; 

        // console.log(data)

        

        data.forEach(cartao => {
            const cartaoHtml = `
                <div onclick="modalConteudoCartao${cartao.id}.showModal()" class="text-black bg-gray-200 rounded-[10px] dark:bg-[#0F0E13] dark:text-[#fff]  p-3 mt-2 h-16 cartao" draggable="true" ondragstart="drag(event, ${cartao.id})" id="cartao-${cartao.id}">
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
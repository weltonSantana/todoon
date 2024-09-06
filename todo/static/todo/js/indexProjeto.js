document.getElementById('criar-projeto').addEventListener('click', criarProjeto);

function criarProjeto() {
    let data = {
      'nome': document.querySelector('#id_nome').value,
      'descricao': document.querySelector('#id_descricao').value,
    };

    fetch('/api/projetos', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
        }
    })
    .then(response => {
        if (!response.ok) {
           
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(json => {
        listarProjetos();
        mostrarMensagem('Projeto criado com sucesso!', 'success');
        // console.log('Projeto Criado com sucesso!');
    })
    .catch(err => {
        // console.error('Error:', err);
        mostrarMensagem(err.message, 'error')
    });
}



async function listarProjetos() {

  try {
      var response = await fetch(`/api/projetos`);
      let data = await response.json();
      // console.log(data)
      const container = document.getElementById('projetos-container');
      container.innerHTML = ''; 

      data.forEach(projeto => {
          var nome = projeto.nome;
          var descricao = projeto.descricao;
          var valorTruncadoNome = nome.substring(0, 20)
          var valorTruncadoDescricao = descricao.substring(0, 30)
          const rowHtml = `
            <div
              class="service-card w-[300px] max-h-[188px] shadow-xl cursor-pointer snap-start shrink-0 py-8 px-6 bg-white dark:bg-[#0F0E13] dark:hover:bg-[#1a103d] flex flex-col items-start gap-3 transition-all rounded-[16px] duration-300 group hover:bg-[#202127]"
            >
              <p class="font-bold dark:hover:text-black/80 text-2xl group-hover:text-white dark:text-white text-black/80">
              ${valorTruncadoNome}
              </p>
              <p class="text-gray-400 text-sm">
              ${valorTruncadoDescricao}
              </p>

              <div class="flex gap-2 self-end">
                <p
                  style="-webkit-text-stroke: 1px gray; -webkit-text-fill-color: transparent;"
                  class="text-3xl font-bold "
                >
                  <a class="" onclick="removerProjeto(${projeto.id})"><i class="fa-solid fa-trash"></i></a>
                </p>

                <p
                  style="-webkit-text-stroke: 1px gray; -webkit-text-fill-color: transparent;"
                  class="text-3xl font-bold"
                >
                  <a class="" onclick="abrirProjeto(${projeto.id})"> <i class="fa-solid fa-arrow-up-right-from-square"></i></i></a>
                </p>

              </div>
           
             
            </div>
      
          `;
          container.insertAdjacentHTML('beforeend', rowHtml);
      });
  } catch (error) {
      console.error("Erro ao buscar dados: ", error);
  }
  
}


function abrirProjeto(projetoId) {
  window.location.href = `/projeto/visualizar/${projetoId}`; 
}


async function removerProjeto(projetoId) {
  try {
      let response = await fetch(`/api/projetos/${projetoId}`, {
          method: "DELETE",
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val()
          }
      });
      if (response.ok) {
          // console.log('Projeto removido');
          mostrarMensagem('Projeto removido com sucesso!', 'success');
          listarProjetos();  
      } else {
          console.error('Erro ao remover:', response.status, response.statusText);
      }
  } catch (error) {
      mostrarMensagem(err.message, 'error')
      console.error("Erro ao buscar dados: ", error);
  }
}


function mostrarMensagem(mensagem, tipo) {
  const container = document.getElementById('alert-mensagem-index');

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
      const container = document.getElementById('alert-mensagem-index');
      container.innerHTML = '';
  }, 500);
}


function fecharMensagem() {
  const container = document.getElementById('alert-mensagem-index');
  container.innerHTML = ''; 
}


document.addEventListener('DOMContentLoaded', () => {
      listarProjetos();
});

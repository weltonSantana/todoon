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
    .then(response => response.json())
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
      listarProjetos();
});

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
        console.log('Projeto Criado com sucesso!');
    })
    .catch(err => {
        console.error('Error:', err);
    });
}



async function listarProjetos() {

  try {
      var response = await fetch(`/api/projetos`);
      let data = await response.json();
      console.log(data)
      const container = document.getElementById('projetos-container');
      container.innerHTML = ''; 

      data.forEach(projeto => {
          const rowHtml = `
            <div
              class="service-card w-[300px] shadow-xl cursor-pointer snap-start shrink-0 py-8 px-6 bg-white flex flex-col items-start gap-3 transition-all rounded-[16px] duration-300 group hover:bg-[#202127]"
            >
              <p class="font-bold text-2xl group-hover:text-white text-black/80">
              ${projeto.nome}
              </p>
              <p class="text-gray-400 text-sm">
              ${projeto.descricao}
              </p>
            </div>
      
          `;
          container.insertAdjacentHTML('beforeend', rowHtml);
      });
  } catch (error) {
      console.error("Erro ao buscar dados: ", error);
  }
  
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
          console.log('Projeto removido');
          listarProjetos();  
      } else {
          console.error('Erro ao remover:', response.status, response.statusText);
      }
  } catch (error) {
      console.error("Erro ao buscar dados: ", error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
      listarProjetos();
});

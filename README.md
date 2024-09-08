Aqui está o README atualizado com as instruções de instalação usando o Docker Compose:

---

# ToDoOn

**ToDoOn** é um sistema de gerenciamento de tarefas inspirado no Trello, desenvolvido com Django e Tailwind CSS. Ele permite que usuários criem, organizem e gerenciem suas tarefas em quadros, listas e cartões, facilitando o acompanhamento e a conclusão de tarefas.

![alt text](media/image-1.png)
![alt text](media/image.png)

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
  - [Instalação Local](#instalação-local)
  - [Instalação com Docker Compose](#instalação-com-docker-compose)

## Visão Geral

ToDoOn foi desenvolvido para proporcionar uma experiência intuitiva e visual para gerenciar tarefas. Inspirado no Trello, o sistema utiliza uma interface de arrastar e soltar (drag-and-drop) para facilitar a organização de tarefas em diferentes listas e quadros.

## Funcionalidades

- **Quadros**: Crie e organize seus projetos em diferentes quadros.
- **Listas**: Adicione listas dentro dos quadros para categorizar suas tarefas.
- **Cartões**: Crie cartões dentro das listas para representar tarefas individuais.
- **Arrastar e Soltar**: Mova cartões entre listas usando uma interface drag-and-drop.
- **Etiquetas**: Adicione etiquetas coloridas aos cartões para uma rápida identificação.
- **Datas de Vencimento**: Defina prazos para suas tarefas e receba notificações de lembrete.

## Tecnologias Utilizadas

- **Backend**: Django, Django Rest Framework
- **Frontend**: Tailwind CSS
- **Banco de Dados**: PostgreSQL
- **Deploy**: Docker

## Instalação

### Instalação Local

Siga os passos abaixo para configurar o projeto localmente:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/ToDoOn.git
   cd ToDoOn
   ```

2. **Crie e ative um ambiente virtual**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instale as dependências**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o banco de dados**:

   - Atualize o arquivo `.env` com suas credenciais do banco de dados.

   - Execute as migrações:

   ```bash
   python manage.py migrate
   ```

5. **Execute o servidor**:

   ```bash
   python manage.py runserver
   ```

6. **Acesse o sistema**:

   - Abra seu navegador e acesse `http://localhost:8000`.

### Instalação com Docker Compose

Siga as instruções abaixo para rodar o ToDoOn utilizando Docker Compose.

#### 1. Pré-requisitos

- Docker
- Docker Compose

#### 2. Passos de Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/ToDoOn.git
   cd ToDoOn
   ```

2. **Configure o arquivo `.env`**:

   No diretório do projeto, crie um arquivo `.env` e adicione as seguintes variáveis de ambiente, ou modifique conforme necessário:

   ```bash
   DB_USUARIO=teste
   DB_SENHA=teste
   DB_NOME=teste
   DB_HOST=db
   DB_PORT=5432
   SECRET_KEY=teste
   DEBUG=True
   ALLOWED_HOSTS='localhost'
   CSRF_TRUSTED_ORIGINS='http://localhost:8000'
   ```

3. **Suba os serviços com o Docker Compose**:

   No diretório raiz do projeto, execute:

   ```bash
   docker-compose up --build
   ```

   Isso iniciará três serviços:

   - **db**: O banco de dados PostgreSQL.
   - **redis**: O serviço Redis.
   - **web**: O aplicativo ToDoOn rodando com Uvicorn.

4. **Acesse o sistema**:

   Após o comando anterior ser executado com sucesso, o sistema estará disponível em `http://localhost:8000`.

#### 3. Estrutura do Docker Compose

O arquivo `docker-compose.yml` está configurado da seguinte forma:

```yaml
services:
  db:
    container_name: todoon_postgresql
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=${DB_USUARIO}
      - POSTGRES_PASSWORD=${DB_SENHA}
      - POSTGRES_DB=${DB_NOME}
    volumes:
      - ./src/data/init.sql:/docker-entrypoint-initdb.d/init.sql
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    container_name: todoon_redis
    image: redis:alpine
    restart: always
    ports:
      - 6379:6379
    networks:
      - app-network

  web:
    container_name: todoon_app
    build: .
    command: uvicorn project.asgi:application --host 0.0.0.0 --port 8000 --reload --reload-dir /app --reload-include '*.py' --reload-include '*.html' --reload-include '*.css' --reload-include '*.js' --reload-exclude '*.log'
    ports:
      - 8000:8000
    volumes:
      - .:/app
    working_dir: /app
    depends_on:
      - db
      - redis
    restart: always
    env_file:
      - .env
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

Com essa configuração, os serviços necessários (PostgreSQL, Redis e o aplicativo web) serão iniciados automaticamente e estarão prontos para uso.

---

Com essas instruções, você deve conseguir configurar e rodar o ToDoOn localmente ou via Docker Compose com facilidade.

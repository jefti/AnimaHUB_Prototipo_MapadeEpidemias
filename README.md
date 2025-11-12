# 🗺️ Projeto Mapa de Epidemias

Aplicação web que exibe um mapa interativo com pontos de doenças registradas em uma cidade.  
Usuários autenticados podem adicionar novos registros de forma simples e visual.  
O sistema é composto por um **front-end em React** e um **back-end em Node.js**, integrados a um **banco de dados MySQL**.

---

## 🚀 Guia de Instalação

### 1. Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (com NPM)
- MySQL
- Acesso à internet

---

### 2. Banco de Dados

Para criar o banco de dados, execute o comando SQL presente no arquivo:
``api/database/script.sql``


Você pode executar esse script pelo terminal do MySQL ou por ferramentas como o MySQL Workbench.  
Esse script cria todas as tabelas necessárias para o funcionamento da aplicação.

---

### 3. Instalação das Dependências

Acesse as pastas raiz do **front-end** e **back-end** e execute o comando:

```
npm i
```

### 4. Arquivos de Configuração

Crie arquivos .env nas pastas raiz do front-end e back-end, seguindo os exemplos presentes em cada .env.example.

Esses arquivos armazenam as variáveis de ambiente (como portas, credenciais e configuração de banco de dados).

### 5. Execução

Para executar o projeto, utilize o comando abaixo em cada pasta (front e back):

```npm run start```

Certifique-se de que:

- As portas 3000 (back-end) e 5173 (front-end) estejam livres.

O MySQL esteja instalado, rodando e com o banco de dados criado.

O sistema já vem com um login de teste para uso inicial:

```
Usuário: teste
Senha: teste
```

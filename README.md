# demaodeobra

Projeto desenvolvido paras as disciplinas de Banco de Dados, Metodologia e Programação de Scripts do curso de Análise e Desenvovilmento de Sistemas da Fatec Jessen Vidal.

## O Projeto

demaodeobra é um site para que profissionais da área de construção e reforma possam anunciar os seus serviços. Os usuários podem publicar anúncios, buscar e visualizar anúncios por categorias ou regiões e enviar mensagens diretamente para os anunciantes.

## Requisitos do projeto

Requisitos Não-Funcionais:
* React
* Bootstrap
* As três partes da aplicação (banco, back e front) deverão ser disponibilizadas na Nuvem

Requisitos Funcionais:
* Cadastrar um novo usuário
* Validar cadastro da conta através do disparo de e-mail com link para ativação
* Alterar dados cadastrais (dados pessoais ou de acesso)
* Cadastrar, Alterar e Deletar anúncios:
* Com ou sem Fotos
* Com ou sem Valor do Serviço
* Visualizar os anúncios cadastrados
* Buscar anúncios por Título, Categoria, Estado ou Cidade
* Usuários podem enviar Mensagens para os anunciantes
* Anunciantes podem responder as Mensagens
* Restringir cadastro de anúncios e envio de mensagens apenas para usuários cadastrados
* Restringir a visualização do telefone apenas para usuários cadastrados

## Tecnologias

* React
* Bootstrap
* React Suite
* Axios
* Express
* PostgreSQl
* Heroku

## Instalação e execução

### Pré-requisitos
Ambas as aplicações precisam do Node.js: https://nodejs.org/en/download/

E também de um banco de dados PostgreSQL disponível para instalação no seguinte endereço: 
https://www.postgresql.org/download/

Você também pode configurar um banco na nuvem sugerimos o serviço gratuito:
https://www.elephantsql.com/

Ou o próprio Heroku Postgres: https://heroku.com/

### Banco de dados

Execute o arquivo **sql_2021-06-15.sql** disponível na pasta docs para a crição das tabelas necessárias.  
Execute o arquivo **categorias.sql** disponível na pasta docs para inserir as categorias de anúncios.  


### Aplicação back

Antes de executar a aplicação back crie um arquivo **.env** com as seguintes variáveis:

```javascript
GOOGLE_USER=Seu_endereço_Gmail // e.g test@gmail.com
GOOGLE_PASSWORD=Senha_do_seu_Gamil
DOMAIN=Url_da_sua_aplicação_front // e.g http://localhost:3000
SECRET=Chave_para_configuração_do_JWT
DATABASE_URL=Url_do_seu_banco // talvez seja necessário alterar configuração de SSL no arquivo db.js
```

Criação da pasta node_modules e execução:
```javascript
npm i // para instalar as dependências
npm start // para executar
```

### Aplicação front

Antes de executar a aplicação front crie um arquivo **.env** com as seguintes variáveis:

```javascript
REACT_APP_BACKEND=Url_da_sua_aplicação_back // e.g http://localhost:3101
```

Criação da pasta node_modules e execução:
```javascript
npm i // para instalar as dependências
npm start // para executar
```

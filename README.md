# Entrega do desafio Anestech.

A versão do [NodeJS](https://nodejs.org/en/ "NodeJS") utilizada foi **v10.17.0**
O [Yarn](https://classic.yarnpkg.com/en/ "Yarn") foi usado como o gerenciador de pacotes de toda a aplicação.
O [MariaDB](https://mariadb.org/ "MariaDB") foi usado como banco de dados relacional.
O [Docker](https://www.docker.com/ "Docker") foi usado com o servidor do banco MariaDB.

------------

## Instalando a aplicação
Baixe o repositório numa pasta de sua preferência e digite o seguinte comando.
$ git clone https://github.com/daniloas80/desafio-anestech.git

### Preparando o back-end com o Docker
1. Abra o terminal e instale o *conteiner* para o banco de dados MariaDB conforme abaixo. Se preferir, use outros nomes para os *conteiner* logo depois da flag  `--name`.

**MarinaDB**
	```bash
	$ docker run --name anestech -e MYSQL_ROOT_PASSWORD=anestech2020 -p 3309:3306 -d mariadb
	```
  1. Inicialize o *container* no Docker via terminal:
	```bash
	$ docker start anestech
	```

  1. Use uma GUI para banco de dados SQL de sua preferência (TablePlus, DBeaver, Valentina Studio ou outro) e crie um banco de dados MariaDB com o nome `dbanestech` e encoding `UTF-8`. Use `root` como nome de usuário e `anestech2020` como senha.

### Estruturando o banco de dados MariaDB da aplicação (*running migrations*)
Com o terminal aberto no diretório `<diretório escolhido>`, execute o seguinte comando:
```javascript
$ yarn install
$ yarn sequelize db:migrate
```

### Populando o banco de dados (*running seeds*)
Existem dois arquivos na pasta `src/database/seeds` para popular o banco de dados. O primeiro arquivo cria o cadastro do cargo administrador visto que todos os usuários deverão ter um cargo e somente o administrador poderá realizar as operações CRUD. O segundo arquivo cria um usuário administrador que pode se autenticar no sistema usando e-mail e senha (`admin@anestech.com.br` e `123456` respectivamente).

Com o terminal aberto no diretório `<diretório escolhido>`, execute o seguinte comando:
```javascript
$ yarn sequelize db:seed:all
```

###### Agora a aplicação está pronta para testar!

------------
## Testando a aplicação

### Iniciando o servidor (Anestech API)
No terminal, inicie o servidor com o comando:
```bash
$ yarn start
```
A seguinte mensagem deve aparecer:
```
yarn run v<número da versão do yarn>
warning ../../../package.json: No license field
$ nodemon src/server.js
[nodemon] <número da versão do nodemon>
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r sucrase/register src/server.js`
```
Use a REST API Client de sua preferência, mas se for usuário do [Insomnia](https://insomnia.rest/ "Insomnia"), poderá importar a [workspace](https://1drv.ms/u/s!AnbOrmXyUygXgroKFjrv8Ka9mosQKw?e=27hMDA) que eu criei para rodar os teste da aplicação.

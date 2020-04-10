import Router from 'express';

import SessionController from './app/controllers/SessionController';
import DepartmentController from './app/controllers/DepartmentController';
import RoleController from './app/controllers/RoleController';
import UserController from './app/controllers/UserController';
import TaskController from './app/controllers/TaskController';

import authMiddleware from './app/middlewares/auth';
import restricted from './app/middlewares/permissions';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send('Bem-vindo ao gestor de tarefas da Anestech');
});

routes.post('/sessions', SessionController.store);
// definindo a regra de autenticação de forma global
// todas as rotas que vier após o middleware passará pela verificação de autenticação
// rotas com o middleware 'restricted' significa que será verificado se o usuário
// poderá acessar a rota ou não. Há rotas que são compartilhadas pelo administrado e o usuário
// ndelas, eu faço a verificação da permissão do uso da funcionalidade em questão
routes.use(authMiddleware);
// rotas para manipulação de departamentos
routes.get('/departments', restricted, DepartmentController.index);
routes.get(
  '/departments/show-departments/:id',
  restricted,
  DepartmentController.index
);
routes.post('/departments', restricted, DepartmentController.store);
routes.put('/departments/:id', restricted, DepartmentController.update);
routes.delete('/departments/:id', restricted, DepartmentController.delete);
// rotas para manipulação de cargos
routes.get('/roles', restricted, RoleController.index);
routes.get('/roles/show-roles/:id', restricted, RoleController.index);
routes.post('/roles', restricted, RoleController.store);
routes.put('/roles/:id', restricted, RoleController.update);
routes.delete('/roles/:id', restricted, RoleController.delete);
// rotas para manipulação de usuários
routes.get('/users', restricted, UserController.index);
routes.get('/users/show-user/:id', restricted, UserController.index);
routes.post('/users', restricted, UserController.store);
routes.put('/users/:id', UserController.update);
// rotas para manipulação de tarefas
// lista todas as tarefas
routes.get('/tasks', TaskController.index);
// lista uma tarefa expecífica. Usado para edição por exemplo
routes.get('/tasks/show-task/:id', TaskController.index);
// lista todas as tarefas por usuário
routes.get('/tasks/show-task/users/:user_id', TaskController.index);
// lista a performace dos usuários
// para listar a performance de todos os usuários: p_user_id = 0
// para listar a performance de um usuário desejado: p_user_id = <id do usuário>
routes.get('/tasks/show-performance/users/:p_user_id', TaskController.index);
// lista todas as tarefas por departamento
routes.get('/tasks/show-task/departments/:department_id', TaskController.index);
// lista a performance dos departamentos
// para listar a performance de todos os departamentos: p_department_id = 0
// para listar a performance de um usuário desejado: p_department_id = <id do departamento>
routes.get(
  '/tasks/show-performance/departments/:p_department_id',
  TaskController.index
);
// lista todas as tarefas
// para realizar filtros basta passar por query string os seguintes parâmentros
// base_url/tasks/?text=&name=&department=&datetime=&sortby=&sortorder=&page=&records=
// não há a necessidade de preencher todos os parâmetros
// text -> pesquisa por descrição da tarefa
// name -> pesquisa por nome do usuário
// department -> pesquisa por nome do departamento
// datetime -> pesquisa por data e hora ex: 2020-04-01 data expecífica; 2020-04 mês de abril ...
// sortby -> ordenação que poderá ser feita por qualquer campo da tabela tasks ex.: id
// sortorder -> orientação do pesquisa: ordem crescente ou decrescente [ASC, DESC]
// page -> paginação da pesquisa
// records -> quantidade de registro por página
routes.get('/tasks/', TaskController.index);
routes.post('/tasks', TaskController.store);
routes.put('/tasks/:id', TaskController.update);
routes.delete('/tasks/:id', restricted, TaskController.delete);

export default routes;

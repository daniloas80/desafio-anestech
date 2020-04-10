/* eslint-disable eqeqeq */
import { Op } from 'sequelize';
import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import databaseConfig from '../../database/index';

import Tasks from '../models/Tasks';
import Users from '../models/Users';
import Departments from '../models/Departments';

class TasksController {
  async index(req, res) {
    // a funcção abaixo é utilizado na propriedade do where do 'findAll' na linha 151.
    // Se o usuário logado é administrador, a função retornará todas as tarefas,
    // caso não seja administrado, ou seja um agente, ele só poderá listar as suas próprias tarefas
    const operator = {
      not: { [Op.not]: null },
      eq: { [Op.eq]: req.userId },
    };
    function userConditional(role_id) {
      const which_oper = role_id === 1 ? 'not' : 'eq';
      return operator[which_oper];
    }

    // Se o usuário estiver tentando fazer uma edição, a rota virá com o parâmentro id preenchido,
    // caso contrário, o usuário estará na página principal listando todos.
    // Código que exibe somente a tarefa desejada o parâmetro passado precisa ser um campo da tabela tasks
    const { id } = req.params;
    if (id > 0) {
      const tasks = await Tasks.findByPk(id);
      if (tasks) {
        return res.json(tasks);
      }
      return res.json({ message: 'There is no Task to list' });
    }
    // lista de tarefas por usuários
    const { user_id } = req.params;
    if (user_id > 0) {
      const tasks = await Tasks.findAll({ where: { user_id } });
      if (Object.keys(tasks).length >= 1) {
        return res.json(tasks);
      }
    }
    // indicadores dos usuários
    // para este caso eu não passei um campo do banco de dados
    // (os req.params eu sempre passo como campos do db) porque, para este caso,
    // precisava diferenciar a rota para trazer as informações necessárias do usuário.
    // vide routes.js -> arquivo com todas as rotas do sistema
    const { p_user_id } = req.params;
    // filtro por tarefa concluída. O padrão é 1 (concluído)
    // código do status das tarefas
    // 0 -> aberto; 1 -> em adamento; 2 -> finalizada
    if (Number(p_user_id) >= 0) {
      if (req.roleId !== 1) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      const insert_where =
        Number(p_user_id) === 0 ? '' : `WHERE tasks.user_id = ${p_user_id}`;
      const [results] = await databaseConfig.connection.query(
        `${
          'SELECT tasks.user_id, users.`name`, count(tasks.id) as total_tasks, ' +
          "(SELECT count(status) FROM tasks where status = 0 and tasks.user_id = users.id) as 'aberto', (SELECT count(status) FROM tasks where status = 1 and tasks.user_id = users.id) as 'em adamento', " +
          "(SELECT count(status) as tot FROM tasks where status = 2 and tasks.user_id = users.id) as 'finalizado', (SELECT (DATEDIFF(tasks.created_at, tasks.start_date) / count(tasks.id))" +
          ' FROM tasks WHERE tasks.start_date IS NOT NULL AND tasks.user_id = users.id GROUP BY tasks.user_id) AS tempo_medio_inicio, (SELECT (DATEDIFF(tasks.end_date, tasks.start_date) / count(tasks.id)) ' +
          ' FROM tasks WHERE tasks.end_date IS NOT NULL AND tasks.user_id = users.id GROUP BY tasks.user_id) AS tempo_medio_conclusao ' +
          ' FROM tasks LEFT OUTER JOIN users on tasks.user_id = users.id '
        }${insert_where} GROUP BY tasks.user_id`
      );
      if (Object.keys(results).length >= 1) {
        return res.json(results);
      }
      return res.json({ message: 'There is no user with this id' });
    }

    // Indicadores dos departamentos
    // Segue a mesma filosofia dos indicadores de usuários.
    // Há possibilidade de deixar menos verboso, mas por conta do prazo foi mais fácil assim.
    // Para este caso eu não passei um campo do banco de dados
    // (os req.params eu sempre passo como campos do db) porque precisava diferenciar
    // a rota para trazer as informações necessárias do usuário.
    const { p_department_id } = req.params;
    // Filtro por tarefa concluída. O padrão é 1 (concluído).
    // Código do status das tarefas
    // 0 -> aberto; 1 -> em adamento; 2 -> finalizada
    if (Number(p_department_id) >= 0) {
      if (req.roleId !== 1) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      const insert_where =
        Number(p_department_id) === 0
          ? ''
          : `WHERE tasks.department_id = ${p_department_id}`;
      const [results] = await databaseConfig.connection.query(
        `${
          'SELECT tasks.department_id, departments.`name`, count(tasks.id) as total_tasks, ' +
          "(SELECT count(status) FROM tasks where status = 0 and tasks.department_id = departments.id) as 'aberto', " +
          "(SELECT count(status) FROM tasks where status = 1 and tasks.department_id = departments.id) as 'em adamento', " +
          "(SELECT count(status) as tot FROM tasks where status = 2 and tasks.department_id = departments.id) as 'finalizado', " +
          '(SELECT (DATEDIFF(tasks.created_at, tasks.start_date) / count(tasks.id)) ' +
          'FROM tasks WHERE tasks.start_date IS NOT NULL AND tasks.department_id = departments.id ' +
          'GROUP BY tasks.department_id) AS tempo_medio_inicio, (SELECT (DATEDIFF(tasks.end_date, tasks.start_date) / count(tasks.id)) ' +
          'FROM tasks WHERE tasks.end_date IS NOT NULL ' +
          'AND tasks.department_id = departments.id GROUP BY tasks.department_id) AS tempo_medio_conclusao ' +
          'FROM tasks LEFT OUTER JOIN departments on tasks.department_id = departments.id '
        }${insert_where} GROUP BY tasks.department_id`
      );
      // Caso encontre um resultado, ele será exibido no formato json.
      if (Object.keys(results).length >= 1) {
        return res.json(results);
      }
      return res.json({ message: 'There is no department with this id' });
    }

    // Lista de tarefas por departamentos.
    const { department_id } = req.params;
    if (department_id > 0) {
      const tasks = await Tasks.findAll({ where: { department_id } });
      if (Object.keys(tasks).length >= 1) {
        return res.json(tasks);
      }
    }
    // Abaixo há uma sequência de parâmentros para serem usadas em filtros.
    // pesquisa por descrição da tarefa
    const where_like = req.query.text ? req.query.text : '';
    // pesquisa por nome do usuário
    const name_like = req.query.name ? req.query.name : '';
    // pesquisa por nome do departamento
    const department_like = req.query.department ? req.query.department : '';
    // pesquisa por data e hora
    const query_datetime = req.query.datetime ? req.query.datetime : '';
    // ordenação que poderá ser feita por qualquer campo da tabela tasks
    const query_sortby = req.query.sortby ? req.query.sortby : 'id';
    // orientação do pesquisa: ordem crescente ou decrescente
    const query_sortorder = req.query.sortorder ? req.query.sortorder : 'ASC';
    // paginação da pesquisa. Por padrão a página inicial é sempre a 1
    const page = req.query.page ? req.query.page : 1;
    // quantidade de registro a ser exibido por na paginação
    const records = req.query.records ? Number(req.query.records) : 5;

    const tasks = await Tasks.findAll({
      where: {
        start_date: { [Op.substring]: `${query_datetime}` },
        description: {
          [Op.like]: `%${where_like}%`,
        },
        user_id: userConditional(req.roleId),
      },
      order: [[`${query_sortby}`, `${query_sortorder}`]],
      attributes: ['id', 'description', 'status', 'start_date', 'end_date'],
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'name'],
          where: {
            name: {
              [Op.like]: `%${name_like}%`,
            },
          },
        },
        {
          model: Departments,
          as: 'departments',
          attributes: ['id', 'name'],
          where: {
            name: {
              [Op.like]: `%${department_like}%`,
            },
          },
        },
      ],
      limit: records,
      offset: (page - 1) * records,
    });
    if (Object.keys(tasks).length >= 1) {
      return res.json(tasks);
    }
    return res.json({ message: 'There is no Task to list' });
  }

  async store(req, res) {
    // Código para validação das informações que são passada pelo usuário.
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      status: Yup.number().required(),
      start_date: Yup.date().nullable(),
      start_hour: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end_date: Yup.date().nullable(),
      end_hour: Yup.string()
        .nullable()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      user_id: Yup.number().positive().required(),
      department_id: Yup.number().positive().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      description,
      status,
      start_date,
      start_hour,
      end_date,
      end_hour,
      user_id,
      department_id,
    } = req.body;

    // verificação para saber se o usuário passado existe ou está ativo na base de dados
    const userExists = await Users.findOne({
      where: { id: user_id, deleted_at: { [Op.is]: null } },
    });
    if (!userExists) {
      return res.status(400).json({ error: 'There is no user with this id' });
    }

    // formatação da data e hora recebida pelo usuário para o formato DATE
    // se a data estiver preenchida, eu formato para o padrão do banco,
    // caso contrário a variável recebe nulo
    let start_date_formatted = start_date
      ? start_date.concat(' ', start_hour, ' UTC')
      : null;

    let end_date_formatted = end_date
      ? end_date.concat(' ', end_hour, ' UTC')
      : null;

    // verifico se já existe essa tarefa cadastrada para o usuário escolhido
    const taskExists = await Tasks.findOne({
      where: { description, user_id },
    });
    if (taskExists) {
      return res.status(400).json({ error: 'Tasks already exists' });
    }

    // gravo no banco de dados as informações da tarefa
    await Tasks.create({
      user_id,
      department_id,
      description,
      start_date: start_date_formatted,
      end_date: end_date_formatted,
      status,
    });

    // transformo a data início e a data de finalização para o formato brasileiro
    start_date_formatted = format(parseISO(start_date), 'dd/MM/yyyy', {
      locale: pt,
    });
    end_date_formatted = end_date
      ? format(parseISO(end_date), 'dd/MM/yyyy', {
          locale: pt,
        })
      : null;

    // informações filtradas passada para o frontend
    return res.json({
      user_id,
      department_id,
      description,
      start_date: start_date_formatted,
      start_hour,
      end_date: end_date_formatted,
      end_hour,
      status,
    });
  }

  async update(req, res) {
    // código para validação das informações que são passada pelo usuário
    const schema = Yup.object().shape({
      description: Yup.string(),
      status: Yup.number(),
      start_date: Yup.date().nullable(),
      start_hour: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end_date: Yup.date().nullable(),
      end_hour: Yup.string()
        .nullable()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      user_id: Yup.number().positive(),
      department_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verifica se o id passado exite na base de dados
    const tasks = await Tasks.findByPk(req.params.id);

    if (!tasks) {
      return res.status(400).json({ error: 'There is no Task with this id' });
    }

    const {
      description,
      status,
      start_date,
      start_hour,
      end_date,
      end_hour,
      user_id,
      department_id,
    } = req.body;

    // verifico se o usuário é administrador para alterar o usuário destinado a tarefa
    if (req.roleId !== 1) {
      if (user_id !== req.userId) {
        return res.status(401).json({ error: 'Unauthorized to change' });
      }
    }

    // Verifica se o id do usuer exite na base de dados
    const users = await Users.findByPk(user_id);
    if (!users) {
      return res.status(400).json({ error: 'There is no User with this id' });
    }

    // Verifica se o id do departamento exite na base de dados
    const departments = await Departments.findByPk(department_id);
    if (!departments) {
      return res
        .status(400)
        .json({ error: 'There is no Departement with this id' });
    }

    // formatação da data e hora recebida pelo usuário para o formato DATE
    const start_date_formatted = start_date
      ? start_date.concat(' ', start_hour, ' UTC')
      : null;
    // se a data final estiver preenchida, eu formato para o padrão do banco,
    // caso contrário a variável recebe nulo
    const end_date_formatted = end_date
      ? end_date.concat(' ', end_hour, ' UTC')
      : null;

    // verifico se o usuário alterou a descrição da tarefa e consulto no banco se já
    // existe uma tarefa com o mesmo nome
    if (description !== tasks.description) {
      const taskExists = await Tasks.findOne({
        where: { description },
      });

      if (taskExists) {
        return res.status(400).json({ error: 'Tasks already exists' });
      }
    }

    await tasks.update({
      description,
      status,
      start_date: start_date_formatted,
      end_date: end_date_formatted,
      user_id,
      department_id,
    });
    return res.json({
      description,
      status,
      start_date,
      start_hour,
      end_date,
      end_hour,
      user_id,
      department_id,
    });
  }

  async delete(req, res) {
    // Verifica se o id passado exite na base de dados
    const tasks = await Tasks.findByPk(req.params.id);

    if (!tasks) {
      return res.status(400).json({ error: 'There is no task with this id' });
    }
    try {
      return Tasks.destroy({
        where: {
          id: req.params.id,
        },
      }).then(function checkDeleted(deletedRecord) {
        if (deletedRecord === 1) {
          res.status(200).json({ message: 'Deleted successfully' });
        }
        res.status(404).json({ message: 'Record not found' });
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
export default new TasksController();

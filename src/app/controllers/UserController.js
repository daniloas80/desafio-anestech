// import * as Yup from 'yup';
import Users from '../models/Users';

class UserController {
  async index(req, res) {
    // Se o usuário estiver tentando fazer uma edição, a rota virá com o parâmentro id preenchido,
    // caso contrário, o usuário estará na página principal listando todos.
    const user_id = req.params.id;

    if (user_id > 0) {
      const users = await Users.findByPk(user_id);
      if (Object.keys(users).length >= 1) {
        return res.json(users);
      }
    }

    const users = await Users.findAll();

    if (Object.keys(users).length >= 1) {
      return res.json(users);
    }
    return res.json({ message: 'There is no User to list' });
  }

  //   async store(req, res) {
  //     // código para validação das informações que são passada pelo usuário
  //     const schema = Yup.object().shape({
  //       name: Yup.string().required(),
  //     });

  //     if (!(await schema.isValid(req.body))) {
  //       return res.status(400).json({ error: 'Validation fails' });
  //     }

  //     const rolesExists = await Roles.findOne({
  //       where: { name: req.body.name },
  //     });

  //     if (rolesExists) {
  //       return res.status(400).json({ error: 'Role already exists' });
  //     }

  //     // desta forma retornamos somente as informações que precisamos para o frontend
  //     const { name } = await Roles.create(req.body);
  //     return res.json({
  //       name,
  //     });
  //   }

  //   async update(req, res) {
  //     // código para validação das informações que são passada pelo usuário
  //     const schema = Yup.object().shape({
  //       name: Yup.string().required(),
  //     });

  //     if (!(await schema.isValid(req.body))) {
  //       return res.status(400).json({ error: 'Validation fails' });
  //     }

  //     // Verifica se o id da ajuda passado exite na base de dados
  //     const roles = await Roles.findByPk(req.params.id);

  //     if (!roles) {
  //       return res.status(400).json({ error: 'There is no role with this id' });
  //     }

  //     const { name } = req.body;

  //     if (name !== roles.name) {
  //       const roleExists = await Roles.findOne({ where: { name } });

  //       if (roleExists) {
  //         return res.status(400).json({ error: 'Role already exists' });
  //       }
  //     }

  //     const { id } = await roles.update(req.body);
  //     return res.json({
  //       id,
  //       name,
  //     });
  //   }

  //   async delete(req, res) {
  //     // Verifica se o id da ajuda passado exite na base de dados
  //     const roles = await Roles.findByPk(req.params.id);

  //     if (!roles) {
  //       return res.status(400).json({ error: 'There is no role with this id' });
  //     }
  //     try {
  //       return Roles.destroy({
  //         where: {
  //           id: req.params.id,
  //         },
  //       }).then(function checkDeleted(deletedRecord) {
  //         if (deletedRecord === 1) {
  //           res.status(200).json({ message: 'Deleted successfully' });
  //         }
  //         res.status(404).json({ message: 'Record not found' });
  //       });
  //     } catch (error) {
  //       return res.status(500).json(error);
  //     }
  //   }
}
export default new UserController();

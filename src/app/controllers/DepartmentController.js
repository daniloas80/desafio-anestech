import * as Yup from 'yup';
import Departments from '../models/Departments';

class DepartmentsController {
  async index(req, res) {
    // Se o usuário estiver tentando fazer uma edição, a rota virá com o parâmentro id preenchido,
    // caso contrário, o usuário estará na página principal listando todos.
    const department_id = req.params.id;

    if (department_id > 0) {
      const departments = await Departments.findByPk(department_id);
      if (Object.keys(departments).length >= 1) {
        return res.json(departments);
      }
    }

    const departments = await Departments.findAll();

    if (Object.keys(departments).length >= 1) {
      return res.json(departments);
    }
    return res.json({ message: 'There is no Department to list' });
  }

  async store(req, res) {
    // código para validação das informações que são passada pelo usuário
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const departmentsExists = await Departments.findOne({
      where: { name: req.body.name },
    });

    if (departmentsExists) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    // desta forma retornamos somente as informações que precisamos para o frontend
    const { name } = await Departments.create(req.body);
    return res.json({
      name,
    });
  }

  async update(req, res) {
    // código para validação das informações que são passada pelo usuário
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verifica se o id da ajuda passado exite na base de dados
    const departments = await Departments.findByPk(req.params.id);

    if (!departments) {
      return res
        .status(400)
        .json({ error: 'There is no department with this id' });
    }

    const { name } = req.body;

    // const departments = await Departments.findByPk(req.params.id);

    if (name !== departments.name) {
      const departmentExists = await Departments.findOne({ where: { name } });

      if (departmentExists) {
        return res.status(400).json({ error: 'Department already exists' });
      }
    }

    const { id } = await departments.update(req.body);
    return res.json({
      id,
      name,
    });
  }

  async delete(req, res) {
    // Verifica se o id da ajuda passado exite na base de dados
    const departments = await Departments.findByPk(req.params.id);

    if (!departments) {
      return res
        .status(400)
        .json({ error: 'There is no department with this id' });
    }
    try {
      return Departments.destroy({
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
export default new DepartmentsController();

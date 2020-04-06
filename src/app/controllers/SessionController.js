import jwt from 'jsonwebtoken';
// Usa-se o formato abaixo porque esse pacote chamada Yup não possui "export default"
// O asterisco significa que vai ser importado tudo do pacote e colocado na variável
// O pacote Yup é usado para validação
import * as Yup from 'yup';
import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    // fim da validação

    const { email, password } = req.body;
    // busco na base de dados se existe um usuário com o email informado
    const user = await User.findOne({ where: { email } });

    // verifico se o usuário exite no banco e se a senha está batendo
    // não retorno para o usuário se o problema está no login ou no passwaord
    // assim, evito que o hacker use força bruta somente para o descobrimento da senha.
    if (!user || !(await user.checarSenha(password))) {
      return res.status(401).json({ error: 'User or Password does not macth' });
    }

    const { id, name } = user;

    // Se passar pelas verificações acima, então retornar as informações do usuário
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Na função sign abaixo, o primeiro parâmetro é o chamado Payload
      // Payload é usado quando se quer reutilzar o token na aplicação
      // Geralmente insere-se uma informação relacionada ao usuário, como a id
      // O segundo parâmetro é um código MD5 único gerado normalmente com um texto aleatório
      // O terceiro parãmetro indica a duração do token (recomendado)
      // Nota: o segundo e o terceiro parâmetros foram incluídos num arquivo importado na linha 5
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

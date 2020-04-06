import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // verifico se o token foi enviado na requisição da url
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // a forma abaixo é desestruturada porque a primeira posição do array é o bearer do token
  // e para a nossa aplicação, ela não é necessária.
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // guardo a informação do id do usuário para que não seja necessário passar este id
    // como parâmetro na requisção da url no caso de edição de suas informações.
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

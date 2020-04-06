import Router from 'express';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'dashboard' }));
// definindo a regra de autenticação de forma global
// todas as rotas que vier após o middleware passará pela verificação de autenticação
routes.use(authMiddleware);

export default routes;

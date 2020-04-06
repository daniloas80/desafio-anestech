import Router from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'dashboard' }));

export default routes;

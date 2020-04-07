export default async function (req, res, next) {
  // Verifico se o usuário é o administrador para ter acesso a rota
  // o id = 1 foi reservado por mim para ser o master de sistema
  if (req.roleId !== 1) {
    return res.status(401).json({ error: 'unauthorized user' });
  }
  return next();
}

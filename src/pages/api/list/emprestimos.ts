import { obterConteudo } from '@/utils/banco';

export default function controlador(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ mensagem: 'Método não permitido.' });
  }

  const banco = obterConteudo();
  return res.status(200).json({ emprestimos: banco.emprestimos });
}
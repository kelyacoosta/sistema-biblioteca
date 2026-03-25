import { gerarNovoId, obterConteudo, gravarInformacoes } from "@/utils/banco";

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const { usuarioId, livrosIds, dataEmprestimo } = req.body;

  if (!usuarioId || !livrosIds || livrosIds.length === 0 || !dataEmprestimo) {
    return res.status(400).json({ mensagem: "Dados incompletos para o empréstimo." });
  }

  const dadosBanco = obterConteudo();


  for (const idLivro of livrosIds) {
    const livroFocado = dadosBanco.livros.find((l: any) => l.id === idLivro);

    if (!livroFocado) {
      return res.status(404).json({ mensagem: "Livro não encontrado." });
    }

    if (livroFocado.quantidade <= 0) {
      return res.status(400).json({ mensagem: `O livro ${livroFocado.titulo} está esgotado!` });
    }
  }


  for (const idLivro of livrosIds) {
    const indiceLivro = dadosBanco.livros.findIndex((l: any) => l.id === idLivro);

    dadosBanco.livros[indiceLivro].quantidade -= 1;
    dadosBanco.livros[indiceLivro].qtdEmprestados += 1;
  }


  const novoRegistro = {
    id: gerarNovoId(),
    usuarioId,
    livrosIds,
    dataEmprestimo,
    status: "ativo"
  };

  dadosBanco.emprestimos.push(novoRegistro);


  gravarInformacoes(dadosBanco);

  return res.status(201).json({
    mensagem: "Empréstimo realizado com sucesso!",
    emprestimo: novoRegistro
  });
}
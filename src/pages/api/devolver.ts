import { obterConteudo, gravarInformacoes } from "@/data/dataStore";

export default function tratadorDevolucao(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const { emprestimoId } = req.body;

  if (!emprestimoId) {
    return res.status(400).json({ mensagem: "ID do empréstimo não enviado." });
  }

  const bancoDados = obterConteudo();


  const indiceEmprestimo = bancoDados.emprestimos.findIndex((e: any) => e.id === emprestimoId);

  if (indiceEmprestimo === -1) {
    return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
  }

  const registroEmprestimo = bancoDados.emprestimos[indiceEmprestimo];

  if (registroEmprestimo.status === "concluído") {
    return res.status(400).json({ mensagem: "Este empréstimo já foi devolvido!" });
  }


  registroEmprestimo.livrosIds.forEach((idDoLivro: string) => {
    const livroNoBanco = bancoDados.livros.find((l: any) => l.id === idDoLivro);
    if (livroNoBanco) {
      livroNoBanco.quantidade += 1;
      livroNoBanco.qtdEmprestados -= 1;
    }
  });


  bancoDados.emprestimos[indiceEmprestimo].status = "concluído";
  bancoDados.emprestimos[indiceEmprestimo].dataDevolucao = new Date().toISOString();


  gravarInformacoes(bancoDados);

  return res.status(200).json({
    mensagem: "Livros devolvidos e estoque atualizado!",
    status: "concluído"
  });
}

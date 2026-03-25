import { gerarNovoId, obterConteudo, gravarInformacoes } from "@/utils/banco";

export default function controlador(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido." });
  }

  const entrada = req.body;
  const nomeObra = entrada.titulo;
  const categoria = entrada.genero;
  const escritor = entrada.autor;
  const estoque = entrada.quantidade;

  if (!nomeObra || !categoria || !escritor || !estoque) {
    return res.status(400).json({ mensagem: "Preencha as infomações do livro!" });
  }

  const valorNumerico = Number(estoque);
  if (valorNumerico <= 0) {
    return res.status(400).json({ mensagem: "A quantidade deve ser um número positivo." });
  }

  const db = obterConteudo();

  for (let indice = 0; indice < db.livros.length; indice++) {
    const itemLivro = db.livros[indice];
    if (itemLivro.titulo === nomeObra && itemLivro.autor === escritor) {
      return res
        .status(400)
        .json({ mensagem: "Já temos esse livro com esse autor." });
    }
  }

  const registroNovo = {
    id: gerarNovoId(),
    titulo: nomeObra,
    genero: categoria,
    autor: escritor,
    quantidade: valorNumerico,
    qtdEmprestados: 0,
  };

  db.livros.push(registroNovo);
  gravarInformacoes(db);

  return res.status(201).json({ mensagem: "Livro salvo!", livro: registroNovo });
}
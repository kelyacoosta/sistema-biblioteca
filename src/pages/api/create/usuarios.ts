import { gerarNovoId, obterConteudo, gravarInformacoes } from "@/data/dataStore";

export default function controlador(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido." });
  }

  const corpo = req.body;
  const nomeCompleto = corpo.nome;
  const email = corpo.email;
  const contatoTelefone = corpo.telefone;

  if (!nomeCompleto || !email || !contatoTelefone) {
    return res.status(400).json({ mensagem: "Preencha todas as informações do usuário!" });
  }

  const banco = obterConteudo();


  for (let i = 0; i < banco.usuarios.length; i++) {
    if (banco.usuarios[i].email === email) {
      return res
        .status(400)
        .json({ mensagem: "Esse email já está cadastrado." });
    }
  }

  const novo = {
    id: gerarNovoId(),
    nome: nomeCompleto,
    email: email,
    telefone: contatoTelefone,
  };

  banco.usuarios.push(novo);
  gravarInformacoes(banco);

  return res
    .status(201)
    .json({ mensagem: "Usuário cadastrado!", usuario: novo });
}

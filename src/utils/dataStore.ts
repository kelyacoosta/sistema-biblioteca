import fs from 'fs';
import path from 'path';

export type CadastroUsuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
};

export type ObraLivro = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  quantidade: number;
  qtdEmprestados: number;
};

export type RegistroEmprestimo = {
  id: string;
  usuarioId: string;
  livrosIds: string[];
  dataEmprestimo: string;
  dataDevolucao?: string;
  status: 'ativo' | 'concluído';
  livrosDevolvidos?: string[];
};

export type EstruturaDB = {
  usuarios: CadastroUsuario[];
  livros: ObraLivro[];
  emprestimos: RegistroEmprestimo[];
};

const localDoArquivo = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json');

export function obterConteudo() {
  const informacoesRaw = fs.readFileSync(localDoArquivo, 'utf-8');
  return JSON.parse(informacoesRaw);
}

export function gravarInformacoes(dadosParaSalvar: any) {
  const conteudoFormatado = JSON.stringify(dadosParaSalvar, null, 2);
  fs.writeFileSync(localDoArquivo, conteudoFormatado);
}

export function gerarNovoId() {
  return Math.random().toString(36).substring(2, 9);
}

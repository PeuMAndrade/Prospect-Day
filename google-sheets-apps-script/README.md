# Google Sheets + Apps Script

## Motivação

Criar uma dashboard integrada ao Google Sheets para a gamificação dos Prospect Days da CIMATECJR.

## Como funciona

Edite os campos da planilha e a dashboard será atualizada sozinha em tempo real.

O Apps Script publica os dados como JSON, e o front-end consome esse endpoint para montar o ranking, a progressão geral e o pódio.

## Link da planilha

Insira aqui o link da planilha principal:

`https://docs.google.com/spreadsheets/d/1i0I69W4u1eLAjeJtzh3qw0FQmxoo48NqRzepgyLu8OU/edit?gid=638260989#gid=638260989`


## Como rodar

1. Duplique a planilha.
2. Preencha os dados sem alterar os campos.
3. Vá em `Extensões > Apps Script`.
4. Cole o conteúdo de `Code.gs`.
5. Salve e implante como `Web app`.
6. Em `Executar como`, use `Você`.
7. Em `Quem tem acesso`, selecione `Qualquer pessoa` ou `Qualquer pessoa com o link`.
8. Copie a URL gerada no deploy e coloque em `.env`.
9. Instale as dependências com `npm install`.
10. Inicie o projeto com `npm run dev`.

## Tecnologias usadas

- React
- TypeScript
- Vite
- Apps Script
- Tailwind CSS
- Motion
- Lucide React

## Criador

Pedro Henrique Mascarenhas de Andrade
Qualquer dúvida, entre em contato no LinkedIn: https://www.linkedin.com/in/pedrohmandrade/
Gerente do Núcleo de Projetos de Computação de 26.1

## Configuração do app

Adicione a URL publicada ao arquivo `.env`:

`VITE_GOOGLE_SHEETS_JSON_URL="https://.../exec"`
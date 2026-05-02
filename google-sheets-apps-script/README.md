# Google Sheets + Apps Script

Use esta estrutura para alimentar o dashboard com dados do Google Sheets.

## Aba da planilha

Crie uma aba chamada `Dados` com estas colunas na primeira linha:

`id`, `nome`, `pontuacao`, `reunioes_marcadas`

Exemplo de linhas:

`1 | Ana Silva | 450 | 12`

`2 | Bruno Costa | 520 | 15`

## Apps Script

1. Abra a planilha.
2. Vá em `Extensões > Apps Script`.
3. Cole o conteúdo de `Code.gs`.
4. Salve e implante como `Web app`.
5. Em `Executar como`, use `Você`.
6. Em `Quem tem acesso`, selecione `Qualquer pessoa` ou `Qualquer pessoa com o link`.

O endpoint publicado vai responder com JSON e pode ser usado diretamente no app via `VITE_GOOGLE_SHEETS_JSON_URL`.

## URL no app

Adicione a URL publicada ao arquivo `.env.local`:

`VITE_GOOGLE_SHEETS_JSON_URL="https://.../exec"`
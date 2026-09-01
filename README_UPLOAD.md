# Wu Xing Atom — pacote mínimo de deploy

Este pacote foi preparado para contornar o limite de 100 arquivos do upload web do GitHub.

Faça upload destes arquivos diretamente na raiz do repositório. O arquivo `src.tar.gz` contém o código-fonte completo do aplicativo e será extraído automaticamente no build da Vercel pelo script `npm run build`.

Arquivos necessários:
- index.html
- package.json
- src.tar.gz
- tsconfig.json
- vercel.json
- vite.config.ts

Depois do commit no GitHub, importe o repositório na Vercel. A configuração já aponta o build para `npm run build` e a saída para `dist`.

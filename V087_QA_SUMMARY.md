# v0.87 QA — resumo

## Resultado desta rodada
- 12/12 gates herdados da revisão v0.86 continuam passando.
- 20/20 novos gates do workspace longitudinal passam.
- 198 arquivos TypeScript/TSX passaram por transpilação sintática sem erro.
- Modelo longitudinal testado com 10 sessões sequenciais.
- Troca para modo paciente limpa a ficha profissional ativa.
- Códigos de pontos são normalizados e deduplicados.
- Lista sintética de 5.000 pacientes filtrou em menos de 1 ms no teste de modelo local; a UI ainda limita o render aos primeiros 40 resultados.

## Correção conceitual importante
O módulo clínico profissional não usa a lista de acupressão destinada ao paciente como plano de acupuntura.

Foi criado um kernel separado de pontos-base profissionais. Nesta etapa ele contém apenas os núcleos de padrões já verificados na extração do livro. Um padrão sem núcleo profissional verificado simplesmente não recebe sugestão automática.

## Persistência
Por padrão a v0.87 não grava nomes/notas no navegador. O repositório é em memória.

Existe um modo de demonstração explícito com `?demoStorage=1`, mas ele é marcado no código como impróprio para dados clínicos reais.

## O que ainda falta antes de vender
A próxima fronteira não é acrescentar mais botões. É conectar este domínio a uma camada online real com autenticação, isolamento por profissional/organização, permissões de estudante/paciente, persistência segura, auditoria e testes de concorrência. A estrutura SQL de referência já acompanha o pacote.

# Wu Xing v0.90 — Coexistence-First Clinical Model

## Correção conceitual principal

A arquitetura foi alterada para refletir uma regra mais adequada ao raciocínio da Medicina Chinesa:

**padrões com nomes aparentemente opostos não são automaticamente excludentes.**

O motor parte dos sintomas de cada padrão. Se há sinais suficientes para dois padrões, os dois permanecem ativos.

## Rim: Yin + Yang

Foi criada uma relação explícita de coexistência:

`kidney_yin + kidney_yang → Deficiência de Yin e Yang do Rim`

O sistema preserva simultaneamente:
- sinais de perda de substância/nutrição/Essência;
- sinais de perda de função, aquecimento, transformação e contenção.

O motor já possuía o padrão composto `kidney_yin_yang`; a v0.90 agora liga corretamente os componentes independentes a essa leitura composta em vez de tratá-los como uma colisão a ser resolvida.

## Fígado: raiz + manifestação

Foram criadas relações explícitas:

- `liver_yin + liver_yang_rising`
- `liver_blood + liver_yang_rising`
- `kidney_yin + liver_yang_rising`
- combinação ampliada de Yin de Fígado/Rim + Ascensão do Yang do Fígado.

A Ascensão do Yang passa a ser interpretável como manifestação que pode coexistir com uma raiz de deficiência, sem apagar nenhum dos componentes.

## O que mudou no algoritmo

A antiga ideia de `DiagnosticTension` foi substituída por `PatternRelationship`.

Três tipos:
- `coexisting`
- `root_branch`
- `differential`

As relações podem:
- explicar a combinação;
- priorizar perguntas;
- caracterizar melhor cada componente;
- formar diagnósticos compostos.

Elas não podem:
- zerar outro padrão;
- subtrair escore por oposição nominal;
- bloquear o resultado por coexistência;
- obrigar o aplicativo a escolher apenas um padrão.

O bloqueio de resultado permanece reservado ao SafetyGate e à insuficiência geral de dados.

## UX

A interface deixou de usar a lógica “A ou B” como regra geral.

Quando dois padrões aparecem, a linguagem agora é:
**“Mais de um padrão pode estar presente.”**

Para relações de raiz/ramo, o painel explica os dois componentes em conjunto. Perguntas adicionais servem para entender **quanto cada componente participa do quadro**, e não para necessariamente eliminar um deles.

## Novos sintomas observáveis adicionados

Para enriquecer a avaliação de estrutura/função do Rim:
- embranquecimento capilar precoce/progressivo;
- redução importante da função sexual/dificuldade de ereção;
- alteração persistente da micção.

Esses itens entram como sinais de apoio, nunca como marcadores isolados exclusivos.

## Testes

### Direcionados
**5/5 passaram.**

Incluem:
- Yin + Yang do Rim coexistindo;
- Yin do Fígado + Ascensão do Yang;
- Sangue do Fígado + Ascensão do Yang;
- coexistência do Rim sobrevivendo ao motor ponta a ponta;
- relação raiz/ramo do Fígado sobrevivendo ao motor ponta a ponta.

### Fuzzing
**50.000 combinações aleatórias** foram processadas.

- sintomas registrados: **219**
- IDs únicos: **219**
- falhas de invariantes: **0**
- relações de coexistência observadas: **11.920**
- relações raiz/ramo observadas: **19.969**
- diferenciais observados: **8.216**
- resultados prontos contendo coexistência Yin+Yang do Rim: **2.504**

Isto confirma especificamente que a coexistência não está mais funcionando como trava de resultado.

### TypeScript
Projeto completo no preflight atual:
`tsc --noEmit --noImplicitAny false` → **PASS**

## Próxima linha de revisão

A partir daqui a matriz de coerência deve crescer com outra pergunta:

**“Esses dois padrões se excluem, coexistem, ou um pode ser raiz/ramo do outro?”**

Por padrão, o algoritmo deve favorecer a preservação da evidência sintomática. Exclusão só deve ser codificada quando houver justificativa clínica explícita e suficientemente forte.

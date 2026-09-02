# Wu Xing v0.89 — Coherence & Historical Replay

## O que esta rodada fez
Esta etapa foi orientada a coerência e quebra controlada do sistema, não a adicionar enfeites.

### 1. Matriz de tensões diagnósticas
O motor agora identifica hipóteses tradicionais concorrentes que merecem diferenciação adicional, sem assumir que sejam "impossíveis" de coexistir.

Primeiros pares auditados:
- Deficiência de Yin do Rim ↔ Deficiência de Yang do Rim
- Deficiência de Yin do Baço ↔ Deficiência de Yang do Baço
- Fogo do Estômago ↔ Frio invadindo o Estômago
- Vento-Calor do Pulmão ↔ Vento-Frio do Pulmão
- Fleuma-Calor do Pulmão ↔ Fleuma-Frio do Pulmão
- Calor do Intestino Grosso ↔ Frio do Intestino Grosso
- Fogo do Coração ↔ Deficiência de Yang do Coração

Quando duas hipóteses fortes ficam muito próximas:
1. ambas permanecem abertas;
2. perguntas discriminantes são priorizadas;
3. uma tensão forte ainda não esclarecida impede um resultado consolidado;
4. depois que as perguntas discriminantes foram respondidas, a tensão continua auditável, mas não bloqueia automaticamente a leitura.

### 2. Replay longitudinal real
O profissional/estudante agora pode tocar numa sessão antiga e carregar exatamente o snapshot daquela consulta no mesmo motor e no mesmo 3D.

O histórico é somente leitura. Enquanto uma sessão antiga estiver aberta:
- o caderno de nova sessão fica bloqueado;
- não se cria uma segunda cena WebGL;
- existe um comando direto para voltar ao mapa atual;
- a sessão histórica precisa pertencer ao paciente ativo.

### 3. Bugs encontrados e corrigidos

**ID não canônico em pergunta discriminante**
O diferencial do Pulmão chegou a pedir `yellow_mucus`, mas o registro real usa `yellow_phlegm`. Isso gerava perguntas inexistentes nos testes aleatórios. Corrigido.

**Guard de afta se validava sozinho**
O teste que deveria impedir que uma afta isolada sustentasse Fogo do Coração contava a própria afta dentro do cluster de contexto. Corrigido para exigir co-sinais independentes.

**Auditoria de segurança atrasada**
O SafetyGate principal já reconhecia alguns novos alertas leigos, mas o guard secundário ainda usava apenas IDs antigos. Corrigido.

## Testes executáveis

### Testes direcionados
- Passaram: **5/5**
- Integridade de replay: 25 pacientes × 12 sessões = 300 sessões preservadas corretamente.
- Replay cruzado entre pacientes: bloqueado.

### Fuzzing clínico
- Execuções aleatórias: **30000**
- Falhas de invariantes: **0**
- Tensões diagnósticas observadas: **4736**
- Tensões fortes observadas: **975**
- IDs de próximas perguntas inválidos após correções: **0**
- Discriminadores de tensão inválidos após correções: **0**

O fuzzing usa combinações propositalmente absurdas e improváveis; o objetivo é forçar colisões e verificar invariantes, não estimar prevalência clínica.

### Compilação / auditoria
- Projeto completo: `tsc --noEmit --noImplicitAny false` → PASS.
- Os 31/31 gates estruturais da v0.88 continuam passando.

## Estado atual
O fluxo longitudinal está mais amarrado:
`paciente → sessão atual → sintomas → mapa 3D → desequilíbrios → pontos profissionais verificados → pontos utilizados → nota → salvar → linha do tempo → reabrir sessão antiga → voltar ao atual`.

Ainda não considero produção pronta até haver:
- runtime real em Safari/iPhone via HTTPS;
- autenticação e isolamento de dados por usuário/organização;
- persistência segura;
- concorrência multiusuário;
- regressão de toda a base clínica por condição.

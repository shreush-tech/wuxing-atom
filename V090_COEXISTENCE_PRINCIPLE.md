# v0.90 — Princípio de coexistência dos padrões

## Regra central
O motor não deve interpretar nomes aparentemente opostos como exclusões automáticas.

Cada padrão nasce do seu próprio conjunto de sinais e sintomas. Se dois conjuntos estão sustentados, os dois padrões permanecem ativos.

### Exemplo: Rim
Um paciente pode apresentar simultaneamente:
- sinais de insuficiência de Yin/Essência/substância;
- sinais de insuficiência de Yang/Qi/função.

Isso é particularmente plausível em quadros crônicos/debilitados. O modelo passa a representar explicitamente `kidney_yin + kidney_yang` e pode sintetizar a combinação `Deficiência de Yin e Yang do Rim` sem apagar os dois componentes.

### Exemplo: Fígado
Ascensão do Yang do Fígado pode coexistir com uma raiz de deficiência:
- Deficiência de Yin do Fígado;
- Deficiência de Sangue do Fígado;
- Deficiência de Yin de Fígado/Rim.

Portanto o app registra separadamente a raiz e a manifestação ascendente.

## Consequência computacional
Relações entre padrões agora servem para:
1. explicar coexistência;
2. reconhecer raiz/ramo;
3. ordenar perguntas que caracterizam melhor cada componente;
4. construir combinações clínicas.

Elas **não**:
- subtraem automaticamente escore;
- bloqueiam o resultado por aparente oposição;
- obrigam o sistema a escolher apenas um padrão;
- transformam Yin e Yang em categorias mutuamente exclusivas.

Somente o SafetyGate pode bloquear a entrega do mapa por motivo de segurança.

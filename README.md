1
- Problema: Validação de titulo e reset de erros repetidos em multiplas funções.
- Solução: Criada a função 'validateTaskData'.
- Por que é melhor: Centraliza a logica de negocio e facilita a manutenção do código.

2
- Problema: Repetição de blocos fetch e tratamento manual de JSON/Status OK
- Solução: Implementada a função apiRequest centralizada
- Por que é melhor: Reduz o código repetitivo e padroniza o tratamento de erros da API

3
- Problema: As funções eram recriadas em todo render, afetando a performance
- Solução: Todas as funções foram envolvidas em useCallback
- Por que é melhor: Evita re-renderizações desnecessárias em componentes filhos e otimiza a memória

4
- Problema: O app recarregava a lista inteira do servidor após qualquer pequena alteração
- Solução: O estado local é atualizado imediatamente com lógica de reversão em caso de erro
- Por que é melhor: A interface responde instantaneamente ao usuário, melhorando drasticamente a UX

5
- Problema: O hook misturava lógica de estado com detalhes técnicos de rede
- Solução: A lógica de comunicação (Service) foi isolada da lógica de estado (Hook)
- Por que é melhor: Facilita testes e permite trocar a biblioteca de API sem quebrar o funcionamento do hook
# Logger Builder Router System - OOAD POC

## Arquitetura e Padrões

1. **Strategy Pattern:** Transports (Sync/Async) partilham o mesmo contrato, permitindo trocar o comportamento de execução sem alterar o Logger.
2. **Composite Pattern:** O Router propaga logs para múltiplos destinos de forma transparente.
3. **Builder Pattern:** Fluent API para configuração desacoplada.
4. **Driver Abstraction:** Drivers de baixo nível (FS, ELK) não sabem nada sobre o tempo de execução (Sync/Async).

## Extras

1. **Single Responsibility Principle:** A separação entre Drivers (IO puro) e Transports (Estratégia de execução) foi feita para respeitar o SRP.
2. **Strategy Pattern:** O LoggerRouter não sabe se está enviando o dado de forma assíncrona ou síncrona; ele apenas chama o método deliver(). Isso desacopla a regra de execução da lógica de negócio.
3. **Composite Pattern:** O LoggerRouter atua como um composite que trata uma coleção de transportes como se fossem um único objeto. Ao chamar .log(), o router propaga a mensagem para todos os componentes da árvore de destinos.
4. **Dependency Inversion Principle:** Seus Transports dependem de uma interface/abstração de Driver, e não diretamente de implementações como FSDriver ou ELKDriver, permite adicionar outro sistema de logger sem tocar no AsyncTransport.
5. **Builder Pattern:** O LoggerBuilder permite configurar o sistema de forma fluida (Fluent API), escondendo a complexidade de instanciar e encadear drivers e transportes manualmente.
6. **Observer Pattern:** Emito um evento de log, e diferentes Subscribers(transports) reagem a esse evento.
7. **Liskov Substitution Principle:** AsyncTransport deve se comportar exatamente como o SyncTransport do ponto de vista do cliente. Se o modo Async falhar de um jeito que o Sync não falharia, podemos estar violando o contrato esperado pelo sistema.

## Node.js Internals

- **Event Loop:** O `AsyncTransport` utiliza `setImmediate` para libertar a Main Thread, garantindo que o processamento de logs não bloqueie a aplicação.
- **Buffer Management:** Implementação de limite de memória no array de mensagens.
- **Graceful Shutdown:** Captura de `SIGINT/SIGTERM` para garantir que o buffer é despejado (flush) antes do processo morrer.

<<<<<<< Updated upstream
# Projeto Backend
## Tecnologias Utilizadas

- **DDD (Domain-Driven Design)**: Para uma arquitetura orientada ao domínio.
- **TypeScript**: Para um desenvolvimento mais robusto e tipado.
- **Fastify**: Framework web HTTP.
- **Streams**: Para manipulação contínua de fluxos de dados.
- **PostgreSQL**: Persistência de dados.
- **Drizzle**: ORM utilizado para fazer migrações e inserções.
- **Event-Driven Pub/Sub**: Para comunicação assíncrona entre comandos.
- **Docker**: Criação do projeto em containers, facilitando a disponibilidade em diferentes ambientes.
- **Zod**: Validação de dados, usado para DTOs.
- **RxJs**: Enfileiramento assincrono e stream pipes.
- **Vitest**: Testes.
- **TSUP**: Compilação.
- **PNPM**: Gerenciador de pacotes.

## Instalação e Configuração

Para instalar e configurar o projeto, sigo os passos abaixo:

1. Crio um arquivo `.env` na raiz do projeto e adiciono as variáveis de ambiente conforme o modelo descrito no arquivo `.env.example` também disponível na raiz do projeto.
2. Instalo as dependências do projeto: `pnpm i`
3. Realizo as migrações no meu banco PostgreSQL: `pnpm db:migrate`
4. Inicio uma instância do projeto: `pnpm dev`

Para builds:
1. Compilo o código TypeScript: `pnpm build`
2. Inicializo a aplicação: `pnpm start` ou em múltiplos clusters `pnpm start:clusters`, que permite que a mesma aplicação seja balanceada em 5 clusters (editável), proporcionando fluidez e maior performance.

## Relatório de Caso

Neste relatório, os dados apresentados são baseados em um arquivo base de aproximadamente 100MB (CSV) que possui uma média de 1 milhão de linhas.

Desenvolvi a aplicação considerando os seguintes pontos principais:
- Fornecer uma API HTTP para comunicação com algum cliente.
- Resiliência para casos de erros inesperados.
- Streaming de dados para manuseio e ações sob demanda.
- Enfileiramento de tarefas para manter um fluxo contínuo de processamento sem perder conexões.

Inicialmente, desenvolvi o projeto utilizando `bun` como stack primária para toda a aplicação, visando atender quase todos os pontos necessários para o sucesso e com um menor bundle.

Entretanto, para que o projeto seja escalável, há a necessidade de usar mais processos do que um ambiente de desenvolvimento permite. Essa stack ainda não permite interação com clusters. Logo, a estratégia de balanceamento de processos com PM2 não ocorre como esperado, e assim voltei ao convencional NPM, porém com um instalador de pacotes mais eficiente (PNPM).

A estratégia de streaming me permite processar linha por linha do arquivo CSV, inserindo os dados no banco e executando os próximos comandos (gerar invoice e enviar email).

Se a inserção dos dados fosse feita linha por linha, a primeira fase levaria horas para ser completada. Por isso, optei pelo PostgreSQL, que permite inserções múltiplas de dados. Para otimizar todo o processamento, usei a biblioteca `rxjs`, que melhora o processo de `pipe` com auxílio de `asyncSchedulers`, realizando uma única inserção após 1000 ou mais linhas processadas.

As outras fases de processamento (invoice, email) são ativadas através de uma estratégia de orquestração orientada a eventos (Pub/Sub). Essas tarefas podem demorar até 10 segundos para gerar um novo arquivo e processar a próxima fase. Neste projeto, usei as bibliotecas `pubsub-js` e `rxjs/asyncSchedulers`, que nos dão uma ideia de como o fluxo funciona, mas para fins práticos devem ser substituídas por tecnologias mais robustas e eficientes de Message Queueing (Kafka, RabbitMQ, Redis, Pulsar, entre outras), o que também poupa muita memória da aplicação (que atualmente oscila entre 50MB a 1.5GB de memória).

Como o objetivo do projeto é demonstrar o processamento do arquivo e o tempo limite, as etapas de criação de invoice e envio de email foram simuladas com operações que são finalizadas em maior tempo (5s). A implementação desses comandos pode ser concluída com integração a SMTPs e algum serviço de produção de PDFs, como o próprio [pdf-js](https://mozilla.github.io/pdf.js/) ou usando [selenium](https://www.selenium.dev/), [puppeteer](https://github.com/puppeteer/puppeteer/tree/main) ou outra tecnologia que utilize webdrivers.

### Possíveis Próximas Decisões

Para essa aplicação, minha recomendação é continuar com as orquestrações de eventos, usando serviços apropriados para resiliência já citados. A parte de criação de boletos seria um micro-serviço que seguiria o seguinte fluxo:

1. Se inscrever em um tópico de "cobrança registrada".
2. Entrar em contato com provedores bancários, produzir um PDF a partir desses dados e das respostas dos provedores.
3. Salvar o PDF em buckets, criar um evento de "invoice gerado" enviando as informações relacionadas ao bucket e à cobrança e salvar os dados no banco.

Voltando para a aplicação atual, ela baixaria esse PDF, enviaria o email e excluiria o arquivo do bucket após o envio ser confirmado, ou utilizaria uma estratégia de TTL para excluir os arquivos do bucket.

Outra decisão mais apropriada para esse serviço seria o uso de Buckets já nessa fase, com o upload de arquivos sendo feito diretamente nos serviços de armazenamento AWS, Cloudflare ou outros, utilizando estratégias de [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html) e usando os eventos de inserção de objetos nos buckets para executar todas as etapas de processamento deste projeto.


## Testes
Cada arquivo foi testado utilizando vitest.


<img width="431" alt="Captura de Tela 2024-06-16 às 20 14 44" src="https://github.com/alysonvilela/app-csv/assets/22202745/fea4ed51-87bb-4689-8fc2-ee5b92304bf8">
=======
## TODO

- Architecture flow
- Explain streaming basics
- Explain the use of PUB/SUBS (would change for kafka/redis or another message broker service)
- Testing with vitest
- Docker and docker compose
- Explain why I started the project with Bun and ended up with PNPM/NPM (clusters and upscaling with PM2)
- Possible architecture changings: Buckets, Message brokers
- Services/project next steps: Insert validation (we are still passing through if the PK/unique key exists), Status field and update on demand, Better IOC configuration(typescript-ioc/tsyringe/inversify), When there is a bucket service might be good creating new services/jobs to remove unused files/
- Swagger
>>>>>>> Stashed changes

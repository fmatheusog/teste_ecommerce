# Desafio Técnico

## Instruções

1. Clonar o repositório
2. Alterar a connection string no arquivo appsettings.Development.json para a sua configuração do SQL Server ou rodar o arquivo docker-compose.yml que está na raiz do projeto
3. Rode as migrations com o comando

```bash
dotnet ef database update
```

### Back-end

1. Rode a API executando o projeto Teste.API pelo Visual Studio ou pelo comando

```bash
dotnet run
```

### Front-end

1. Rode o projeto web na pasta Teste.Web com os comandos

```bash
cd Teste.Web
npm install
npm run dev
```

Acesse a aplicação em `http://localhost:5173`

## Web: Implementações e tecnologias utilizadas

As tecnologias utilizadas foram:

- React
- Vite
- Typescript
- Tailwind
- Shadcn (para componentes), o motivo da escolha dessa biblioteca e não do Chakra UI foi agilidade por eu estar mais acostumado com essa biblioteca no dia-a-dia.
- Axios, para realizar requisições HTTP
- React Query para gerenciar as requisições para a API e utilizar cache
- React Hook Form e Zod para gerenciamento e validações de formulários
- React-mask para utilizar máscara nos inputs
- Moment para manusear datas
- Zustand para gerenciamento de estado global

As implementações realizadas foram:

- Listagem de todos os pedidos
- Detalhes de pedido
- Edição de pedido (data, cliente e itens)
- Criação/processamento de pedido
- Listagem de lista de reprocessamento

## API: Implementações e tecnologias utilizadas

As tecnologias utilizadas foram:

- .NET 8
- Entity Framework Core
- SQL Server
- Polly
- Swagger

As implementações realizadas foram:

- Listagem de pedidos
- Listagem de pedido por id
- Listagem da fila de reprocessamento
- Edição de cliente do pedido
- Edição de item do pedido
- Edição de data do pedido
- Processamento de pedido
- Simulação de processamento com falha
- Fila de reprocessamento
- Arquitetura em camadas (API, Application, Infrastructure e Shared)
- Retry e timeout com Polly
- Banco de dados em um container Docker

## Possíveis melhorias futuras

- Paginação e filtros nas listagens
- Implementar o Docker na API e na aplicação Web também
- CI/CD
- Testes unitários
- Definir uma abordagem melhor para lidar com falhas no processamento de pedidos

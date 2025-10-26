# Personal Calendar

Aplicação de gerenciamento de tarefas desenvolvida com Angular e NgRx, permitindo criar, editar, visualizar e excluir tarefas com filtros avançados.

## Tecnologias Utilizadas

### Frontend
- **Angular 20**
- **Angular Material**
- **TypeScript**
- **RxJS**

### Gerenciamento de Estado
- **NgRx Store** - Gerenciamento de estado
- **NgRx Effects** - Efeitos colaterais
- **NgRx Entity** - Gerenciamento de entidades

### Backend Simulado
- **Angular In-Memory Web API** - API REST simulada em memória

### Testes
- **Karma** - Test runner
- **Jasmine** - Framework de testes

### Outras Ferramentas
- **UUID** - Geração de IDs únicos
- **RxJS Operators** - Operadores para manipulação de streams

## Funcionalidades

- Criar tarefas com título, descrição, data e status
- Editar tarefas existentes
- Excluir tarefas
- Visualizar lista de tarefas em tabela paginada
- Filtrar por texto de busca
- Filtrar por status (Pendente, Em andamento, Concluída)
- Filtrar por intervalo de datas
- Tradução de status para português
- Interface responsiva com Angular Material

## Pré-requisitos

- Angular CLI: versão 20.3.6 ou superior

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/filipinunes/personal-calendar.git
```

2. Entre no diretório do projeto:

```bash
cd personal-calendar
```

3. Instale as dependências:

```bash
npm install
```

## Executando o Projeto

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
ng serve
```

Ou simplesmente:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200/`.

## Executando os Testes

### Testes Unitários

Para executar os testes unitários com Karma:

```bash
ng test
```

Ou:

```bash
npm test
```

### Verificar Cobertura de Testes

Para gerar o relatório de cobertura de testes:

```bash
ng test --code-coverage
```

O relatório será gerado no diretório `coverage/`.

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── in-memory-data.service.ts    # Dados mockados
│   ├── shared/
│   │   └── pipes/
│   │       └── status-pipe.ts               # Pipe de tradução de status
│   ├── tasks/
│   │   ├── components/
│   │   │   └── task-form-dialog/           # Dialog de formulário
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   └── task.model.ts           # Model de Task
│   │   │   └── services/
│   │   │       ├── tasks.service.ts        # Service da API
│   │   │       └── tasks-api.interface.ts  # Interface da API
│   │   ├── store/
│   │   │   ├── tasks.actions.ts            # Actions do NgRx
│   │   │   ├── tasks.effects.ts            # Effects do NgRx
│   │   │   ├── tasks.reducer.ts            # Reducer do NgRx
│   │   │   └── tasks.selectors.ts          # Selectors do NgRx
│   │   ├── tasks.ts                        # Componente principal
│   │   ├── tasks.html                      # Template
│   │   └── tasks.css                       # Estilos
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
└── main.ts
```

## Como Usar

1. **Adicionar uma tarefa**: Clique no botão "Nova Tarefa" e preencha o formulário
2. **Editar uma tarefa**: Clique no ícone de edição na linha da tarefa
3. **Excluir uma tarefa**: Clique no ícone de lixeira na linha da tarefa
4. **Filtrar tarefas**:
   - Digite no campo de busca para filtrar por título
   - Selecione um ou mais status no dropdown
   - Escolha um intervalo de datas no seletor de datas
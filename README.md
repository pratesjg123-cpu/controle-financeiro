# Controle Financeiro Pessoal

Aplicativo web simples, estilo planilha, para controlar suas finanças mensais.
Feito com React + Vite + Tailwind CSS. Todos os dados ficam salvos no **localStorage do seu navegador** — nada é enviado para nenhum servidor.

## Como rodar o projeto

Pré-requisito: ter o [Node.js](https://nodejs.org) instalado (versão 18 ou superior).

1. Abra um terminal na pasta do projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`) no navegador.

Pronto — o app está rodando localmente na sua máquina. Pode fechar e abrir o terminal novamente sempre que quiser usar; seus dados continuam salvos no navegador (mesmo navegador/mesmo computador).

### Gerar uma versão de produção (opcional)

Se quiser hospedar o app em algum lugar (Vercel, Netlify, etc.) ou apenas gerar arquivos estáticos:

```bash
npm run build
```

Isso cria uma pasta `dist/` com os arquivos prontos para publicar em qualquer serviço de hospedagem estática.

## Estrutura de arquivos

```
controle-financeiro/
├── index.html                     Página HTML principal (com meta tags para iPhone)
├── package.json                   Dependências e scripts do projeto
├── vite.config.js                 Configuração do Vite
├── tailwind.config.js             Configuração do Tailwind CSS
├── postcss.config.js              Configuração do PostCSS
├── public/
│   ├── manifest.json               Permite "Adicionar à Tela de Início" no iPhone
│   ├── apple-touch-icon.png        Ícone usado na tela de início do iPhone
│   ├── icon-192.png / icon-512.png Ícones do manifest (PWA)
│   └── favicon-32.png              Ícone da aba do navegador
├── src/
│   ├── main.jsx                   Ponto de entrada do React
│   ├── App.jsx                    Componente principal: estado, cálculos e layout
│   ├── index.css                  Estilos globais (Tailwind + ajustes de safe-area do iPhone)
│   ├── constants.js                Categorias, formas de pagamento, status, cores
│   ├── utils.js                    Funções utilitárias (moeda, datas, mês, CSV)
│   ├── storage.js                  Leitura/gravação no localStorage
│   └── components/
│       ├── Header.jsx              Topo: título, seletor de mês, botões adicionar
│       ├── MobileFab.jsx           Botão flutuante (+) para adicionar no celular
│       ├── AlertBanner.jsx         Aviso quando gastos passam de 80% da renda
│       ├── SummaryCards.jsx        Cards de resumo (receita, despesa, saldo etc.)
│       ├── CategoryBreakdown.jsx   Gasto por categoria + limites definidos por você
│       ├── FixedExpenses.jsx       Lista de gastos fixos com status pago/não pago
│       ├── ReserveSection.jsx      Meta de reserva, valor reservado, % concluído
│       ├── TransactionsTable.jsx   Cards no celular / tabela completa no computador, com filtros
│       ├── TransactionModal.jsx    Formulário de novo lançamento / edição
│       └── ActionsBar.jsx          Botões: exportar CSV, limpar mês, duplicar fixos
```

## Funcionalidades incluídas

- **Dashboard mensal**: navegue entre meses (setas ◀ ▶), cada mês guarda seus próprios lançamentos.
- **Receitas e despesas**: cadastro com nome, valor, data, categoria; despesas também têm forma de pagamento, status e observação.
- **10 categorias de despesa**: Gastos fixos, Mercado, Transporte, Lazer, Cartão de crédito, Parcelamentos, Academia/Saúde, Reserva, Investimentos, Outros.
- **Cálculo automático**: total de receitas, despesas, saldo, gasto por categoria e % da renda comprometida — tudo atualiza sozinho a cada lançamento.
- **Gastos fixos**: área separada com checkbox pago/não pago e total automático. Botão para copiar os fixos do mês anterior ou duplicar os do mês atual para o próximo.
- **Reserva financeira**: defina uma meta mensal e acompanhe quanto já foi reservado, quanto falta e o percentual concluído.
- **Tabela estilo planilha**: todos os lançamentos com filtro por tipo, categoria e status, e ações de editar/excluir.
- **Limites por categoria**: defina um limite mensal para cada categoria de gasto e veja um alerta quando ultrapassar.
- **Aviso de 80%**: banner de alerta quando os gastos do mês atingem 80% (amarelo) ou 100%+ (vermelho) da renda.
- **Exportar CSV**: baixa todos os lançamentos do mês em um arquivo `.csv` (abre direto no Excel/Google Sheets).
- **Limpar mês**: apaga todos os lançamentos do mês atual (com confirmação).

## Otimizado para iPhone / Safari (mobile-first)

O app foi ajustado especificamente para uso no navegador Safari do iPhone:

- **"Adicionar à Tela de Início"**: abra o app no Safari, toque no botão de compartilhar (o quadrado com seta para cima) e escolha **Adicionar à Tela de Início**. Ele abre em tela cheia, sem a barra de endereço, como um app de verdade.
- **Respeita o notch / Dynamic Island / barra inferior**: o cabeçalho e os botões flutuantes não ficam escondidos atrás dessas áreas.
- **Teclado numérico automático**: campos de valor abrem o teclado numérico do iPhone em vez do teclado completo.
- **Sem zoom indesejado**: campos de formulário não fazem a tela "pular" o zoom ao tocar (comportamento comum do Safari quando o texto é pequeno).
- **Botão flutuante (+)**: no celular, um botão flutuante no canto inferior direito permite adicionar receita ou gasto com o polegar, sem precisar rolar até o topo.
- **Lista em cards no celular**: a tabela de lançamentos vira uma lista de cards fácil de ler no celular; em telas maiores (tablet/computador) continua como tabela completa estilo planilha.
- **Área de toque adequada**: botões de editar/excluir têm pelo menos 44x44px, conforme recomendação da Apple, para facilitar o toque.

Tudo isso funciona também perfeitamente no computador — o layout se adapta automaticamente ao tamanho da tela.

## Ícones do app

Os ícones usados na tela de início (`public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/favicon-32.png`) já vêm prontos no projeto. Para trocá-los, basta substituir esses arquivos por outros PNG do mesmo tamanho.

## Sobre os dados


Os dados ficam salvos apenas no `localStorage` do navegador em que você usar o app. Isso significa:

- Não é preciso login nem internet depois de instalado.
- Se você limpar o cache/dados do navegador, os lançamentos serão perdidos — use o botão **Exportar CSV** de vez em quando como backup.
- Os dados não sincronizam automaticamente entre navegadores ou dispositivos diferentes.

## Personalização rápida

- **Categorias**: edite as listas em `src/constants.js` (`EXPENSE_CATEGORIES` e `INCOME_CATEGORIES`).
- **Formas de pagamento**: edite `PAYMENT_METHODS` em `src/constants.js`.
- **Cores por categoria**: edite `CATEGORY_COLORS` em `src/constants.js`.

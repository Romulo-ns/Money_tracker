# 💰 Money Tracker - Lembrete de Horas Extras e Ganhos

Um aplicativo financeiro pensado para freelancers, funcionários e trabalhadores ad-hoc anotarem rapidamente as suas horas extra e saberem exatamente quanto vão receber no fim do mês!

Tudo com um visual _Gamificado_, Neumórfico (Glassmorphism) focado na experiência do usuário e animações imersivas.

## ✨ Funcionalidades Principais

* **💼 Múltiplas Empresas/Clientes:** Cadastre várias "Empresas" com valores-hora diferentes, definindo um valor fixo de desconto (ex: custo de deslocamento/plano) e taxa percentual de desconto (retido na fonte).
* **⚡ Lançamento Rápido:** Adicione quantas horas trabalhou num dia, e o app calcula automaticamente quanto deve receber após aplicar as fórmulas daquela empresa.
* **🏆 Metas & Gamificação:** Possui uma barra de progresso lúdica para acompanhar a sua meta de ganhos do mês (Neon glow e Confirmações visuais).
* **📅 Fechamento de Mês Inteligente:** Ao virar o mês, as metas zeram e o sistema avisa na página principal quais as pendências do "mês passado" a aguardar pagamento. Com um clique em "Recebeu?", você dá baixa no sistema. 

## 🛠 Tecnologias Utilizadas

Este projeto foi construído usando o estado da arte do ecossistema React:

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com estilos Vanilla estáticos e Glassmorphism.
* **Banco de Dados (ORM):** [Prisma 7](https://www.prisma.io/) adaptado com conectividade direta ao [`@libsql/client`](https://docs.turso.tech/libsql) (SQLite super-veloz embarcado localmente na máquina).
* **Autenticação:** [Auth.js / NextAuth (Credentials)](https://authjs.dev/) garantindo login seguro de usuários (senhas criptografadas com `bcryptjs`).
* **Ícones:** [Lucide React](https://lucide.dev/)

---

## 🚀 Como Iniciar o Projeto Localmente

Por usar a stack local do SQLite, o projeto é incrivelmente simples de rodar e não exige chaves de conexão externas. O arquivo de banco se cria sozinho!

### 1. Requisitos
- Node.js (v18 ou superior recomendado).
- NPM instalado.

### 2. Instalação Dependencies
```bash
npm install
```
*(Certifique-se de que o `@libsql/client` e `@prisma/adapter-libsql` estão instalados)*

### 3. Sincronizando o Banco de Dados (SQLite)
Rode os comandos abaixo e o Prisma vai criar a estrutura na raiz baseada em `schema.prisma`.
```bash
npx prisma generate
npx prisma db push
```

### 4. Executando o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) com o seu browser. O ecrã de Autenticação/Registrar será apresentado e já pode iniciar o uso.

---

### Licença
Este aplicativo foi feito sob medida para otimizar os seus lembretes e rendimentos! Bom trabalho!

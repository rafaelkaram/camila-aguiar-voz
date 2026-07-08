# Avaliação de Saúde Vocal — Camila Aguiar Fonoaudióloga

Sistema de autoavaliação vocal para profissionais de comunicação, com dashboard analítico privado para a fonoaudióloga.

---

## Pré-requisitos

- Node.js 18+
- Conta gratuita no [Supabase](https://supabase.com)
- Conta na [Vercel](https://vercel.com) (deploy)

---

## 1. Setup do Supabase

1. Crie um projeto em [app.supabase.com](https://app.supabase.com)
2. No SQL Editor, execute o conteúdo de **`schema.sql`** (raiz do projeto)
3. Anote as chaves em **Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ nunca expor no frontend
4. Crie a conta da fonoaudióloga em **Authentication > Users > Add user**

---

## 2. Setup local

```bash
# Clone / acesse o diretório
cd camila-aguiar-voz

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves do Supabase e link de agendamento

# Coloque as logos em:
#   public/images/logo_camila_1.png  (versão colorida)
#   public/images/logo_camial_2.png  (versão preta)

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 3. Logos

Coloque os dois arquivos PNG da Camila na pasta `public/images/`:

| Arquivo | Uso |
|---|---|
| `logo_camila_1.png` | Formulário público, landing page |
| `logo_camial_2.png` | Dashboard admin (fundo claro) |

---

## 4. Rotas

| Rota | Descrição |
|---|---|
| `/` | Landing page pública |
| `/avaliacao` | Wizard de avaliação (público, sem login) |
| `/resultado/[id]` | Resultado individual do participante |
| `/admin/login` | Login da fonoaudióloga |
| `/admin/dashboard` | Painel analítico (privado) |
| `/admin/participante/[id]` | Detalhe de participante (privado) |

---

## 5. Deploy na Vercel

```bash
# Instale a CLI da Vercel (opcional)
npm i -g vercel

# Deploy
vercel --prod
```

**Ou via interface:**
1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. Adicione as variáveis de ambiente em **Settings > Environment Variables**
3. Deploy automático a cada push na branch `main`

---

## 6. Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave service role (somente server-side) |
| `NEXT_PUBLIC_LINK_AGENDAMENTO` | Não | Link do WhatsApp/Calendly para agendamento |

---

## 7. Stack

- **Next.js 14** (App Router, TypeScript strict)
- **Tailwind CSS v4** (tema customizado com paleta Camila Aguiar)
- **Supabase** (PostgreSQL + Auth)
- **Recharts** (gráficos do dashboard)
- **Vercel** (deploy)

---

## 8. Instrumentos utilizados

- **IDV-10** (Índice de Desvantagem Vocal): Costa T, Oliveira G, Behlau M. _Validação do Índice de Desvantagem Vocal: 10 (IDV-10) para o português brasileiro._ CoDAS. 2013;25(5):482-5.
- **VFS adaptada** — Fadiga Vocal (8 itens, escala Likert 0–4)
- **Hábitos Vocais** — 10 perguntas de múltipla escolha com ponderação de risco

---

## 9. Cálculo de score

| Instrumento | Peso | Max bruto |
|---|---|---|
| IDV-10 | 40% | 40 pts |
| Hábitos Vocais | 35% | 20 pts |
| Fadiga Vocal | 25% | 32 pts |

Cada score é normalizado para 0–100 antes de aplicar os pesos. O score composto determina a classificação:

| Nível | Range | Cor |
|---|---|---|
| Voz Saudável | 0–24 | Verde |
| Atenção | 25–49 | Amarelo |
| Alerta | 50–74 | Laranja |
| Urgente | 75–100 | Vermelho |

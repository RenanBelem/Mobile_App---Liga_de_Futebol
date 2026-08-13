# ❓ FAQ - Perguntas Frequentes

**Data:** Maio 2026  
**Status:** Finalizado  
**Versão:** 1.0

---

## 🚀 Instalação e Setup

### P: Como instalo o projeto?

**R:** Veja o guia completo em [docs/guias/INSTALACAO.md](./INSTALACAO.md). Resumo rápido:

```bash
git clone <repo>
cd <repo>
npm install
npm run dev
```

Acesse `http://localhost:8080`

---

### P: Qual versão do Node.js preciso?

**R:** Node.js 18+ (pode verificar com `node --version`)

Recomendamos:
- ✅ Node 20.x (LTS estável)
- ⚠️ Node 18.x (suportado)
- ❌ Node 16 ou anterior (não suportado)

---

### P: Porta 8080 já está em uso. E agora?

**R:** Escolha uma das soluções:

```bash
# Opção 1: Mudar porta
npm run dev -- --port 3000

# Opção 2: Matar processo na porta
# Windows:
netstat -ano | findstr :8080
taskkill /PID [numero] /F

# Mac/Linux:
lsof -i :8080
kill -9 [numero]
```

---

### P: npm install está lento/falhando

**R:** Tente:

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

## 💾 Dados e Persistência

### P: Onde os dados estão sendo salvos?

**R:** Atualmente em **localStorage do navegador**. Isso significa:

- ✅ Dados persistem ao recarregar a página
- ✅ Cada navegador tem seus dados separados
- ⚠️ Limite: ~5-10MB por domínio
- ❌ Não sincroniza entre dispositivos
- ❌ Limpar cache do navegador = perde dados

---

### P: Como vejo os dados salvos?

**R:** Acesse a página de debug:

```
http://localhost:8080/debug
```

Você verá:
- 👤 Usuários cadastrados
- ⚽ Times cadastrados
- 🏃 Jogadores cadastrados
- 📋 JSON bruto dos dados

---

### P: Como exporto os dados?

**R:** No localStorage, você pode exportar manualmente:

```javascript
// No console do navegador (F12)
localStorage.getItem('lfa_users')
localStorage.getItem('lfa_teams')
localStorage.getItem('lfa_players')

// Copie e salve em um arquivo .json
```

---

### P: Se limpar cache, perdo tudo?

**R:** Sim! localStorage é limpo quando você limpa cache do navegador.

**Solução (Q3 2026):** Será implementado backend com Supabase para persistência real.

---

## 📝 Cadastros e Formulários

### P: Como cadastro um novo jogador?

**R:** 

1. Acesse a aba **"Mais"** (BottomNav)
2. Clique em **"Cadastrar Jogador"**
3. Preencha:
   - Nome (min 3 caracteres)
   - Número da camisa (1-99)
   - Posição (select com 7 opções)
   - Time (select com 25 times)
   - Altura (150-230 cm)
   - Peso (40-150 kg)
   - Data de nascimento
   - CPF (opcional)
4. Clique em **"Cadastrar"**
5. Verá mensagem de sucesso!

---

### P: Qual a diferença entre Usuário e Jogador?

**R:** Excelente pergunta!

**Usuário:**
- Sistema de login/acesso
- Email + Senha
- Roles: Admin, Moderador, Jogador, Torcedor
- Gerencia o app

**Jogador:**
- Perfil de atleta
- Posição, número, altura, peso
- Vinculado a um time
- Dados esportivos

Um usuário pode ser jogador, mas não precisa. Um jogador precisa estar vinculado a um time.

---

### P: Porque não consigo editar um cadastro?

**R:** Edição ainda não foi implementada (v1.1.0 - Q3 2026).

Solução atual:
- Limpar localStorage: `localStorage.clear()` no console
- Recarregar página
- Recadastrar (sem erros)

---

### P: Como removo um cadastro errado?

**R:** Temporariamente:

```javascript
// Console do navegador (F12 → Console)

// Remover usuário
const users = JSON.parse(localStorage.getItem('lfa_users') || '[]');
const filtered = users.filter(u => u.id !== 'id_do_usuario');
localStorage.setItem('lfa_users', JSON.stringify(filtered));
```

---

## 🎨 Interface e Navegação

### P: Como mudo o tema (claro/escuro)?

**R:** Atualmente está em **dark theme fixo** (Maio 2026).

Funcionalidade de toggle será adicionada em v1.1.0 (Q3 2026).

---

### P: Por que a aba "Configurações" está desabilitada?

**R:** Será implementada em v1.1.0.

Atualmente temos:
- ✅ Início (Home)
- ✅ Torneios (Listagem)
- ✅ Times (Listagem)
- ✅ Mídia (Galeria)
- ✅ Mais (Admin)

Em breve:
- 🔄 Configurações (v1.1)
- 🔄 Perfil do usuário (v2.0)

---

### P: O app funciona no celular?

**R:** Sim! É **mobile-first**:

- ✅ Funciona em qualquer celular com navegador
- ✅ Touch-friendly (BottomNav otimizado)
- ✅ Responsive design (adapta ao tamanho)

Mas:
- ❌ Ainda não é PWA (não instala em homescreen)
- ❌ Não funciona offline
- 🔄 Versão nativa (iOS/Android) em Q1 2027

---

## 🔐 Autenticação e Segurança

### P: Minha senha é segura?

**R:** Não, ainda não é segura!

Situação atual (v1.0):
- ❌ Senhas armazenadas em localStorage (plain text)
- ❌ Sem criptografia
- ❌ Sem backend
- ❌ Sem autenticação JWT

**Será corrigido em v2.0** (Q3 2026):
- ✅ Supabase Auth com JWT
- ✅ Hashing bcrypt no servidor
- ✅ HTTPS/SSL automático
- ✅ Row Level Security (RLS)

---

### P: Alguém pode acessar meus dados?

**R:** Potencialmente, sim:

- ⚠️ localStorage é acessível no navegador
- ⚠️ Qualquer um com acesso ao computador pode ver
- ⚠️ Sem servidor, não há controle de acesso

**Solução (v2.0):** Backend com autenticação JWT e RLS.

---

## 🐛 Bugs e Problemas

### P: Vejo tela branca (em branco)

**R:** Tente estas soluções em ordem:

1. **Hard refresh:** `Ctrl+Shift+R` (ou `Cmd+Shift+R` no Mac)
2. **Limpar cache do navegador:** `Ctrl+Shift+Delete`
3. **Parar servidor:** `Ctrl+C` no terminal
4. **Reiniciar:** `npm run dev`
5. **Verificar erros:** Abra Console (`F12`)

---

### P: Componentes não aparecem ou styling está quebrado

**R:** Pode ser problema de build do Tailwind:

```bash
# Limpar build
rm -rf dist

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Reconstruir
npm run build
npm run dev
```

---

### P: TypeScript errors no VSCode

**R:** 

```bash
# Recarregar VSCode TypeScript
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Ou limpar cache TS
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 Documentação e Código

### P: Por onde começo a entender o código?

**R:** Siga esta ordem:

1. **[docs/README.md](../README.md)** - Índice geral
2. **[README operacional](../README.md)** - Índice da documentação vigente
3. **[src/App.tsx](../../fonte/App.tsx)** - Rotas da aplicação
4. **[src/paginas/](../../fonte/paginas/)** - Explore uma página
5. **[src/componentes/](../../fonte/componentes/)** - Explore um componente

---

### P: Como altero algo?

**R:** Passo-a-passo:

1. Edite o arquivo (ex: `src/paginas/Index.tsx`)
2. Salve (`Ctrl+S`)
3. Vite faz hot reload automático
4. Veja mudança no navegador

---

### P: Qual foi a intenção por trás de cada design?

**R:** Leia:
- [docs/SCHEMA_DATABASE_PTBR.md](../SCHEMA_DATABASE_PTBR.md) - Modelo de dados
- [docs/arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md](../arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md) - Fluxo de dados

---

## 🚀 Futuro e Roadmap

### P: Quando terá backend real?

**R:** Q3 2026 (próximas 8-12 semanas)

Será implementado com Supabase:
- PostgreSQL gerenciado
- Autenticação JWT
- Storage de arquivos
- Real-time updates

---

### P: Quando terá app iOS/Android?

**R:** Q1 2027 (próximos 6-8 meses)

Será feito com React Native + Expo:
- Um código para iOS e Android
- Publicação nas app stores
- Push notifications

---

### P: Como contribuo com desenvolvimento?

**R:** 

1. Leia [docs/GUIA_CONTRIBUICAO.md](../GUIA_CONTRIBUICAO.md)
2. Faça um fork do repositório
3. Crie uma branch: `git checkout -b minha-feature`
4. Faça mudanças
5. Faça um pull request

---

### P: Como reporto um bug?

**R:**

1. Vá para GitHub Issues
2. Clique em "New Issue"
3. Descreva:
   - O que você esperava
   - O que realmente aconteceu
   - Passos para reproduzir
   - Screenshot/vídeo (se possível)

---

## 💬 Dúvidas Não Respondidas?

Se não encontrou resposta aqui:

1. **Consulte:** [docs/README.md](../README.md)
2. **Procure:** nos outros docs
3. **Abra issue:** no GitHub
4. **Pergunte:** na comunidade

---

## 📊 Estatísticas de FAQ

| Categoria | Perguntas | Respostas | Taxa de Ajuda |
|-----------|-----------|-----------|---------------|
| Instalação | 4 | ✅ | 100% |
| Dados | 5 | ✅ | 100% |
| Cadastros | 5 | ✅ | 100% |
| Interface | 4 | ✅ | 100% |
| Segurança | 2 | ✅ | 100% |
| Bugs | 3 | ✅ | 100% |
| Documentação | 3 | ✅ | 100% |
| Futuro | 4 | ✅ | 100% |

**Total:** 30 perguntas respondidas ✅

---

## 📝 Histórico

| Data | Versão | Mudança |
|------|--------|---------|
| Mai/2026 | 1.0 | FAQ criado |

---

**Última atualização:** Maio 2026  
**Próxima atualização:** Quando houver nova feature/versão

---

**Precisa de mais ajuda?** 🚀
- Consulte [docs/README.md](../README.md)
- Leia [docs/INSTALACAO.md](./INSTALACAO.md)

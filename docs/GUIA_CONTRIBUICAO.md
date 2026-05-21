# 🤝 Guia de Contribuição - Documentação

**Data:** Maio 2026  
**Status:** Finalizado  
**Versão:** 1.0

---

## 📖 Bem-vindo!

Este guia ajuda você a manter a documentação do projeto LFA organizada, consistente e útil.

---

## 📋 Checklist Antes de Documentar

Antes de criar um novo documento, pergunte-se:

- [ ] Este documento preenche uma lacuna de conhecimento?
- [ ] Pode ser organizado em uma das pastas existentes?
- [ ] Será consultado regularmente?
- [ ] Será mantido atualizado?

Se respondeu **SIM** a todos, continue! ✅

---

## 📁 Estrutura de Pastas

```
docs/
├── README.md                     # Índice geral (comece aqui)
├── TEMPLATE.md                   # Template para novos documentos
├── GUIA_CONTRIBUICAO.md          # Este arquivo
│
├── projeto/                      # Planejamento geral
│   ├── PLANO_DE_PROJETO.md
│   ├── EVOLUCAO_RECOMENDADA.md
│   └── ROADMAP.md (futuro)
│
├── decisoes/                     # Decisões técnicas
│   ├── MATRIZ_DE_DECISAO.md
│   ├── COMPARACAO_TECNICA.md
│   └── ADR_001.md (Architecture Decision Record - futuro)
│
├── arquitetura/                  # Diagramas e especificações
│   ├── ARQUITETURA_SISTEMA.md (futuro)
│   ├── BANCO_DE_DADOS.md (futuro)
│   └── DIAGRAMAS/ (futuro)
│
├── guias/                        # Tutoriais passo-a-passo
│   ├── SETUP_SUPABASE.md (futuro)
│   ├── SETUP_POCKETBASE.md (futuro)
│   ├── GUIA_PWA.md (futuro)
│   └── GUIA_REACT_NATIVE.md (futuro)
│
├── api/                          # Documentação de APIs
│   ├── SUPABASE_API.md (futuro)
│   ├── ENDPOINTS.md (futuro)
│   └── WEBHOOKS.md (futuro)
│
└── changelog/                    # Histórico de versões
    ├── v1.0.0.md (futuro)
    ├── v1.1.0.md (futuro)
    └── v2.0.0.md (futuro)
```

---

## 🎯 Tipos de Documentos

### 1. **Planejamento** 📋
- **Pasta:** `projeto/`
- **Exemplos:** Plano geral, roadmap, estratégia
- **Frequência de Update:** Mensal
- **Público:** Equipe + Stakeholders

### 2. **Decisões Técnicas** 🔀
- **Pasta:** `decisoes/`
- **Exemplos:** Comparações, matriz de decisão, ADRs
- **Frequência de Update:** Conforme necessário
- **Público:** Desenvolvedores + Arquiteto

### 3. **Arquitetura** 🏗️
- **Pasta:** `arquitetura/`
- **Exemplos:** Diagramas, schemas, especificações
- **Frequência de Update:** Quando arquitetura muda
- **Público:** Desenvolvedores

### 4. **Tutoriais** 📖
- **Pasta:** `guias/`
- **Exemplos:** Setup, deployment, guias passo-a-passo
- **Frequência de Update:** Conforme ferramentas mudam
- **Público:** Desenvolvedores novos no projeto

### 5. **API** 🔌
- **Pasta:** `api/`
- **Exemplos:** Endpoints, webhooks, integração
- **Frequência de Update:** Quando API muda
- **Público:** Desenvolvedores frontend + backend

### 6. **Changelog** 📝
- **Pasta:** `changelog/`
- **Exemplos:** O que mudou em cada versão
- **Frequência de Update:** A cada release
- **Público:** Todos

---

## ✍️ Convenções de Escrita

### Formato de Arquivo
```
Nome do Arquivo:
- Use MAIUSCULA_COM_UNDERSCORES.md
- Exemplo: SETUP_SUPABASE.md
- Evite: setup supabase.md ou setupSupabase.md
```

### Estrutura Padrão

Comece todo documento com:

```markdown
# 📌 Título do Documento

**Data:** Maio 2026
**Status:** [Em Rascunho | Em Revisão | Finalizado]
**Versão:** 1.0
**Autor:** Seu Nome
**Categoria:** [categoria]

---

## 🎯 Propósito

Uma frase explicando o objetivo do documento.

---

## 📑 Índice

1. [Seção 1](#seção-1)
2. [Seção 2](#seção-2)

---

## [Conteúdo...]
```

### Estilo de Escrita

✅ **Faça:**
- Use linguagem clara e direta
- Divida em seções pequenas
- Use exemplos quando possível
- Adicione emojis para visual (com moderação)
- Mantenha tom profissional mas acessível
- Forneça contexto necessário

❌ **Evite:**
- Linguagem muito técnica sem explicação
- Parágrafos muito longos
- Repetição desnecessária
- Opiniões pessoais
- Humor inapropriado

### Exemplos

```markdown
✅ Bom:
## Instalação Rápida

Para instalar o Supabase SDK:
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

❌ Ruim:
Você precisa instalar @supabase/supabase-js usando npm install.
```

---

## 🔗 Linking e Referências

### Links Internos

```markdown
# Correto
[Link para documento](../../documento.md)
[Seção específica](#nome-da-seção)

# Incorreto
[Link para documento](document.md)
[Seção específica](documento.md#nome-da-seção)
```

### Links Externos

```markdown
# Correto
[React Docs](https://react.dev)

# Incorreto
[Click here](https://react.dev)
```

---

## 📊 Tabelas e Listas

### Usar Tabelas Para

```markdown
| Aspecto | Opção A | Opção B |
|---------|---------|---------|
| Custo | Gratuito | $25/mês |
| Setup | 1 dia | 2 dias |
```

### Usar Listas Para

```markdown
# Checklist
- [ ] Item 1
- [ ] Item 2
- [x] Item 3 (completo)

# Lista numerada
1. Primeiro
2. Segundo
3. Terceiro

# Lista com bullet
- Ponto 1
- Ponto 2
  - Subponto 2.1
  - Subponto 2.2
```

---

## 🎨 Código e Exemplos

### Blocos de Código

```markdown
# TypeScript
\`\`\`typescript
interface User {
  name: string;
  email: string;
}
\`\`\`

# SQL
\`\`\`sql
SELECT * FROM users WHERE role = 'admin';
\`\`\`

# Bash
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`
```

### Código Inline

```markdown
Use \`const\` para variáveis que não mudam.
```

---

## 📋 Processo de Adição

### Passo 1: Preparar
- [ ] Decidir qual pasta usar (veja estrutura acima)
- [ ] Copiar [TEMPLATE.md](./TEMPLATE.md)
- [ ] Preencher metadata
- [ ] Escrever conteúdo

### Passo 2: Escrever
- [ ] Manter estrutura clara
- [ ] Usar exemplos
- [ ] Revisar ortografia
- [ ] Verificar links

### Passo 3: Registrar
- [ ] Adicionar link em [README.md](./README.md)
- [ ] Atualizar índice geral
- [ ] Confirmar links funcionam

### Passo 4: Versionar
- [ ] Dar nome consistente
- [ ] Adicionar versão 1.0
- [ ] Salvar em pasta correta

---

## 📝 Exemplo Prático

### Seu novo documento será:

**Arquivo:** `docs/guias/SETUP_SUPABASE.md`

**Conteúdo básico:**

```markdown
# 🚀 Setup Supabase - Guia Passo-a-Passo

**Data:** Maio 2026
**Status:** Finalizado
**Versão:** 1.0
**Autor:** Seu Nome

---

## 🎯 Propósito

Guia completo para configurar Supabase em 30 minutos.

---

## 📑 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Criar Projeto](#criar-projeto)
3. [Configurar Tabelas](#configurar-tabelas)

---

## 🔹 Pré-requisitos

- [ ] Conta no supabase.com
- [ ] Node.js 16+
- [ ] npm ou yarn

---

## 🔹 Criar Projeto

### Passo 1: Acesse supabase.com
1. Vá para [supabase.com](https://supabase.com)
2. Clique em "Sign Up"
...

---

## ✅ Conclusão

Agora você tem Supabase configurado!

---

**Próximas ações:**
- Conectar no React
- Criar primeira tabela
```

---

## 🔍 Checklist Final

Antes de commitar seu documento:

- [ ] Nome do arquivo segue padrão `MAIUSCULA_COM_UNDERSCORES.md`
- [ ] Arquivo tem metadata no topo
- [ ] Conteúdo está bem estruturado
- [ ] Links internos funcionam
- [ ] Código está com syntax highlight
- [ ] Documento adicionado ao README.md
- [ ] Ortografia revisada
- [ ] Nenhuma repetição desnecessária

---

## 📞 Dúvidas?

Se tiver dúvidas sobre como documentar:

1. Consulte [TEMPLATE.md](./TEMPLATE.md)
2. Olhe exemplos em [PLANO_DE_PROJETO.md](../PLANO_DE_PROJETO.md)
3. Pergunte no README principal

---

## 🎉 Obrigado!

Sua documentação ajuda toda a equipe! 🚀

---

## 📊 Estatísticas de Documentação

```
Total de Documentos: 4
├── Finalizado: 4
├── Em Revisão: 0
└── Em Rascunho: 0

Cobertura de Tópicos: 60%
├── Planejamento: ✅
├── Backend: ⚠️ (aguardando implementação)
├── Frontend: ⚠️ (básico)
├── APIs: ❌ (futuro)
└── Tutoriais: ⚠️ (aguardando setup)
```

Objetivo: 100% de cobertura até Q1 2027

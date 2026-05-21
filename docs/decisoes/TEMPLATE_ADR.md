# 📋 Template: ADR (Architecture Decision Record)

**Uso:** Copie este arquivo e renomeie como `ADR_00X_TITULO_DECISAO.md`

---

# ADR-001: [TÍTULO DA DECISÃO]

**Data:** [Data da decisão]  
**Status:** [Proposto | Aceito | Depreciado | Substituído]  
**Autor(es):** [Nome dos responsáveis]  
**Revisores:** [Nomes dos que reviram]

---

## 🎯 Context (Contexto)

**Problema:** Qual era o problema que precisava ser resolvido?

```
Exemplo: "Precisamos escolher um backend para substituir localStorage.
Temos 3+ opções viáveis com trade-offs diferentes."
```

**Restrições:** Quais são as limitações?

- Orçamento: [Ex: Gratuito por 2026]
- Time: [Ex: 2 desenvolvedores]
- Timeline: [Ex: Q3 2026]
- Infraestrutura: [Ex: Sem servidor Kubernetes disponível]

**Motivação:** Por que isso é importante agora?

- Razão 1: [Ex: localStorage não é escalável]
- Razão 2: [Ex: Privacidade requer servidor dedicado]
- Razão 3: [Ex: Roadmap inclui múltiplos usuários]

---

## 📋 Decision (Decisão)

**Escolhemos:** [Nome da opção escolhida]

**Por que:** Resumo de 1-2 linhas da principal razão

---

## ⚖️ Options Considered (Opções Consideradas)

### Option 1: [Nome da Opção]

**Vantagens:**
- ✅ Vantagem 1
- ✅ Vantagem 2
- ✅ Vantagem 3

**Desvantagens:**
- ❌ Desvantagem 1
- ❌ Desvantagem 2

**Custo:** [Preço/mês ou "Gratuito"]  
**Curva de Aprendizado:** [Baixa/Média/Alta]  
**Escalabilidade:** [Até 10k/100k/1M usuários]  
**Manutenção:** [Baixa/Média/Alta]

**Score:** 7/10

---

### Option 2: [Nome da Opção]

**Vantagens:**
- ✅ Vantagem 1
- ✅ Vantagem 2

**Desvantagens:**
- ❌ Desvantagem 1
- ❌ Desvantagem 2
- ❌ Desvantagem 3

**Custo:** [Preço/mês ou "Gratuito"]  
**Curva de Aprendizado:** [Baixa/Média/Alta]  
**Escalabilidade:** [Até 10k/100k/1M usuários]  
**Manutenção:** [Baixa/Média/Alta]

**Score:** 6/10

---

### Option 3: [Nome da Opção]

**Vantagens:**
- ✅ Vantagem 1
- ✅ Vantagem 2
- ✅ Vantagem 3
- ✅ Vantagem 4

**Desvantagens:**
- ❌ Desvantagem 1
- ❌ Desvantagem 2
- ❌ Desvantagem 3

**Custo:** [Preço/mês ou "Gratuito"]  
**Curva de Aprendizado:** [Baixa/Média/Alta]  
**Escalabilidade:** [Até 10k/100k/1M usuários]  
**Manutenção:** [Baixa/Média/Alta]

**Score:** 5/10

---

## 📊 Comparison Matrix (Matriz de Comparação)

| Critério | Option 1 | Option 2 | Option 3 | Vencedor |
|----------|----------|----------|----------|----------|
| **Custo** | Pago | Gratuito | Gratuito | Option 2/3 ✅ |
| **Escalabilidade** | Alta | Média | Alta | Option 1/3 ✅ |
| **Curva Aprendizado** | Média | Baixa | Alta | Option 2 ✅ |
| **Manutenção** | Baixa | Média | Alta | Option 1 ✅ |
| **Comunidade** | Grande | Média | Pequena | Option 1 ✅ |
| **Integração JWT** | ✅ | ✅ | ❌ | Option 1/2 ✅ |
| **Hospedagem** | Gerenciada | Livre | Livre | Option 1 ✅ |
| **Performance** | Excelente | Boa | Boa | Option 1 ✅ |
| **Score Total** | 7/10 | 6/10 | 5/10 | **Option 1** |

---

## ✅ Consequences (Consequências)

### Positivas
- ✅ Consequência positiva 1
- ✅ Consequência positiva 2
- ✅ Será mais fácil fazer X no futuro

### Negativas
- ⚠️ Precisaremos reescrever Y
- ⚠️ Será mais lento até ter Z implementado
- ⚠️ Curva de aprendizado para novo dev

### Neutras
- ℹ️ Não afeta performance atual
- ℹ️ Não muda o frontend

---

## 🔄 Implementation Plan (Plano de Implementação)

### Fase 1: Preparação (Semana 1)
- [ ] Criar conta / instalar software
- [ ] Configuração inicial
- [ ] Testes básicos

### Fase 2: Desenvolvimento (Semana 2-3)
- [ ] Implementar integração
- [ ] Testes unitários
- [ ] Testes integração

### Fase 3: Migração (Semana 4)
- [ ] Exportar dados antigos
- [ ] Importar dados novos
- [ ] Validação

### Fase 4: Deploy (Semana 5)
- [ ] Staging
- [ ] Produção
- [ ] Monitoramento

**Timeline Total:** 5 semanas  
**Esforço:** [Ex: 40 horas]  
**Dependências:** [Ex: Supabase account criada]

---

## 📚 References (Referências)

### Documentação Oficial
- [Link oficial Option 1](https://example.com)
- [Pricing Option 1](https://example.com/pricing)
- [Tutorials](https://example.com/docs)

### Comparações
- [vs Option 2](https://example.com)
- [Benchmark](https://example.com)

### Discussões Internas
- [GitHub Issue #123](https://github.com/...)
- [Slack thread](https://slack.com/...)
- [Sprint Planning Junho](../projeto/EVOLUCAO_RECOMENDADA.md)

---

## 🏷️ Tags (Etiquetas)

```
#backend #decisão #arquitetura #q3-2026 #crítico
```

---

## 📝 Approval History (Histórico de Aprovação)

| Data | Pessoa | Status | Comentários |
|------|--------|--------|------------|
| [Data] | [Nome] | ✅ Aprovado | [Observações] |
| [Data] | [Nome] | ✅ Aprovado | [Observações] |
| [Data] | [Nome] | ⚠️ Comentários | [Perguntas] |

---

## 🔗 Related ADRs (ADRs Relacionadas)

- ADR-000: [Título anterior] (predecessora)
- ADR-002: [Título próxima] (sucessora planejada)

---

## 💬 Discussion Notes (Notas de Discussão)

### Reunião de 20/06/2026
> "Votamos 5-0 para a Option 1. Razão: custo-benefício melhor que options 2 e 3."

### Slack - Thread #backend-decision
> "Alguém tem experiência com Option 3? Parece mais simples."
> "Sim, mas não escala bem para 100k usuários."

---

## ⚡ Quick Reference (Referência Rápida)

```
DECISÃO FINAL: Option 1 ✅
RAZÃO PRINCIPAL: Melhor escalabilidade + custo baixo
ESFORÇO: 40 horas em 5 semanas
RISCO: Baixo (tecnologia consolidada)
REVISOR: [Nome]
APROVADO: [Data]
```

---

## 🚀 Next Steps (Próximos Passos)

1. [ ] Criar conta / instalar software
2. [ ] Fazer POC de 2-3 dias
3. [ ] Validar decisão com time
4. [ ] Começar Fase 1 implementação
5. [ ] Criar documentação técnica

---

## 📌 Notes (Notas)

- **Nota 1:** [Algo importante]
- **Nota 2:** [Detalhe a considerar]
- **Caveat:** [Exceção ou ressalva]

---

---

## 📖 Como Usar Este Template

### Para Criar Uma Nova ADR

1. **Copie este arquivo**
   ```bash
   cp docs/template-adr.md docs/decisoes/ADR_001_ESCOLHA_BACKEND.md
   ```

2. **Preencha as seções obrigatórias:**
   - Context (sempre)
   - Decision (sempre)
   - Options Considered (sempre)
   - Consequences (sempre)

3. **Preencha as seções recomendadas:**
   - Comparison Matrix (se múltiplas opções)
   - Implementation Plan (se vai implementar)
   - References (para credibilidade)

4. **Preencha as seções opcionais:**
   - Discussion Notes (se relevante)
   - Approval History (após revisão)

5. **Commit com mensagem clara**
   ```bash
   git add docs/decisoes/ADR_001_ESCOLHA_BACKEND.md
   git commit -m "docs: ADR-001 Escolha de Backend (Supabase)"
   ```

---

## 🎓 Padrão ADR

Este template segue o padrão **RFC 22** (Architecture Decision Records):

> "An architecture decision record (ADR) is a document that captures an important 
> architectural decision made along with its context and consequences."

**Por que usar ADRs?**

- ✅ Registra decisões para futuro
- ✅ Explica contexto e consequências
- ✅ Facilita onboarding de novo dev
- ✅ Ajuda a evitar repetir erros
- ✅ Documentação automática do projeto

---

## 📚 Exemplos de ADRs Bem Feitas

### ADR Exemplo 1: Escolha de Framework

**Context:** Precisamos escolher entre React vs Vue vs Angular

**Decision:** React

**Why:** Melhor comunidade, mais bibliotecas, melhor performance

**Consequences:** 
- ✅ Mais fácil encontrar devs
- ✅ Mais componentes prontos
- ❌ Curva de aprendizado maior que Vue

---

### ADR Exemplo 2: Arquitetura

**Context:** Como organizar estado global?

**Decision:** Redux + Redux Saga

**Why:** Escalável, testável, comunidade ativa

**Consequences:**
- ✅ State bem definido
- ❌ Boilerplate extra
- ⚠️ Precisa de treinamento

---

## 🎯 Status de uma ADR

```
Proposto    → Discussão e aprovação
Aceito      → Aprovado e implementar
Implementando → Em desenvolvimento
Implementado → Pronto em produção
Depreciado  → Substituído por novo ADR
Rejeitado   → Não foi prosseguido
```

---

**Versão:** 1.0  
**Última Atualização:** Maio 2026  
**Próxima Revisão:** Junho 2026 (Quando usar ADR-001)

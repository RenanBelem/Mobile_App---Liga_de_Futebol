# Wiki da Liga de Futebol Antifascista (LFA)

Bem-vindo(a) à Wiki da [**LFA**](./docs/Home.md) (clique no link para acessar a página principal da LFA)! Este espaço é dedicado a registrar a história, os times, os campeonatos e os resultados da nossa liga.

Como a nossa Wiki é mantida de forma colaborativa, qualquer pessoa pode ajudar a atualizar informações, corrigir erros de digitação ou adicionar novos detalhes sobre os times. Você pode fazer tudo direto pelo seu navegador de internet, sem instalar nada no seu computador.

---

## Como Contribuir

### 1. Criar uma conta no GitHub
1. Acesse [github.com](https://github.com/).
2. Clique em **Sign up** (Cadastrar-se) no canto superior direito.
3. Insira seu e-mail, crie uma senha e escolha um nome de usuário.

---

### 2. Como Editar uma Página Existente
Se você viu um resultado errado, quer atualizar a história de um time, ou corrigir um erro de português:

1. **Navegue até o arquivo**:
   - Vá até a pasta `docs/` para ver as páginas.
   - Os arquivos de texto dos times estão na pasta `docs/times/` (por exemplo, `Estrela-Vermelha.md`).
   - Os arquivos dos campeonatos estão na pasta `docs/campeonatos/` (por exemplo, `taca-cecilia.md`).
2. **Abra o arquivo**:
   - Clique no nome do arquivo que deseja alterar.
3. **Entre no modo de edição**:
   - No canto direito superior da área de texto da página, clique no ícone de **lápis** (que diz *Edit this file* ou *Editar este arquivo*).
4. **Faça as suas alterações**:
   - Você verá o texto da página. Você pode usar a aba **Preview** (Visualizar) para ver como o texto formatado vai ficar.
   - Dica de formatação: Links são escritos assim `[Nome do link](caminho-do-link.md)`.
5. **Proponha as alterações**:
   - Quando terminar de editar, clique no botão verde **Commit changes...** (Salvar alterações) no canto superior direito.
   - Um pequeno painel vai abrir. No campo de título, escreva um resumo simples do que você fez (ex: *"Atualizando os títulos do Estrela Vermelha"*).
   - Clique no botão verde **Propose changes** (Propor alterações).
6. **Envie para aprovação (Pull Request)**:
   - Na tela seguinte, você verá um resumo das suas mudanças. Clique no botão verde **Create pull request** (Criar pull request).
   - Confirme clicando em **Create pull request** novamente na próxima página.
   - **Pronto!** Sua alteração foi enviada. Ela será revisada por quem administra a Wiki e, se estiver tudo certo, será adicionada ao site oficial.

---

### 3. Como Criar uma Nova Página (ex: Um novo Time)
Se um novo time entrou na liga e você quer criar uma página para ele:

1. **Vá até a pasta correta**:
   - Clique na pasta `docs/times/` para entrar nela.
2. **Crie o novo arquivo**:
   - No canto superior direito da lista de arquivos, clique em **Add file** (Adicionar arquivo) e escolha **Create new file** (Criar novo arquivo).
3. **Dê um nome ao arquivo**:
   - No campo de nome do arquivo, escreva o nome do time em letras minúsculas, usando hífen no lugar de espaços, e terminando com `.md`.
   - Exemplo: `novo-time-da-liga.md`.
4. **Escreva o conteúdo**:
   - Na área de texto, escreva sobre o time. O ideal é começar com um título grande usando um caractere `#` (ex: `# Nome do Time`).
5. **Proponha a criação**:
   - Siga os mesmos passos descritos anteriormente: clique em **Commit changes...**, escreva o que fez (ex: *"Criando página do novo time"*), clique em **Propose changes** e depois envie o **Create pull request**.

---

## 🛠️ Dicas Rápidas de Formatação (Markdown)

A nossa Wiki usa uma linguagem simples chamada Markdown para formatar os textos:

* **Títulos**: Use `#` para títulos grandes e `##` para subtítulos.
  ```markdown
  # Título do Time
  ## História do Time
  ```
* **Texto em Negrito**: Envolva a palavra em dois asteriscos de cada lado.
  ```markdown
  O time foi **campeão** em 2026!
  ```
* **Links**: Coloque o texto que aparece na tela entre colchetes `[ ]` e o endereço da página entre parênteses `( )`.
  - Para linkar para outro time: `[Estrela Vermelha](../times/Estrela-Vermelha.md)`
  - Para linkar para um campeonato: `[Taça Cecília](../campeonatos/taca-cecilia.md)`

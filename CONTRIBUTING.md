# Contribuindo para o ZFrame

Obrigado por considerar contribuir para o ZFrame! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Informações do ambiente (browser, versão, OS)

### Sugerindo Melhorias

Para sugestões de features ou melhorias:
- Descreva claramente a funcionalidade desejada
- Explique por que seria útil
- Considere possíveis implementações

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature: `git checkout -b feature/minha-feature`
4. **Faça suas alterações** seguindo as diretrizes abaixo
5. **Commit** suas mudanças: `git commit -m 'feat: adiciona minha feature'`
6. **Push** para sua branch: `git push origin feature/minha-feature`
7. **Abra um Pull Request** descrevendo suas mudanças

## Diretrizes de Código

### Estilo de Código

- Use **TypeScript** para todo código novo
- Siga o estilo existente do projeto
- Use **Prettier** para formatação (configuração incluída)
- Mantenha funções pequenas e focadas
- Adicione comentários para lógica complexa

### Estrutura de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` mudanças na documentação
- `style:` formatação, ponto e vírgula, etc.
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` tarefas de manutenção

Exemplos:
```
feat: adiciona filtro por data de vencimento
fix: corrige drag-and-drop em mobile
docs: atualiza README com novos atalhos
```

### Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── core/       # Lógica de domínio (sem dependências externas)
├── adapters/   # I/O (JSON, Markdown, File System)
├── hooks/      # React hooks
├── components/ # UI components
└── styles/     # CSS
```

**Regras:**
- `core/` não deve importar de outras camadas
- `adapters/` pode importar de `core/`
- `hooks/` pode importar de `core/` e `adapters/`
- `components/` pode importar de qualquer camada

### Testes

- Adicione testes para novas funcionalidades
- Mantenha cobertura de testes alta
- Execute `bun test` antes de fazer commit

### UI/UX

- Mantenha o design **Glassmorphism** consistente
- Use **Tabler Icons** para novos ícones
- Siga os **design tokens** em `design-tokens.css`
- Teste em diferentes tamanhos de tela
- Garanta acessibilidade (ARIA labels, keyboard navigation)

## Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Rodar dev server
bun run dev

# Build de produção
bun run build

# Executar testes
bun test

# Lint
bun run lint
```

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## Dúvidas?

Sinta-se à vontade para abrir uma issue com a tag `question` ou entrar em contato com os mantenedores.

---

**Obrigado por contribuir! 🚀**

## Checklist — Book Shelf Hub

### 🔴 Crítico
- [x] Criar `UserContext` com dados reais do usuário
- [x] Implementar salvamento do perfil na API
- [x] Remover `console.log` de produção
- [x] Centralizar URL da API
- [x] Implementar refresh token automático

### 🟡 Moderado
- [x] Unificar `Book` e `MockBook`
- [x] Passar apenas `id` para `bookInfo`
- [x] Remover delays artificiais do login
- [ ] Tipar contratos da API com Zod/TypeScript
- [x] Corrigir textos hardcoded no login com i18n
- [x] Melhorar controle de rotas do Menu
- [x] Separar nome e `@username` no `searchUser`

### 🟢 Melhorias
- [x] Adicionar skeleton/loading nos perfis
- [x] Trocar `ScrollView` por `FlatList` no Discover
- [x] Implementar paginação no Discover
- [ ] Implementar Splash Screen durante o carregamento inicial
- [x] Substituir `any[]` por tipos específicos
- [ ] Criar testes unitários
- [ ] Adicionar testes para `applyShelfFilters`
- [ ] Adicionar testes para `getEmailVerificationStatus`

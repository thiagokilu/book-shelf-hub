# 📚 Book Shelf Hub

Aplicativo mobile para organizar sua estante, acompanhar leituras e descobrir livros.

[![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🔗 API

[![API Books](https://img.shields.io/badge/API-Books-2EA44F?logo=github&logoColor=white)](https://github.com/thiagokilu/api-books)

Confira o código da API no repositório [thiagokilu/api-books](https://github.com/thiagokilu/api-books).

## 📌 Estado atual

O aplicativo já possui autenticação, gerenciamento de sessão, estante de livros,
descoberta com busca e paginação, perfis públicos e edição de perfil. O checklist
abaixo registra o que foi concluído e o que ainda precisa de trabalho.

## ✅ Checklist — Book Shelf Hub

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
- [x] Completar a tipagem dos contratos da API com Zod/TypeScript
- [x] Corrigir textos hardcoded no login com i18n
- [x] Melhorar controle de rotas do Menu
- [x] Separar nome e `@username` no `searchUser`

### 🟢 Melhorias

- [x] Usar skeleton/loading durante o carregamento dos perfis
- [x] Usar lista otimizada (`FlashList`) no Discover
- [x] Implementar paginação no Discover
- [x] Implementar Splash Screen animada durante o carregamento inicial
- [ ] Substituir os usos restantes de `any` por tipos específicos
- [ ] Criar testes unitários
- [ ] Adicionar testes para `applyShelfFilters`
- [ ] Adicionar testes para `getEmailVerificationStatus`

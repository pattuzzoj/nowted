# Nowted

##

Qual problema que o software resolve?
Para quem é o software?
O que ele faz?
Como ele faz?
Quais as restrições para o que ele faz?
Quais tecnologias podem ser utilizadas?
Qual melhor arquitetura?

# Nowted

## Público Alvo













# 📝 Nowted

Nowted é uma aplicação moderna de gerenciamento de notas que oferece uma experiência rica e organizada para criação, edição e categorização de anotações. Projetada com foco em produtividade e usabilidade, ela permite desde o simples ato de anotar até o gerenciamento completo de notas em pastas, com suporte a imagens, sistema de autenticação seguro e notificações em tempo real.

---

## ✨ Funcionalidades

- 📁 **Organização por Pastas**: Crie pastas para agrupar e organizar suas notas.
- ⭐ **Favoritar Notas**: Marque suas notas importantes para acesso rápido.
- 🗃️ **Arquivamento**: Arquive notas para mantê-las fora da visualização principal sem excluir.
- 🗑️ **Exclusão**: Remova notas com segurança.
- 📝 **Editor Estilo Word**: Edite notas com um editor rico em funcionalidades, similar ao Word (formatação, imagens, etc.).
- 🔐 **Autenticação Segura**: Login e gerenciamento de sessão com JWT (Access/Refresh Token).
- 📬 **Sistema de Notificações por E-mail**: Notificações importantes diretamente no seu e-mail.
- 🔔 **Toasts em Tempo Real**: Cada ação na aplicação dispara um toast responsivo para feedback imediato.
- 🖼️ **Suporte a Imagens e Arquivos**: Salve até **10MB** por anotação (incluindo imagens).

---

## 🧩 Tecnologias Utilizadas

### Front-end

- **Solid.js** — Framework reativo e performático.
- **Tailwind CSS** — Utilitário de CSS para estilização rápida e customizável.
- **Ark UI** — Componentes acessíveis e prontos para uso.
- **Modular Forms** — Validação e manipulação de formulários com ergonomia.
- **Arquitetura Feature-Based** — Organização baseada por funcionalidades, promovendo escalabilidade e legibilidade.

### Back-end

- **NestJS + Express** — Framework escalável e robusto com modularidade no core.
- **Arquitetura Modular** — Separação clara de responsabilidades e módulos independentes.
- **JWT (Access & Refresh Tokens)** — Segurança na autenticação e renovação de sessão.
- **Sistema de E-mail** — Integração para envio de notificações aos usuários.
- **Validação de Uploads** — Limite de 10MB por anotação, com suporte a upload de imagens.

---

## 🛡️ Segurança

- Autenticação baseada em tokens JWT (Access + Refresh)
- Middleware de proteção de rotas no back-end
- Uploads validados com limite de 10MB por nota

---

## 📄 Licença

Este projeto está sob a licença MIT.

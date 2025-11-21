# E-Flow - Aplicativo de Carregamento de Carros Elétricos ⚡🚗

> Um PWA (Progressive Web App) moderno e funcional para encontrar e usar estações de carregamento de carros elétricos. Projeto desenvolvido para a matéria Projeto 5 do segundo semestre de 2025 no curso de Design no Mackenzie.

## 🎯 Sobre o Projeto

O E-Flow é um aplicativo completo que permite aos usuários:

- 🔍 Encontrar estações de carregamento próximas em um mapa interativo
- 📍 Ver detalhes de cada estação (potência, preço, conectores disponíveis)
- 💳 Processar pagamentos de forma segura (mockado)
- ⚡ Acompanhar o progresso do carregamento em tempo real
- 📱 Funcionar offline como um app nativo (PWA)

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as melhores ferramentas modernas:

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - JavaScript com tipagem estática (sem `any` permitido! 🛡️)
- **Vite** - Build tool ultra-rápido para desenvolvimento
- **Bun 1.3.2** - Runtime JavaScript moderno e rápido
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Leaflet** - Biblioteca open-source para mapas interativos
- **React Router** - Roteamento para aplicações React
- **PWA Plugin** - Transforma o app em Progressive Web App

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Bun 1.3.2](https://bun.sh/) - O runtime JavaScript que estamos usando
- Node.js (opcional, mas recomendado para compatibilidade)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório (se aplicável)

```bash
cd e-flow
```

### 2. Instale as dependências

```bash
bun install
```

Isso vai instalar todas as dependências necessárias usando o Bun.

### 3. Execute o projeto em modo desenvolvimento

```bash
bun run dev
```

Ou usando o comando direto:

```bash
bunx --bun vite
```

O app estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

### 4. Build para produção

```bash
bun run build
```

Isso gera os arquivos otimizados na pasta `dist/`.

### 5. Preview da build de produção

```bash
bun run preview
```

## 📱 Como Usar o Aplicativo

### Fluxo Completo do Usuário

1. **Tela Inicial (Splash)**
   - Logo do E-Flow aparece por 2 segundos
   - Redireciona automaticamente para login ou mapa (se já estiver logado)

2. **Login**
   - Use qualquer email e senha (tudo é mockado!)
   - O sistema aceita qualquer combinação e cria um usuário automaticamente

3. **Mapa de Estações**
   - Visualize todas as estações de carregamento em São Paulo
   - Filtre por "Todas" ou apenas "Disponíveis"
   - Clique em um marcador para ver detalhes no popup
   - Clique em "Ver Detalhes" para ir à página da estação

4. **Detalhes da Estação**
   - Veja informações completas: potência, preço, conectores, avaliação
   - Clique em "Iniciar Carregamento" para prosseguir

5. **Pagamento**
   - Escolha o método de pagamento (Cartão de Crédito, Débito ou PIX)
   - Veja o resumo do carregamento e valor total
   - Confirme o pagamento

6. **Status do Pagamento**
   - Aguarde a confirmação (simulado)
   - O carregamento inicia automaticamente após aprovação

7. **Status do Carregamento**
   - Acompanhe o progresso em tempo real
   - Veja a porcentagem da bateria, energia entregue e tempo restante
   - Opção de cancelar (se necessário)

8. **Sucesso!**
   - Tela de confirmação com resumo completo
   - Energia entregue, duração e valor pago
   - Botão para voltar ao mapa

## 🏗️ Estrutura do Projeto

```
e-flow/
├── src/
│   ├── components/          # Componentes reutilizáveis (futuro)
│   ├── pages/               # Páginas/rotas do aplicativo
│   │   ├── Splash.tsx       # Tela inicial com logo
│   │   ├── Login.tsx        # Tela de login
│   │   ├── MapView.tsx      # Mapa com estações
│   │   ├── StationDetail.tsx # Detalhes da estação
│   │   ├── Payment.tsx      # Formulário de pagamento
│   │   ├── PaymentStatus.tsx # Status do pagamento
│   │   ├── ChargingStatus.tsx # Status do carregamento
│   │   └── Success.tsx      # Tela de sucesso
│   ├── services/            # Serviços mockados
│   │   ├── auth.ts          # Autenticação (localStorage)
│   │   ├── stations.ts      # Dados das estações
│   │   ├── payment.ts       # Processamento de pagamento
│   │   └── charging.ts      # Simulação de carregamento
│   ├── types/               # Definições TypeScript
│   │   └── index.ts         # Interfaces e tipos
│   ├── utils/               # Funções utilitárias
│   │   └── storage.ts       # Helpers para localStorage
│   ├── App.tsx              # Componente principal com rotas
│   ├── main.tsx             # Entry point React
│   └── index.css            # Estilos globais + Tailwind
├── public/
│   ├── assets/              # Assets do design (SVGs, imagens)
│   ├── icons/               # Ícones PWA
│   └── manifest.json        # Manifest do PWA
├── vite.config.ts           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
├── tsconfig.json            # Configuração TypeScript
└── package.json             # Dependências e scripts
```

## 🎨 Design System

O aplicativo usa **Tailwind CSS** para estilização, com um sistema de cores baseado em verde (primary) para representar energia limpa e sustentabilidade.

### Cores Principais

- **Primary (Verde)**: `#10b981` - Cor principal do app
- **Background**: `#f9fafb` (gray-50)
- **Cards**: Branco com sombra suave

### Componentes Reutilizáveis

- `.btn-primary` - Botão principal (verde)
- `.btn-secondary` - Botão secundário (cinza)
- `.btn-danger` - Botão de ação destrutiva (vermelho)
- `.input` - Campo de entrada de texto
- `.card` - Container de card com sombra

## 🔧 Funcionalidades Mockadas

Todas as funcionalidades são **completamente mockadas** para demonstração:

- ✅ **Autenticação**: Qualquer email/senha funciona
- ✅ **Estações**: 6 estações mockadas em São Paulo
- ✅ **Pagamentos**: Processamento simulado (sempre aprovado)
- ✅ **Carregamento**: Progresso simulado com atualizações a cada 2 segundos

### Dados Mockados

As estações estão localizadas em pontos reais de São Paulo:

- Shopping Center Norte
- Parque Ibirapuera
- Avenida Paulista
- Shopping Morumbi
- Aeroporto de Congonhas
- Parque Villa-Lobos

## 📱 PWA (Progressive Web App)

O E-Flow é um PWA completo, o que significa:

- ✅ **Instalável**: Pode ser instalado como app nativo no celular
- ✅ **Offline**: Funciona sem internet (dados em cache)
- ✅ **Service Worker**: Cache automático de assets e rotas
- ✅ **Manifest**: Configuração para instalação

### Como Instalar no Celular

1. Abra o app no navegador mobile
2. Procure a opção "Adicionar à Tela Inicial" ou "Instalar App"
3. Confirme a instalação
4. O app aparecerá como um ícone na tela inicial!

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
bun run dev

# Build para produção
bun run build

# Preview da build
bun run preview

# Verificar tipos TypeScript
bun run type-check
```

### Comandos com Bun

Todos os comandos usam `bunx --bun` para garantir que o Bun execute os binários:

```bash
# Desenvolvimento
bunx --bun vite

# Type checking
bunx --bun tsc --noEmit
```

**Importante**: A ordem correta é `bunx --bun <comando>`, não `bunx <comando> --bun`!

## 🗺️ Mapas

O aplicativo usa **Leaflet** com tiles do **OpenStreetMap**. Os mapas são:

- Gratuitos e open-source
- Funcionam offline (após primeiro carregamento)
- Cacheados pelo Service Worker

## 🎯 Decisões de Arquitetura

### Por que React?

- Biblioteca madura e amplamente usada
- Ecossistema rico de ferramentas
- Fácil de aprender e manter

### Por que TypeScript?

- Type safety previne bugs
- Melhor experiência de desenvolvimento (autocomplete)
- Código mais legível e autodocumentado

### Por que Vite?

- Build extremamente rápido
- Hot Module Replacement (HMR) instantâneo
- Otimizações automáticas para produção

### Por que Bun?

- Runtime JavaScript moderno e rápido
- Compatível com Node.js
- Instalação de pacotes muito rápida

### Por que Tailwind CSS?

- Desenvolvimento rápido
- Consistência visual
- Fácil manutenção
- Purge automático (remove CSS não usado)

## 🚀 Deploy na Vercel

O projeto está configurado para deploy automático na Vercel!

### Configuração Automática

O arquivo `vercel.json` já está configurado com:

- **Build Command**: `bun run build:vite` (usa Vite para PWA completo)
- **Output Directory**: `dist`
- **Install Command**: `bun install`
- **Framework**: Vite (detectado automaticamente)

### Deploy Manual

1. **Instale a Vercel CLI** (opcional):

   ```bash
   npm i -g vercel
   ```

2. **Faça login**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

### Deploy via GitHub/GitLab

1. Conecte seu repositório na Vercel
2. A Vercel detectará automaticamente as configurações do `vercel.json`
3. O build será executado automaticamente em cada push

### Configurações na Vercel Dashboard

Se preferir configurar manualmente na interface da Vercel:

- **Framework Preset**: Vite
- **Build Command**: `bun run build:vite`
- **Output Directory**: `dist`
- **Install Command**: `bun install`
- **Node.js Version**: 18.x ou superior (a Vercel usará Bun automaticamente se disponível)

### Nota sobre Bun na Vercel

A Vercel suporta Bun! Certifique-se de que:

- O `package.json` especifica `"engines": { "bun": "1.3.2" }`
- O comando de build usa `bunx --bun` ou `bun run`

### Variáveis de Ambiente

Se precisar de variáveis de ambiente no futuro, configure-as no dashboard da Vercel em:
**Settings → Environment Variables**

## 🐛 Troubleshooting

### O mapa não aparece

- Verifique se o Leaflet CSS está sendo carregado
- Confirme que os tiles do OpenStreetMap estão acessíveis
- Em desenvolvimento, pode haver CORS issues (normal em alguns navegadores)

### Service Worker não funciona

- Limpe o cache do navegador
- Verifique o console para erros
- Tente em modo anônimo

### Estilos do Tailwind não aparecem

- Confirme que o PostCSS está configurado
- Verifique se `@tailwind` está no `index.css`
- Reinicie o servidor de desenvolvimento

## 📚 Recursos e Referências

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## 📄 Licença

Este projeto está sob a licença GNU GPL v3. Veja o arquivo `LICENSE` para mais detalhes.

Os assets de design estão sob licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0. Veja `LICENSE.assets` para mais detalhes.

## 👥 Autores

- **Design**: Projeto da matéria Projeto 5 - Mackenzie
- **Desenvolvimento**: Implementação técnica do design

## 🙏 Agradecimentos

- OpenStreetMap pelos tiles de mapa gratuitos
- Comunidade open-source pelas ferramentas incríveis
- Professores e colegas do Mackenzie pelo feedback

---

**Feito com ⚡ e 💚 para um futuro mais sustentável!**

*"A jornada de mil milhas começa com um único passo... ou neste caso, com uma única carga de bateria!"* 🚗⚡

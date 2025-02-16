# 📚 Sistema de Envio de Arquivos para Professores

Este projeto tem como objetivo facilitar a comunicação entre a coordenação e os professores, permitindo o envio e recebimento de arquivos de forma organizada. O sistema possui duas telas principais:

- **Tela da Coordenadora**: Onde a coordenação pode enviar arquivos para os professores.
- **Tela Universal dos Professores**: Onde os professores podem acessar e baixar os arquivos recebidos.

## 🚀 Tecnologias Utilizadas

- **React com TypeScript**
- **Vite** (ferramenta de construção)
- **Tailwind CSS** (estilização)
- **Supabase** (banco de dados e armazenamento de arquivos)

## 📂 Estrutura do Projeto

```
/project
│── src/
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada do aplicativo
│   ├── index.css        # Estilos globais
│   ├── types.ts         # Definição de tipos
│── supabase/
│   ├── migrations/      # Scripts de migração do banco
│── index.html           # Estrutura principal do HTML
│── package.json         # Dependências e scripts
│── vite.config.ts       # Configuração do Vite
│── tailwind.config.js   # Configuração do Tailwind CSS
│── tsconfig.json        # Configuração do TypeScript
```

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Configure o ambiente:**

   - Renomeie o arquivo `.env.example` para `.env` e preencha as credenciais do Supabase.

4. **Execute o projeto:**

   ```sh
   npm run dev
   ```

5. **Acesse no navegador:**

   ```
   http://localhost:5173
   ```

## 📌 Funcionalidades

- Upload de arquivos pela coordenadora.
- Listagem e download de arquivos pelos professores.
- Interface intuitiva e responsiva.

## 📜 Licença

Este projeto é de uso interno e não possui uma licença pública definida.

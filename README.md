# 🏥 SMS System

Este projeto é uma aplicação desenvolvida em **Angular** para gerenciar **pacientes e procedimentos médicos**.
Projetado para facilitar o cadastro, agendamento e controle de procedimentos em estabelecimentos de saúde.

---

## ⚙️ Funcionalidades Principais

  - **Gestão de Pacientes**
      - Cadastro de pacientes
      - Associação de múltiplos procedimentos médicos
      - Histórico e observações clínicas

---

## 💾 Persistência de Dados

Este projeto utiliza o **Local Storage** do navegador para armazenar e recuperar dados de pacientes e procedimentos. Não é necessário configurar um backend ou banco de dados externo para a execução local da aplicação.

---

## 🚀 Instalação e Execução

Siga os passos abaixo para clonar o repositório, instalar as dependências e executar o projeto em seu ambiente local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

  * **Node.js** (versão recomendada: 20.x ou mais recente)
  * **npm** (gerenciador de pacotes do Node.js)
  * **Angular CLI** (instale globalmente se ainda não o tiver):
    ```bash
    npm install -g @angular/cli
    ```

### 1. Clonar o Repositório

Abra o terminal ou prompt de comando e clone o projeto:

```bash
git clone git@github.com:Mendes-Matheus/sms-system.git
cd sms-system
```

### 2. Instalar Dependências

Dentro do diretório do projeto, instale todas as dependências necessárias:

```bash
npm install
```

### 3. Executar a Aplicação

Para iniciar o servidor de desenvolvimento do Angular, utilize o comando:

```bash
ng serve
```

A aplicação será compilada e estará disponível em `http://localhost:4200/` (ou em outra porta, dependendo da sua configuração). O navegador deve abrir automaticamente.


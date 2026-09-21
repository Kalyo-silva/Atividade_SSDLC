# Gerenciador de Reservas de Salas de Aula (Atividade SSDLC)

## Descrição do Projeto
Este projeto é um sistema web desenvolvido para o gerenciamento de reservas de salas de aula. Ele permite o cadastro de salas de aula e a realização de reservas para datas específicas, garantindo que não haja conflitos de agendamento. 

O sistema possui dois perfis de acesso distintos:
- **Administrador**: Responsável por manter (cadastrar, atualizar e remover) as salas de aula disponíveis na instituição.
- **Professor**: Responsável por visualizar salas disponíveis, realizar reservas, listar suas reservas atuais e cancelá-las caso necessário.

## Funcionalidades Principais
- **Autenticação de Usuários**: Login seguro e controle de acesso baseado em papéis (Administrador e Professor).
- **Gestão de Salas (Admin)**: Criação, edição, listagem e remoção de salas de aula.
- **Gestão de Reservas (Professor)**:
  - Visualização de salas disponíveis.
  - Solicitação de reserva para uma data específica.
  - Detecção de conflitos de agendamento: o sistema impede múltiplas reservas para a mesma sala no mesmo dia.
  - Cancelamento de reservas ativas.
  - Conclusão automática de reservas após o término da data.

## Tecnologias Utilizadas
- **Backend**: Node.js com o framework Express.
- **Banco de Dados**: SQLite.
- **Frontend**: HTML5, CSS3 e Vanilla JavaScript (arquivos isolados, sem uso de frameworks de UI).
- **Outras Dependências Importantes**: `bcrypt` (criptografia de senhas), `express-session` (gestão de sessões de usuário), `multer` e `jest` (testes).

## Arquitetura
- Frontend e backend operam de forma isolada.
- Código JavaScript e CSS do cliente estão em arquivos dedicados (`public/js/` e `public/css/`), sem uso de scripts inline ou tags de estilo no HTML.

## Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- npm (gerenciador de pacotes padrão do Node)

## Instalação

1. Clone este repositório (ou faça o download):
   ```bash
   git clone https://github.com/Kalyo-silva/Atividade_SSDLC.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd Atividade_SSDLC
   ```

3. Instale as dependências do Node.js:
   ```bash
   npm install
   ```

## Como Executar o Projeto

1. Inicie o servidor:
   ```bash
   npm start
   ```

2. Acesse a aplicação no seu navegador, no endereço fornecido no terminal (geralmente `http://localhost:3000`).

## Como rodar os testes
Para executar a suíte de testes do projeto via Jest, rode o comando:
```bash
npm test
```
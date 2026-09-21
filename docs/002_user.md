### Projeto: Gerenciador de reservas de salas de aula

## Descrição da funcionalidade: Cadastro e login de usuários

Este arquivo detalhará as funcionalidades de cadastro e login de usuários na aplicação. Todos os demais padrões citados anteriormente deverão ser seguidos para o desenvolvimento desta funcionalidade.

## Lista de requisitos

 - O Cadastro de usuários deverá ser feito informando o nome de usuário, a senha e o tipo de usuário selecionado, podendo ser do tipo 1 - Administrador ou do tipo 2 - Professor.
 - O cadastro de usuários deverá ser disponível apenas para o usuário do tipo administrador.
 - Por padrão, um usuário "admin" do tipo administrador deverá ser cadastrado na criação do projeto, com a senha padrão 123.
 - Após o primeiro login do usuário admin, é necessário solicitar imediatamente a mudança de senha para o usuário administrador.
 - As senhas deverão ser armazenadas no banco de dados da aplicação com a utilização de medidas de segurança como hashing e salting de senhas.
 - Ao realizar um cadastro de usuário, permissões específicas de acesso deverão ser disponibilizadas ao usuário, dependendo do tipo de usuário que foi cadastrado.
 - usuário do tipo 1 - Administrador deverão possuir a capacidade de cadastrar novos usuários, criar salas de aula e atualizar registros de sala de aula existente.
 - Usuários do tipo 2 - Professor não poderão ver a lista de usuários cadastrados, nem realizara criação de sala, podendo apenas realizar a reserva de salas já cadastradas e verificar suas próprias reservas realizadas.
 - O sistema também deverá conter com a opção de um usuário fazer logout da aplicação e realizar o login com uma nova conta.
 
### Projeto: Gerenciador de reservas de salas de aula

## Descrição geral do projeto

Este projeto tem como objetivo o desenvolvimento de um sistema capaz de cadastrar salas de aula e realizar a reserva de salas de aulas cadastradas. O sistema deve conter dois tipos de usuários distintos, um administrador e um professor, onde o adminstrador será responsável pelo cadastro e manutenção das salas de aula, enquanto o professor será responsável pela reserva e gestão das salas reservadas no sistema.

## Caracteristicas técnicas.

 - O sistema será desenvolvido utilizando de técnologias web, com o node.JS e a biblioteca express para as funcionalidades backend.
 - O sistema utilizará do banco de dados sqlite para armazenamento de dados.
 - O frontend será realizado com html, css e javascript puro, sem a utilização de frameworks ou bibliotecas para a sua implementação.
 - O backend e o frontend da aplicação deverão agir de forma isolada um do outro.
 - Todos os scripts Javascript deverão ser criados em um arquivo dedicado. Não é permitido a criação de scripts dentro do html da página.
 - O css da aplicação deverá ser criado em um arquivo dedicado, não permitindo o uso da tag "style" dentro do html da página.
 - O sistema deverá conter autenticação de usuários, contendo dois tipos de usuário: Professor e administrador.
 - Os usuários do tipo administrador poderão apenas cadastrar, atualizar e remover salas de aula.
 - Os usuários do tipo professores poderão apenas reservar, concluir reservas e cancelar reservas de salas de aulas cadastradas pelos administradores.
 
## Fluxo da aplicação

    - O usuário administrador é cadastrado e loga no sistema
    - O usuário administrador realiza o cadastro das salas de aula da instituição, atualiza dados das salas já cadastradas ou remove salas que não estão mais presentes.
    - Outro usuário, do tipo professor realiza o cadastro e login no sistema
    - O usuário professor verifica a lista de salas disponíveis para reserva
    - O usuário professor seleciona a sala de aula que o mesmo deseja reservar
    - O usuário professor informa o dia que a sala deverá ser reservada.
    - O sistema verifica se o dia informado não conflita com outra reserva que foi cadastrada anteriormente para a sala reservada
    - Caso houver um conflito entre as reservas da sala, o sistema informa o usuário professor sobre a outra reserva que foi realizada neste dia, informando o nome do professor que já possui uma reserva cadastrada para o dia desejado.
    - Caso não houver um conflito na data da reserva, o sistema confirma a reserva da sala de aula e torna a sala indisponível para demais reservas no período que foi escolhido.
    - O professor pode listar as suas salas reservadas, verificando as informações de cada reserva
    - Caso desejado, o professor poderá cancelar a reserva da sala.
    - Após o dia da reserva, o sistema deverá concluir a reserva da sala automaticamente.


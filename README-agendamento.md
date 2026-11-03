# Pré-agendamento — Barbearia Rafael Toledo

Página independente para complementar o site institucional. O arquivo index.html não foi alterado.

## Arquivos
- agendamento.html: estrutura da experiência.
- assets/css/agendamento.css: estilos isolados e responsivos.
- assets/js/agendamento.js: etapas, calendário, horários e mensagem do WhatsApp.

## Fluxo
1. Seleção do serviço.
2. Seleção da unidade.
3. Escolha de uma data.
4. Escolha de horário, quando o funcionamento estiver cadastrado.
5. Revisão e envio da solicitação pelo WhatsApp.

## Configuração obrigatória
No início de assets/js/agendamento.js, edite CONFIG para confirmar:
- duração de cada serviço;
- dias e horários de funcionamento das unidades;
- número de WhatsApp correto por unidade;
- antecedência máxima permitida.

A unidade Passo das Pedras está configurada como "horário sob consulta", pois o site institucional não informa seus dias e horários. O botão final usa o WhatsApp principal publicado no site. Confirme se esse é o contato correto para as duas unidades.

## Limitação desta versão
Esta é uma primeira versão de frontend. O calendário gera opções com base no horário cadastrado, mas não consulta uma agenda compartilhada. Portanto, não sabe quais horários já foram ocupados, não bloqueia reservas concorrentes, não grava agendamentos em banco de dados e não confirma horários automaticamente.

A mensagem aberta no WhatsApp é uma solicitação. A equipe precisa confirmar a disponibilidade.

Para oferecer disponibilidade real, impedir conflitos e permitir gestão de agenda, a próxima etapa é integrar um backend (por exemplo, Supabase/PostgreSQL), criar reservas de forma atômica e desenvolver um painel administrativo.

## Publicação
https://gusdias-coder.github.io/barbearia-rafael-toledo/agendamento.html

O index.html permanece intacto nesta entrega. Os botões atuais continuarão com seus destinos existentes até que o destino do botão de agendamento seja alterado separadamente.

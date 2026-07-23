# Barbearia na Régua — Sistema de Agendamento
Sistema web simples para gerir agendamentos de uma barbearia: os clientes marcam o horário através de um formulário, e o barbeiro acompanha tudo numa lista com filtros, busca e estatísticas. Feito em **HTML, CSS e JavaScript puro**, sem dependências de backend — os dados ficam guardados no `localStorage` do navegador.

## Funcionalidades
- **Agendamento de horários** com nome, telefone, serviço, data e observações
- **Validação do telefone**: aceita apenas números e exige exactamente 9 dígitos (formato angolano, ex: `923456789`)
- **Horários disponíveis dinâmicos**: os horários já reservados numa data deixam de aparecer no select
- **Bloqueio de datas passadas** e de horários duplicados
- **Lista de agendamentos** com busca por nome/telefone e filtro por tipo de serviço
- **Estatísticas rápidas**: total de agendamentos e agendamentos do dia
- **Cancelamento** de um agendamento individual ou limpeza total da lista
- **Notificações (toast)** de sucesso, erro e aviso
- **Layout responsivo**, adaptado para telemóvel
- **Ícones** com [Font Awesome](https://fontawesome.com/)

## Tecnologias
- HTML5
- CSS3 (variáveis CSS, grid e flexbox)
- JavaScript (vanilla, sem frameworks)
- Font Awesome (via CDN)
- `localStorage` para persistência de dados no navegador

## Estrutura do projeto
```
barbearia/
├── index.html   # Estrutura da página
├── style.css    # Estilos e layout
├── script.js    # Lógica de agendamento e validações
└── README.md
```

## Como usar
1. Abre o ficheiro `index.html` diretamente no navegador — não é preciso servidor nem instalação.
> Como os dados ficam guardados no `localStorage`, cada navegador/dispositivo mantém a sua própria lista de agendamentos.

## Notas
- Os horários disponíveis vão das **09:00 às 20:00**, em intervalos de 1 hora.
- O número de telemóvel é guardado apenas com os 9 dígitos; o prefixo `+244` é fixo na interface.
- Este projeto é ideal como ponto de partida — pode ser evoluído para usar uma base de dados real e um backend (ex: Node.js + banco de dados) caso se pretenda partilhar os agendamentos entre vários dispositivos.

## 📄 Licença
Livre para usar e adaptar como quiseres.
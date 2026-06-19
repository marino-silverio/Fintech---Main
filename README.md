#  Metal Wallet - Dashboard Fintech

Este é um MVP (Minimum Viable Product) de um aplicativo de controle financeiro. O projeto consiste em uma interface de Dashboard interativa (Single Page Application) que permite ao usuário gerenciar seus ganhos e gastos através de múltiplas carteiras. 

Projeto desenvolvido como requisito de avaliação acadêmica.

##  Funcionalidades

* **Gerenciamento de Múltiplas Carteiras:** Crie, renomeie e exclua carteiras independentes para separar diferentes fontes de renda ou projetos.
* **Registro de Transações:** Adicione ganhos e gastos com descrição, valor e data específica.
* **Edição e Exclusão (CRUD):** Clique em qualquer transação no histórico para editar seus valores ou excluí-la.
* **Filtro de Período Dinâmico:** Selecione uma "Data Inicial" e "Data Final" para visualizar o balanço exato de um período específico.
* **Cálculo Automático:** Os cards de Ganho, Gasto e Balanço são atualizados em tempo real a cada nova inserção ou filtro aplicado.
* **Persistência de Dados (Local):** Utiliza o `localStorage` do navegador. As transações e carteiras criadas não são perdidas ao atualizar a página.
* **Design Responsivo:** Interface totalmente adaptada para dispositivos móveis, tablets e desktops (Mobile First).

##  Tecnologias Utilizadas

O projeto foi construído focando em uma execução local simplificada, sem a necessidade de builds ou configurações de servidores:

* **HTML5 & CSS3:** Estrutura semântica e estilização global.
* **JavaScript (Vanilla):** Lógica de negócios, manipulação do DOM e gerenciamento de estado (localStorage).
* **Tailwind CSS (via CDN):** Framework utilitário usado para a construção de todo o layout e responsividade.
* **Flatpickr:** Biblioteca leve utilizada para a renderização dos calendários de seleção de datas.
* **FontAwesome:** Biblioteca de ícones.

##  Estrutura de Arquivos

```text
metal-wallet/
├── index.html   # Estrutura principal da interface e importação das bibliotecas CDN
├── style.css    # Regras globais de CSS, fontes e customização da barra de rolagem
├── script.js    # Lógica de funcionamento, arrays de dados e localStorage
└── README.md    # Documentação do projeto

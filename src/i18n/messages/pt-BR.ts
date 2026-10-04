import type { Messages } from './en';

export const ptBR: Messages = {
  meta: {
    title: 'Skill Icons',
    description: 'Mostre suas habilidades no seu GitHub ou currículo com facilidade!',
  },
  header: {
    title: 'Skill Icons',
    tagline: 'monte sua pilha → cole no README',
    language: 'Idioma',
    toDark: 'Mudar para tema escuro',
    toLight: 'Mudar para tema claro',
    github: 'github',
  },
  steps: {
    choose: '1. Escolha os ícones',
    chooseDescription: 'Clique para adicionar ou remover. A ordem é mantida.',
    customize: '2. Personalize',
    copy: '3. Copie',
    copyDescription: 'Cole no seu README. O link desta página também guarda sua seleção.',
    emptyPreview: 'Selecione pelo menos um ícone para ver a prévia.',
  },
  picker: {
    searchPlaceholder: (count, category) =>
      `Buscar ${count} ícones${category ? ` de ${category}` : ''}…`,
    searchLabel: 'Buscar ícones',
    filterLabel: 'Filtrar por categoria',
    all: 'Todos',
    noResults: 'Nenhum ícone encontrado.',
    noResultsFor: query => `Nenhum ícone encontrado para “${query}”.`,
  },
  categories: {
    language: 'Linguagens',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Bancos de dados',
    cloud: 'Nuvem',
    devops: 'DevOps',
    tooling: 'Ferramentas',
    testing: 'Testes',
    observability: 'Observabilidade',
    auth: 'Autenticação',
    ide: 'IDEs',
    ai: 'IA',
    design: 'Design',
    game: 'Jogos',
    payments: 'Pagamentos',
    os: 'SO e hardware',
    social: 'Redes sociais',
    productivity: 'Produtividade',
  },
  selected: {
    empty: 'Nenhum ícone selecionado ainda. Escolha alguns na lista.',
    count: count =>
      `${count} ${count === 1 ? 'selecionado' : 'selecionados'} · use as setas para reordenar`,
    clearAll: 'Limpar tudo',
    moveLeft: name => `Mover ${name} para a esquerda`,
    moveRight: name => `Mover ${name} para a direita`,
    remove: name => `Remover ${name}`,
  },
  options: {
    iconTheme: 'Tema dos ícones',
    dark: 'Escuro',
    light: 'Claro',
    perLine: 'Ícones por linha',
  },
  output: {
    previewAlt: 'Prévia dos ícones selecionados',
    badgeAlt: 'Minhas habilidades',
    htmlCentered: 'HTML (centralizado)',
    copy: 'Copiar',
    copied: 'Copiado para a área de transferência',
    copyFailed: 'Não foi possível copiar. Selecione o texto e copie manualmente.',
    libraryTitle: 'Use como biblioteca',
    libraryDescription:
      'Prefere componentes em vez de links de imagem? Instale o pacote, disponível para React, Vue, Svelte, Solid, Angular, Astro e Web Components:',
  },
};

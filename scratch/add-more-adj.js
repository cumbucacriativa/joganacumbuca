const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/aleatoriedades.csv');

const extraAdjetivos = [
  "Sempre olhando no relógio", "Perguntando o significado de tudo", "Segurando o riso com a mão na boca",
  "Imitando o sotaque de quem fala", "Olhando pros lados com desconfiança", "Sempre checando o bolso",
  "Ajustando o óculos a cada fala", "Dando risadinha no final de cada frase", "Dizendo que já sabia de tudo",
  "Tentando adivinhar o final das frases dos outros", "Acreditando em qualquer mentira contada", "Fazendo sinal de joia pra tudo",
  "Sempre oferecendo ajuda desajeitada", "Inventando estatísticas na hora", "Falando como se estivesse num comercial",
  "Com medo de pisar nas linhas do chão", "Sempre achando que esqueceu o fogão ligado", "Tirando fotos imaginárias de tudo",
  "Com hábito de concordar balançando a cabeça", "Fazendo suspense antes de responder", "Dizendo 'e digo mais!' o tempo todo",
  "Dizendo 'complicado isso aí' em toda pausa", "Chamando todo mundo de 'campeão'", "Usando termos de internet na vida real",
  "Aconselhando todos a beberem mais água", "Perguntando o signo de todo mundo", "Que não consegue guardar um segredo por 5 segundos",
  "Que fala alto achando que está sussurrando", "Que tenta dar abraço em desconhecidos", "Que só responde com letras de música",
  "Que acha que tudo é um teste surpresa", "Que fica procurando onde está o microfone", "Que tenta achar defeito em tudo",
  "Que elogia excessivamente coisas simples", "Que faz drama quando perde um objeto", "Que acha que é o protagonista da cena",
  "Que dá conselhos de relacionamentos sem nunca ter namorado", "Que inventa regras de etiquetas inexistentes",
  "Que acha que o ambiente é mal assombrado", "Que tenta adivinhar o signo pelo formato do rosto",
  "Que vive achando moedas no chão", "Que conta histórias de parentes distantes", "Que usa ditados populares errados",
  "Que tenta resolver conflitos com abraços", "Que se emociona com comerciais de TV", "Que tem medo de bonecos de pelúcia",
  "Que fala com objetos inanimados", "Que tenta imitar barulhos de animais", "Que faz suspense para revelar coisas banais",
  "Que tem orgulho de coisas totalmente irrelevantes", "Que vive prometendo presentes que nunca entrega"
];

let scriptContent = fs.readFileSync(__filename, 'utf8');

// Adiciona os extras ao array de adjetivos
scriptContent = scriptContent.replace(
  `"Com risada contagiante", "Que se assusta fácil", "Super competitivo", "Com pose de astro do rock", "Que só fala gírias dos anos 80",
  "Que lê pensamentos errados", "Que acha que é a pessoa mais famosa do mundo", "Que anda dançando mambo", "Que fala igual ao Yoda",
  "Com mania de arrumar o cabelo", "Com tique de estalar os dedos", "Que chora quando fica feliz", "Que ri quando fica brabo",
  "Desconfiado de conspirações", "Acreditando em ETs na terra", "Sentindo frio nos pés", "Tentando disfarçar bocejos",
  "Fazendo propaganda de si mesmo", "Com fobia de gravatas", "Com pavor de chiclete", "Acreditando ser de origem nobre",
  "Falando rápido demais pra acompanhar", "Fazendo pausa dramática a cada frase", "Com gargalhada alta e escandalosa",
  "Piscando um olho só sem querer", "Que não aguenta ver poeira", "Que quer arrumar a roupa dos outros",
  "Com hábito de estalar o pescoço", "Sempre oferecendo conselho não solicitado",
  "Sempre olhando no relógio", "Perguntando o significado de tudo", "Segurando o riso com a mão na boca", "Imitando o sotaque de quem fala", "Olhando pros lados com desconfiança", "Sempre checando o bolso", "Ajustando o óculos a cada fala", "Dando risadinha no final de cada frase", "Dizendo que já sabia de tudo", "Tentando adivinhar o final das frases dos outros", "Acreditando em qualquer mentira contada", "Fazendo sinal de joia pra tudo", "Sempre oferecendo ajuda desajeitada", "Inventando estatísticas na hora", "Falando como se estivesse num comercial", "Com medo de pisar nas linhas do chão", "Sempre achando que esqueceu o fogão ligado", "Tirando fotos imaginárias de tudo", "Com hábito de concordar balançando a cabeça", "Fazendo suspense antes de responder", "Dizendo 'e digo mais!' o tempo todo", "Dizendo 'complicado isso aí' em toda pausa", "Chamando todo mundo de 'campeão'", "Usando termos de internet na vida real", "Aconselhando todos a beberem mais água", "Perguntando o signo de todo mundo", "Que não consegue guardar um segredo por 5 segundos", "Que fala alto achando que está sussurrando", "Que tenta dar abraço em desconhecidos", "Que só responde com letras de música", "Que acha que tudo é um teste surpresa", "Que fica procurando onde está o microfone", "Que tenta achar defeito em tudo", "Que elogia excessivamente coisas simples", "Que faz drama quando perde um objeto", "Que acha que é o protagonista da cena", "Que dá conselhos de relacionamentos sem nunca ter namorado", "Que inventa regras de etiquetas inexistentes", "Que acha que o ambiente é mal assombrado", "Que tenta adivinhar o signo pelo formato do rosto", "Que vive achando moedas no chão", "Que conta histórias de parentes distantes", "Que usa ditados populares errados", "Que tenta resolver conflitos com abraços", "Que se emociona com comerciais de TV", "Que tem medo de bonecos de pelúcia", "Que fala com objetos inanimados", "Que tenta imitar barulhos de animais", "Que faz suspense para revelar coisas banais", "Que tem orgulho de coisas totalmente irrelevantes", "Que vive prometendo presentes que nunca entrega"`,
  `"Com risada contagiante", "Que se assusta fácil", "Super competitivo", "Com pose de astro do rock", "Que só fala gírias dos anos 80",
  "Que lê pensamentos errados", "Que acha que é a pessoa mais famosa do mundo", "Que anda dançando mambo", "Que fala igual ao Yoda",
  "Com mania de arrumar o cabelo", "Com tique de estalar os dedos", "Que chora quando fica feliz", "Que ri quando fica brabo",
  "Desconfiado de conspirações", "Acreditando em ETs na terra", "Sentindo frio nos pés", "Tentando disfarçar bocejos",
  "Fazendo propaganda de si mesmo", "Com fobia de gravatas", "Com pavor de chiclete", "Acreditando ser de origem nobre",
  "Falando rápido demais pra acompanhar", "Fazendo pausa dramática a cada frase", "Com gargalhada alta e escandalosa",
  "Piscando um olho só sem querer", "Que não aguenta ver poeira", "Que quer arrumar a roupa dos outros",
  "Com hábito de estalar o pescoço", "Sempre oferecendo conselho não solicitado",
  ` + extraAdjetivos.map(a => `"${a}"`).join(', ')
);

fs.writeFileSync(__filename, scriptContent, 'utf8');

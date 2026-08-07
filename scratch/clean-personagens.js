const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/aleatoriedades.csv');
const rawCSV = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift().map((h) => h.trim());
  return {
    header,
    rows: rows
      .filter((r) => r.some((v) => v.trim() !== ''))
      .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || '').trim()])))
  };
}

const { header, rows } = parseCSV(rawCSV);

const personagensLimpos = [
  // Profissões & Ocupações puras (1-125)
  "Bombeiro", "Chef de cozinha", "Detetive", "Turista", "Avó", "Avô", "Astronauta", "Professor", "Pirata", "Cientista",
  "Vendedor ambulante", "Dona de casa", "Pedreiro", "Lanterninha de cinema", "Flanelinha", "Porteiro", "Garçom", "Taxista",
  "Vendedor de coxinha", "Padeiro", "Professor de autoescola", "Síndico", "Motorista de ônibus", "Feirante", "Carteiro",
  "Encanador", "Dentista", "Veterinário", "Enfermeira", "Advogado", "Arquiteto", "Eletricista", "Jardineiro", "Mecânico",
  "Barbeiro", "Caixa de supermercado", "Entregador de aplicativo", "Motorista de Uber", "Jornalista", "Fotógrafo",
  "Personal trainer", "Tatuador", "Manicure", "Lixeiro", "Coveiro", "Gari", "Costureira", "Pintor de parede", "Zelador",
  "Segurança", "Salva-vidas", "Ascensorista", "Guia turístico", "Cerimonialista", "Organizador de festas", "Apresentador de TV",
  "Repórter", "Locutor de rádio", "DJ", "Sommelier", "Crítico gastronômico", "Barista", "Churrasqueiro", "Mestre de obras",
  "Instalador de ar-condicionado", "Chaveiro", "Dedetizador", "Vidraceiro", "Sapateiro", "Relojoeiro", "Estofador", "Guinchador",
  "Vendedor de colchão", "Corretor de imóveis", "Gerente de banco", "Contador", "Consultor de moda", "Cabeleireiro",
  "Maquiador", "Esteticista", "Massagista", "Fisioterapeuta", "Nutricionista", "Psicólogo", "Coach", "Inspetor de escola",
  "Diretor de escola", "Merendeira", "Monitor de perua escolar", "Bibliotecário", "Auxiliar de limpeza", "Piloto de avião",
  "Comissário de bordo", "Engenheiro civil", "Programador", "Designer gráfico", "Biólogo", "Químico", "Físico", "Geólogo",
  "Arqueólogo", "Historiador", "Filósofo", "Sociólogo", "Astrônomo", "Meteorologista", "Zoólogo", "Botânico", "Oceanógrafo",
  "Antropólogo", "Tradutor", "Intérprete", "Dublador", "Ator", "Atriz", "Diretor de cinema", "Roteirista", "Produtor musical",
  "Instrumentista", "Pianista", "Violinista", "Baterista", "Baixista", "Guitarrista", "Saxofonista", "Cantor", "Bailarino",

  // Pop Culture, Filmes, Séries & Animes puros (126-250)
  "Harry Potter", "Darth Vader", "Batman", "Sherlock Holmes", "Coringa", "Jack Sparrow", "Barbie", "Shrek", "Homem-Aranha",
  "Wandinha Addams", "Gandalf", "Mario", "Donatello", "Pikachu", "Bob Esponja", "Patrick Estrela", "Seu Sirigueijo", "Lula Molusco",
  "Chaves", "Quico", "Seu Madruga", "Dona Florinda", "Professor Girafales", "Chapolin Colorado", "Scooby-Doo", "Salsicha", "Velma",
  "Freddie Mercury", "Michael Jackson", "Elvis Presley", "Mickey Mouse", "Pateta", "Piu-Piu", "Frajola", "Pica-Pau", "Tom", "Jerry",
  "Homer Simpson", "Bart Simpson", "Lisa Simpson", "Seu Burns", "Marge Simpson", "Buzz Lightyear", "Woody", "WALL-E", "Po",
  "Burro do Shrek", "Gato de Botas", "Elsa", "Olaf", "Moana", "Maui", "Aladdin", "Gênio da Lâmpada", "Jafar", "Simba", "Timão", "Pumba",
  "Cinderela", "Branca de Neve", "Capitão América", "Homem de Ferro", "Thor", "Hulk", "Viúva Negra", "Doutor Estranho", "Deadpool",
  "Wolverine", "Pantera Negra", "Baby Yoda", "Mandaloriano", "Luke Skywalker", "Yoda", "Chewbacca", "R2-D2", "Neo", "Morpheus",
  "Gollum", "Legolas", "Gimli", "Willy Wonka", "Minion", "Gru", "Sonic", "Tails", "Dr. Eggman", "Naruto", "Goku", "Vegeta",
  "Sailor Moon", "Luffy", "Zoro", "Sanji", "Nami", "Tanjiro", "Nezuko", "Gojo", "Sukuna", "Light Yagami", "L", "Saitama", "Deku",
  "All Might", "Edward Elric", "Alphonse Elric", "Levi Ackerman", "Eren Yeager", "Mikasa Ackerman", "Spike Spiegel", "Guts",
  "Jotaro Kujo", "Seiya", "Shiryu", "Hyoga", "Shun", "Ikki", "Yusuke Urameshi", "Inuyasha", "Sesshomaru", "Kenshin Himura",
  "Ash Ketchum", "Charizard", "Mewtwo",

  // Históricos, Literatura & Mitologia puros (251-375)
  "Napoleão Bonaparte", "Cleópatra", "Albert Einstein", "Júlio César", "Leonardo da Vinci", "William Shakespeare", "Charlie Chaplin",
  "Dom Pedro I", "Princesa Isabel", "Tiradentes", "Santos Dumont", "Lampião", "Maria Bonita", "Zumbi dos Palmares", "Getúlio Vargas",
  "Machado de Assis", "Clarice Lispector", "Monteiro Lobato", "Anita Garibaldi", "Padre Cícero", "Alexandre o Grande", "Joana d'Arc",
  "Isaac Newton", "Galileu Galilei", "Marie Curie", "Beethoven", "Mozart", "Vincent van Gogh", "Pablo Picasso", "Frida Kahlo",
  "Salvador Dalí", "Sigmund Freud", "Charles Darwin", "Karl Marx", "Adam Smith", "Sócrates", "Platão", "Aristóteles", "Pitágoras",
  "Arquimedes", "Júlio Verne", "H.G. Wells", "Agatha Christie", "Edgar Allan Poe", "Dom Quixote", "Sancho Pança", "Robin Hood",
  "Rei Arthur", "Merlim", "Guinevere", "Conan", "Hércules", "Zeus", "Poseidon", "Hades", "Afrodite", "Atena", "Apolo", "Medusa",
  "Minotauro", "Centauro", "Fênix", "Loki", "Odin", "Anúbis", "Esfinge", "Faraó", "Gladiador", "Centurião", "Espartano", "Viking",
  "Corsário", "Ninja", "Samurai", "Geisha", "Imperador chinês", "Monge tibetano", "Cavalheiro medieval", "Bufão do rei", "Alquimista",
  "Cangaceiro", "Boiadeiro", "Bandeirante", "Pajé", "Curupira", "Saci Pererê", "Mula sem Cabeça", "Iara", "Caipora", "Boto cor-de-rosa",
  "Negrinho do Pastoreio", "Cabeça de Cuia", "Mapinguari", "Chapeuzinho Vermelho", "Lobo Mau", "João", "Maria", "Bela", "Fera",
  "Peter Pan", "Capitão Gancho", "Sininho", "Pinóquio", "Gepeto", "Alvo Dumbledore", "Severo Snape", "Ron Weasley", "Hermione Granger",
  "Voldemort", "Sirius Black", "Frodo Baggins", "Samwise Gamgee", "Aragorn", "Sauron", "Bilbo Baggins", "Katniss Everdeen", "Peeta Mellark",
  "Edward Cullen", "Bella Swan", "Jacob Black", "Tarzan",

  // Tipos Sociais & Seres Fantásticos puros (376-500)
  "Tio do pavê", "Primo", "Sogra", "Cunhado", "Vizinha", "Blogueira", "Influenciador", "Gamer", "Otaku", "Hipster", "Faria Limer",
  "Coach", "Tia do Zap", "Jovem místico", "Vegano", "Sommelier de cerveja", "Crossfiteiro", "Hater", "Troll", "Nerd", "Cosplayer",
  "Fã de pop", "Pagodeiro", "Rocker", "Sertanejo", "Funkeiro", "Rapper", "Hippie", "Mãe de pet", "Pai de planta", "Acumulador",
  "Minimalista", "Mão de vaca", "Ostentador", "Comprador compulsivo", "Fura-fila", "Passageiro", "Carona", "Piloto de fuga",
  "Ciclista", "Skatista", "Surfista", "Maratonista", "Neta", "Sobrinho", "Amigo da onça", "Falso magro", "Atleta de fim de semana",
  "Apostador", "Sonhador", "Hipnotizador", "Mágico", "Mestre de RPG", "Jogador de bingo", "Velhinha", "Tio da sinuca", "Churrasqueiro",
  "Promoter", "Segurança de balada", "Pipoqueiro", "Baiana do acarajé", "Vendedor de algodão doce", "Padeiro de sonho", "Barman",
  "Atendente de telemarketing", "Suporte técnico", "Frentista", "Lavador de carro", "Vendedor de consórcio", "Fiscal da prefeitura",
  "Agente de trânsito", "Policial", "Detetive particular", "Espião", "Agente secreto", "Vigilante", "Técnico de TV", "Entregador de gás",
  "Vendedor de pamonha", "Vendedor de churros", "Vampiro", "Fantasma", "Alienígena", "Super-herói", "Robô", "Monstro", "Zumbi",
  "Lutador de sumô", "ET", "Papai Noel", "Sereia", "Cozinheiro", "Duende", "Gnomo", "Fada madrinha", "Bruxa", "Lobisomem", "Cérbero",
  "Dragão", "Gárgula", "Unicórnio", "Pégaso", "Múmia", "Frankenstein", "Drácula", "Ciborgue", "Androide", "Inteligência Artificial",
  "Viajante do tempo", "Homem invisível", "Telepatante", "Mutante", "Homem-Elástico", "Homem de Pedra", "Velocista",
  "Imperador intergaláctico", "Caçador de recompensas", "Cão espacial", "Gato gigante", "Pé Grande", "Chupacabra",
  "Abominável Homem das Neves", "Kraken", "Anjo da guarda", "Demônio", "Poltergeist", "Gênio da lâmpada", "Fauno", "Sátiro",
  "Ciclope", "Gorgona", "Troll", "Ogro", "Elfo", "Leprechaun", "Espantalho", "Boneco de neve", "Homem de Palha", "Homem de Lata",
  "Leão", "Homem de Madeira", "Rei Midas", "Planta carnívora", "Exorcista", "Piloto de OVNI", "Tarzan", "Bebê", "Velho sábio", "Rei", "Rainha"
];

console.log(`Personagens limpos: ${personagensLimpos.length}`);

// Garantir exatamente 500 únicos
const unicos = [...new Set(personagensLimpos)];
console.log(`Únicos: ${unicos.length}`);

while (unicos.length < 500) {
  unicos.push(`Personagem ${unicos.length + 1}`);
}

const finalP = unicos.slice(0, 500);

let csvOutput = "Personagem,Localizacao,Filme / Livro,Adjetivo / Característica\n";

for (let i = 0; i < 500; i++) {
  const r = rows[i] || {};
  const p = finalP[i].replace(/,/g, '');
  const l = (r['Localizacao'] || 'Praia').replace(/,/g, '');
  const fl = (r['Filme / Livro'] || 'O Poderoso Chefão').replace(/,/g, '');
  const ac = (r['Adjetivo / Característica'] || 'Tagarela').replace(/,/g, '');

  csvOutput += `"${p}","${l}","${fl}","${ac}"\n`;
}

fs.writeFileSync(csvPath, csvOutput, 'utf8');
console.log(`aleatoriedades.csv atualizado com sucesso! Coluna 'Personagem' limpa sem adjetivos e com 500 nomes 100% únicos!`);

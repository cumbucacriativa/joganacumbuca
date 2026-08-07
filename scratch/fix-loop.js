const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/aleatoriedades.csv');

// Ler o script anterior para pegar as constantes
const scriptContent = fs.readFileSync(__filename, 'utf8');

// Ajustar o loop para fallback seguro
let code = scriptContent.replace(
  `  const p = finalP[i].replace(/,/g, '');
  const l = finalL[i].replace(/,/g, '');
  const fl = finalFL[i].replace(/,/g, '');
  const ac = finalAC[i].replace(/,/g, '');`,
  `  const p = (finalP[i] || 'Personagem').replace(/,/g, '');
  const l = (finalL[i] || 'Local').replace(/,/g, '');
  const fl = (finalFL[i] || 'Filme').replace(/,/g, '');
  const ac = (finalAC[i] || 'Característica').replace(/,/g, '');`
);

fs.writeFileSync(__filename, code, 'utf8');

const fs = require('fs');
const path = require('path');

// Pasta de destino
const assetsDir = path.join(__dirname, 'assets');

// Criar pasta 'assets' se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('📁 Pasta "assets" criada com sucesso!');
}

// Base64 de um PNG minimalista de cor sólida escura (#111827) correspondente ao tema do MindFlow
const darkPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

// Base64 de um PNG minimalista totalmente transparente (para o ícone adaptativo foreground)
const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const assetsToCreate = [
  { name: 'icon.png', data: darkPngBase64 },
  { name: 'splash.png', data: darkPngBase64 },
  { name: 'adaptive-icon.png', data: transparentPngBase64 },
  { name: 'favicon.png', data: darkPngBase64 }
];

assetsToCreate.forEach(asset => {
  const filePath = path.join(assetsDir, asset.name);
  fs.writeFileSync(filePath, Buffer.from(asset.data, 'base64'));
  console.log(`✅ Arquivo criado: assets/${asset.name}`);
});

console.log('🎉 Todos os assets necessários para o Prebuild do Expo foram criados com sucesso!');

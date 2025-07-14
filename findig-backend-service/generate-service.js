const fs = require('fs');
const Handlebars = require('handlebars');

// helper
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
const renderTemplate = (templatePath, data) => {
  const content = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(content);
  return template(data);
};

// load spec
const spec = JSON.parse(fs.readFileSync('spec.json', 'utf-8'));

// prepare all routes (for building index.js)
const allRoutes = spec.controllers.map(controller => ({
  name: controller.name,
  methods: controller.methods
}));

// generate each controller
spec.controller.forEach(controller => {
  const { name, service, repository, unitTest } = controller;

  ensureDir('src/controllers');
  ensureDir('src/services');
  ensureDir('src/repository');
  ensureDir('src/tests');

  fs.writeFileSync(
    `src/controllers/${name}Controller.js`,
    renderTemplate('templates/controller.js.hbs', { name })
  );

  if (service) {
    fs.writeFileSync(
      `src/services/${name}Service.js`,
      renderTemplate('templates/service.js.hbs', { name })
    );
  }

  if (repository) {
    fs.writeFileSync(
      `src/repository/${name}Repository.js`,
      renderTemplate('templates/repository.js.hbs', { name })
    );
  }

  if (unitTest) {
    fs.writeFileSync(
      `src/tests/${name}Service.test.js`,
      renderTemplate('templates/test.js.hbs', { name })
    );
  }

  console.log(`✅ Generated files for ${name}`);
});

// 🚀 generate or update route index.js from template
ensureDir('src/routes');

fs.writeFileSync(
  'src/routes/index.js',
  renderTemplate('templates/route-index.js.hbs', { controllers: allRoutes })
);

console.log('✅ Updated src/routes/index.js');

const dotenv = require('dotenv').config();
const { src, dest, watch } = require("gulp");
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const sass = require("gulp-sass");
const cssnano = require("cssnano");
const plugins = require("gulp-load-plugins")();
const autoprefixer = require("autoprefixer");
const npmRun = require("npm-run");
const browserSync = require("browser-sync").create();
const { argv } = require("yargs");

const themeConfig = fs.readFileSync("./config.yml").toString().replace(/(\r\n|\n|\r)/gm, "");
const storeData = themeConfig.split('store:')[1].split('.myshopify.com')[0].trim();

let themeID = themeConfig.split('theme_id:')[1].trim();
if (themeID.includes('"') || themeID.includes("'")) {
  themeID = themeID.split('"')[1];
  themeID = themeID.split("'")[1];
}
const config = {
  configCSSFile: process.env.CONFIGCSSFILE || 'default',
  configCSSMinFile: process.env.CONFIGCSSMINFILE || 'default',
  configScriptFile: process.env.CONFIGSCRIPTFILE || 'default',
  configScriptMinFile: process.env.CONFIGSCRIPTMINFILE || 'default',
  livePreload: JSON.parse(process.env.LIVERELOAD || 'false'),
  directory: (process.env.DIR || 'BLANK')
}

const shopifyHost = `https://${storeData}.myshopify.com`;
const proxy = `${shopifyHost}`;
const port = argv.port || 9005;
const assetsFolder = config.directory == 'BLANK' ? 'assets' : (config.directory.toLowerCase() + '/assets');

// CSS Func
function buildCss(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`${path.basename(filePath)} does not exist.`);
    return;
  }

  const processTask = [];

  processTask.push(new Promise((resolve, reject) => {
    src(filePath)
      .pipe(plugins.sourcemaps.init())
      .pipe(sass.sync().on("error", sass.logError))
      .pipe(
        plugins.postcss([
          cssnano({ safe: true, autoprefixer: true }),
          autoprefixer({ overrideBrowserslist: ["safari >= 10", "last 2 version", "ios >= 10", "not ie >0", "not dead"] })
        ]),
      )
      .pipe(sass({ outputStyle: config.configCSSFile == 'minify' ? 'compressed' : 'expanded' }))
      .on("error", function (err) { console.log(err.toString()); })
      .pipe(plugins.rename(path.basename(filePath, ".scss") + ".css"))
      .pipe(dest(assetsFolder))
      .on("end", function () {
        console.log(path.basename(filePath) + ": Finish");
      });
  }))

  if (config.configCSSMinFile == 'default') {
    processTask.push(new Promise((resolve, reject) => {
      src(filePath)
        .pipe(plugins.sourcemaps.init())
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(
          plugins.postcss([
            cssnano({ safe: true, autoprefixer: true }),
            autoprefixer({ overrideBrowserslist: ["safari >= 10", "last 2 version", "ios >= 10", "not ie >0", "not dead"] })
          ])
        )
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(plugins.rename(path.basename(filePath, ".scss") + ".min.css"))
        .pipe(dest(assetsFolder))
    }));
  }

  return Promise.all(processTask);
}

function cssTask(filePath) {
  let fileName = path.basename(filePath, ".scss");
  let sourceTree = JSON.parse(fs.readFileSync("./app.css.config.json"));

  Object.keys(sourceTree)
    .filter((item) => sourceTree[item].indexOf(fileName) != -1)
    .map((item) => {
      let filePath = "app/styles/" + item + ".scss";
      buildCss(filePath);
    });
}

async function removeCss(filePath) {
  const directionLink = path.basename(filePath, ".scss") + ".css";

  fs.unlinkSync(assetsFolder + "/" + directionLink);

  if (config.configCSSMinFile == 'default') {
    fs.unlinkSync(assetsFolder + "/" + directionLink.replace(".css", ".min.css"));
  }

  console.log("Deleted " + path.basename(filePath));
}


// JS Func
async function buildScripts(entryPoints) {
  if (!entryPoints.length) return;

  let entryOnlyMinify = [];

  if (typeof entryPoints === "string") {
    entryPoints = [entryPoints];
  }

  entryPoints = entryPoints.filter((entry) => {
    return entry.includes(".min.js") ? (entryOnlyMinify.push(entry), false) : true;
  });


  // unminify
  let result = await esbuild.build({
    entryPoints,
    bundle: true,
    minify: config.configScriptFile == 'minify',
    legalComments: "inline",
    outdir: path.resolve(__dirname, "./", assetsFolder),
  });

  if (result.errors.length) {
    console.error(result.error[0]);
    return;
  }

  entryPoints.forEach(entry => {
    console.log(path.basename(entry) + ": Finish");
  })

  // Minify
  if (config.configScriptMinFile != 'default')
    return;

  entryPoints = entryPoints.reduce((accu, value) => {
    accu[`${path.basename(value, ".js")}.min`] = value;
    return accu;
  }, {});

  entryOnlyMinify = entryOnlyMinify.reduce((accu, value) => {
    accu[`${path.basename(value, ".min.js")}.min`] = value;
    return accu;
  }, {});

  return esbuild
    .build({
      entryPoints: {
        ...entryPoints,
        ...entryOnlyMinify,
      },
      bundle: true,
      minify: true,
      legalComments: "inline",
      outdir: path.resolve(__dirname, "./", assetsFolder),
    })
    .then((result) => {
      if (result.errors.length) {
        console.error(result.error[0]);
      } else {
        return [
          Object.keys(entryPoints).map((entry) => {
            return entry.split(".")[0];
          }),
          Object.keys(entryOnlyMinify).map((entry) => {
            return path.basename(entry, ".min.js");
          }),
        ];
      }
    });
}

function scriptTask(filePath) {
  let fileName = path.basename(filePath, ".js");
  let sourceTree = JSON.parse(fs.readFileSync("./app.js.config.json"));

  const result = Object.keys(sourceTree)
    .filter((item) => {
      return sourceTree[item].indexOf(fileName) != -1;
    })
    .map((item) => {
      return "./app/scripts/" + item + ".js";
    });

  result.length && buildScripts(result);
}

// const directoryPath = "./app/scripts/";
// let filePaths = [];
// // 
// fs.readdir(directoryPath, (err, files) => {
//   if (err) {
//     console.error("Error reading directory:", err);
//     return;
//   }

//   // Filter for JavaScript files
//   const jsFiles = files.filter((file) => path.extname(file) === ".js");

//   // Get the full file paths
//   filePaths = jsFiles.map((file) => path.join(directoryPath, file));

// });

// function reloadScriptTask(filePaths) {
//   buildScripts(filePaths);
// }

// 
async function removeScript(filePath) {
  fs.unlinkSync(assetsFolder + "/" + path.basename(filePath));

  if (config.configScriptMinFile != 'default')
    fs.unlinkSync(assetsFolder + "/" + path.basename(filePath).replace(".js", ".min.js"));

  console.log("Deleted " + path.basename(filePath));
}


exports.serve = async () => {

  config.livePreload && browserSync.init({
    proxy,
    port,
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        },
      },
    },
  });

  watch("./app/scripts/**/**/*.js").on("change", scriptTask);
  // watch("./app/scripts/*.js").on("change", () => {
  //   reloadScriptTask(filePaths);
  // });
  watch("./app/scripts/*.js").on("change", buildScripts);
  watch("./app/scripts/*.js").on("unlink", removeScript);
  watch("./app/scripts/*.js").on("add", buildScripts);

  watch("./app/styles/.common/*.scss").on("change", cssTask);
  watch("./app/styles/**/**/*.scss").on("change", cssTask);
  watch("./app/styles/*.scss").on("change", buildCss);
  watch("./app/styles/*.scss").on("unlink", removeCss);
  watch("./app/styles/*.scss").on("add", buildCss);

  const wait = { run: null };

  watch(".tmp/theme.update").on("change", () => {
    if (wait.run !== null)
      clearTimeout(wait.run);

    wait.run = setTimeout(() => {
      browserSync.reload("*.css");
      browserSync.reload("*.js");
      wait.run = null;
    }, 1200);
  });
}
exports.buildCSS = async () => {
  fs
    .readdirSync("app/styles/", { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => {
      buildCss("app/styles/" + item.name)
    });
}
exports.buildScript = async () => {
  buildScripts(
    fs
      .readdirSync("./app/scripts/", { withFileTypes: true })
      .filter((item) => !item.isDirectory() && item.name.includes('.js'))
      .map((item) => "./app/scripts/" + item.name),
  );
}
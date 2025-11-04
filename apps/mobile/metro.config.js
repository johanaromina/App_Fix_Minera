const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// Configurar variable de entorno
process.env.EXPO_ROUTER_APP_ROOT = './app';

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Monorepo configuration
const workspaceRoot = path.resolve(projectRoot, "../..");
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;

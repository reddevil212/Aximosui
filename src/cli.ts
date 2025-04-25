// @ts-nocheck
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { execSync } from 'child_process';
import { componentRegistry } from './components/registry';

const CORE_DEPENDENCIES = [
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'tailwindcss-animate',
  'tailwindcss',
  '@radix-ui/react-slot', // Common in many components
  'framer-motion',    // Used in many animations
  'lucide-react',     // Used for icons
  'react',
  'react-dom'
];

interface InstallationStats {
  installedComponents: string[];
  installedFiles: string[];
  installedDependencies: string[];
  errors: string[];
  warnings: string[];
}

interface InstallOptions {
  deps?: boolean;
  tailwind?: boolean;
  styles?: boolean;
  force?: boolean;
}

interface ValidatedComponent {
  name: string;
  missingDependencies: string[];
  missingFiles: string[];
}

class ComponentInstaller {
  private stats: InstallationStats = {
    installedComponents: [],
    installedFiles: [],
    installedDependencies: [],
    errors: [],
    warnings: []
  };

  private async validateEnvironment() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(pkgPath)) {
      const { initProject } = await inquirer.prompt([{
        type: 'confirm',
        name: 'initProject',
        message: 'No package.json found. Would you like to initialize a new project?',
        default: true
      }]);

      if (initProject) {
        execSync('npm init -y', { stdio: 'pipe' });
        console.log(chalk.green('✓ Initialized new npm project'));
      } else {
        throw new Error('Cannot proceed without package.json');
      }
    }

    // Check for node_modules
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      const { installDeps } = await inquirer.prompt([{
        type: 'confirm',
        name: 'installDeps',
        message: 'No node_modules found. Would you like to install dependencies?',
        default: true
      }]);

      if (installDeps) {
        const spinner = ora('Installing project dependencies...').start();
        try {
          execSync('npm install', { stdio: 'pipe' });
          spinner.succeed('Dependencies installed successfully');
        } catch (error) {
          spinner.fail('Failed to install dependencies');
          throw new Error('Failed to install dependencies. Please run npm install manually.');
        }
      }
    }
  }

  private async validateDependencies(targetDir: string) {
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJSON(pkgPath);
    const requiredDeps = ['react', 'react-dom'];
    const missing = requiredDeps.filter(
      dep => !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]
    );

    if (missing.length) {
      console.log(chalk.yellow(`\nMissing required dependencies: ${missing.join(', ')}`));
      const { installMissing } = await inquirer.prompt([{
        type: 'confirm',
        name: 'installMissing',
        message: 'Would you like to install the missing dependencies?',
        default: true
      }]);

      if (installMissing) {
        await this.installDependencies(missing);
      } else {
        throw new Error(`Cannot proceed without required dependencies: ${missing.join(', ')}`);
      }
    }
  }

  private async installDependencies(dependencies: string[]) {
    if (!dependencies.length) return;

    // Properly deduplicate dependencies
    const uniqueDeps = Array.from(new Set(dependencies.map(dep => dep.trim()))).filter(Boolean);
    
    const spinner = ora('Installing dependencies...').start();
    try {
      const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));
      const hasPnpmLock = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'));
      
      let command;
      // Join with spaces and ensure no trailing commas
      const depsString = uniqueDeps.filter(dep => dep !== 'react' && dep !== 'react-dom').join(' ');

      if (hasYarnLock) {
        command = `yarn add ${depsString} --legacy-peer-deps`;
      } else if (hasPnpmLock) {
        command = `pnpm add ${depsString} --legacy-peer-deps`;
      } else {
        command = `npm install ${depsString} --legacy-peer-deps --save`;
      }

      execSync(command, { stdio: 'pipe' });
      this.stats.installedDependencies.push(...uniqueDeps);
      spinner.succeed(chalk.green('Dependencies installed successfully'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to install dependencies'));
      console.error(chalk.red(`Error details: ${error.message}`));
      throw new Error(`Failed to install dependencies: ${error.message}`);
    }
  }

  private createTailwindConfig = async (targetDir: string) => {
    const configPath = path.join(targetDir, 'tailwind.config.js');
    if (!fs.existsSync(configPath)) {
      const config = `
module.exports = {
  darkMode: ["class"],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
      await fs.writeFile(configPath, config);
      return true;
    }
    return false;
  };

  private createGlobalCSS = async (targetDir: string) => {
    const cssDir = path.join(targetDir, 'styles');
    const cssPath = path.join(cssDir, 'globals.css');
    
    if (!fs.existsSync(cssPath)) {
      await fs.ensureDir(cssDir);
      const css = `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}`;
      await fs.writeFile(cssPath, css);
      return true;
    }
    return false;
  };

  private async validateComponent(componentName: string): Promise<ValidatedComponent> {
    const component = componentRegistry[componentName];
    const result: ValidatedComponent = {
      name: componentName,
      missingDependencies: [],
      missingFiles: []
    };

    if (!component) {
      throw new Error(`Component ${componentName} not found in registry`);
    }

    // Validate dependencies
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = await fs.readJSON(pkgPath);
    const installedDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    component.dependencies.forEach(dep => {
      if (!installedDeps[dep]) {
        result.missingDependencies.push(dep);
      }
    });

    // Validate files
    const componentDir = path.join(__dirname, 'components', 'ui');
    component.files.forEach(file => {
      if (!fs.existsSync(path.join(componentDir, file))) {
        result.missingFiles.push(file);
      }
    });

    return result;
  }

  public async install(components: string[], options: InstallOptions = {}) {
    const targetDir = process.cwd();
    
    try {
      await this.validateEnvironment();
      await this.validateDependencies(targetDir);

      // Install core dependencies first
      if (options.deps !== false) {
        await this.installDependencies(CORE_DEPENDENCIES);
      }

      // Get all component-specific dependencies
      const componentDependencies = new Set<string>();
      for (const component of components) {
        const componentInfo = componentRegistry[component];
        if (componentInfo?.dependencies) {
          componentInfo.dependencies.forEach(dep => componentDependencies.add(dep));
        }
      }

      // Install component dependencies
      if (options.deps !== false && componentDependencies.size > 0) {
        await this.installDependencies([...componentDependencies]);
      }

      // Install components
      for (const component of components) {
        await this.installComponent(component, targetDir, false);
      }

      // Create config files if needed
      if (options.tailwind) {
        const created = await this.createTailwindConfig(targetDir);
        if (created) {
          console.log(chalk.green('✓ Created tailwind.config.js'));
        }
      }

      if (options.styles) {
        const created = await this.createGlobalCSS(targetDir);
        if (created) {
          console.log(chalk.green('✓ Created globals.css'));
        }
      }

      this.printSummary();

    } catch (error) {
      console.error(chalk.red(`\n✗ Installation failed: ${error.message}`));
      if (options.force) {
        console.log(chalk.yellow('\nContinuing installation due to --force flag...'));
      } else {
        process.exit(1);
      }
    }
  }

  private async installComponent(componentName: string, targetDir: string, installDeps = true) {
    const spinner = ora(`Installing ${componentName}`).start();

    try {
      const componentInfo = componentRegistry[componentName];
      if (!componentInfo) {
        spinner.fail(`Component ${componentName} not found`);
        this.stats.errors.push(`Component ${componentName} not found`);
        return;
      }

      // Update source directory to use the package's node_modules path
      const packageDir = path.dirname(require.resolve('aximosui/package.json'));
      const sourceDir = path.join(packageDir, 'src', 'components', 'ui');
      const targetComponentDir = path.join(targetDir, 'components', 'ui');

      // Create target directories
      await fs.ensureDir(targetComponentDir);

      // Copy component files with validation
      let filesInstalled = false;
      for (const file of componentInfo.files) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetComponentDir, file);

        if (!fs.existsSync(sourcePath)) {
          this.stats.warnings.push(`Source file not found: ${file}`);
          continue;
        }

        try {
          await fs.copy(sourcePath, targetPath);
          this.stats.installedFiles.push(file);
          filesInstalled = true;
        } catch (err) {
          this.stats.warnings.push(`Failed to copy file: ${file}`);
        }
      }

      // Handle utils.ts file
      if (componentInfo.utils?.includes('utils')) {
        const utilsDir = path.join(targetDir, 'lib');
        await fs.ensureDir(utilsDir);
        const sourceUtilPath = path.join(packageDir, 'src', 'lib', 'utils.ts');
        const targetUtilPath = path.join(utilsDir, 'utils.ts');

        try {
          await fs.copy(sourceUtilPath, targetUtilPath);
          this.stats.installedFiles.push('utils.ts');
        } catch (err) {
          this.stats.warnings.push(`Failed to copy utils.ts`);
        }
      }

      if (!filesInstalled) {
        throw new Error(`No files were installed for component ${componentName}`);
      }

      spinner.succeed(`${componentName} installed successfully`);
      this.stats.installedComponents.push(componentName);

    } catch (error) {
      spinner.fail(`Failed to install ${componentName}`);
      this.stats.errors.push(`Failed to install ${componentName}: ${error.message}`);
      throw error;
    }
  }

  private getAllDependentFiles(componentName: string): Set<string> {
    const seen = new Set<string>();
    const files = new Set<string>();
    const dependencies = new Set<string>();

    const traverse = (name: string) => {
      if (seen.has(name)) return;
      seen.add(name);

      const component = componentRegistry[name];
      if (!component) return;

      // Add component's own files
      component.files.forEach(file => files.add(file));

      // Add files from dependencies
      component.dependencies.forEach(dep => dependencies.add(dep));

      // Check for dependent components
      component.files.forEach(file => {
        Object.entries(componentRegistry).forEach(([key, value]) => {
          // If this component requires another component's file
          if (value.files.includes(file) && key !== name) {
            traverse(key);
          }
        });
      });
    };

    traverse(componentName);
    return files;
  }

  private getAllDependencies(componentName: string): Set<string> {
    const seen = new Set<string>();
    const dependencies = new Set<string>();

    const traverse = (name: string) => {
      if (seen.has(name)) return;
      seen.add(name);

      const component = componentRegistry[name];
      if (!component) return;

      // Add component's own dependencies
      component.dependencies.forEach(dep => dependencies.add(dep));

      // Look for dependencies from required component files
      component.files.forEach(file => {
        Object.entries(componentRegistry).forEach(([key, value]) => {
          if (value.files.includes(file) && key !== name) {
            traverse(key);
          }
        });
      });
    };

    traverse(componentName);
    return dependencies;
  }

  private printSummary() {
    if (this.stats.installedComponents.length === 0 &&
        this.stats.errors.length === 0) {
      console.log(chalk.yellow('\nNo components were installed.'));
      return;
    }

    console.log(chalk.green('\nInstallation Summary:'));
    
    if (this.stats.installedComponents.length) {
      console.log(chalk.cyan('\nInstalled components:'));
      this.stats.installedComponents.forEach(component => 
        console.log(`${chalk.green('✓')} ${component}`)
      );
    }

    if (this.stats.installedFiles.length) {
      console.log(chalk.cyan('\nInstalled files:'));
      this.stats.installedFiles.forEach(file => 
        console.log(`${chalk.green('✓')} ${file}`)
      );
    }

    if (this.stats.installedDependencies.length) {
      console.log(chalk.cyan('\nInstalled dependencies:'));
      this.stats.installedDependencies.forEach(dep => 
        console.log(`${chalk.green('✓')} ${dep}`)
      );
    }

    if (this.stats.warnings.length) {
      console.log(chalk.yellow('\nWarnings:'));
      this.stats.warnings.forEach(warning => 
        console.log(`${chalk.yellow('!')} ${warning}`)
      );
    }

    if (this.stats.errors.length) {
      console.log(chalk.red('\nErrors:'));
      this.stats.errors.forEach(error => 
        console.log(`${chalk.red('✗')} ${error}`)
      );
    }

    console.log('\nNext steps:');
    console.log('1. Import components from your components/ui directory');
    console.log('2. Add tailwind directives to your CSS');
    console.log('3. Configure your theme in tailwind.config.js');
  }
}

const program = new Command();
const installer = new ComponentInstaller();

program
  .name('aximosui')
  .description('CLI tool for installing Aximos UI components')
  .version('1.5.0');

program
  .command('install [components...]')
  .description('Install specific components')
  .option('--no-deps', 'Skip installing dependencies')
  .option('--tailwind', 'Create tailwind.config.js')
  .option('--styles', 'Create globals.css with default theme')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-f, --force', 'Continue installation even if errors occur')
  .action(async (components: string[], options) => {
    try {
      // Show component selection if no components specified
      if (!components.length) {
        const { selectedComponents } = await inquirer.prompt([{
          type: 'checkbox',
          name: 'selectedComponents',
          message: 'Select components to install:',
          choices: Object.keys(componentRegistry).map(key => ({
            name: `${componentRegistry[key].name} (${componentRegistry[key].files.length} files)`,
            value: key,
            checked: false
          }))
        }]);
        components = selectedComponents;
      }

      if (!components.length) {
        console.log(chalk.yellow('No components selected. Exiting...'));
        return;
      }

      // Validate selected components exist
      const invalidComponents = components.filter(c => !componentRegistry[c]);
      if (invalidComponents.length) {
        console.error(chalk.red(`Invalid components: ${invalidComponents.join(', ')}`));
        process.exit(1);
      }

      if (!options.yes) {
        const { confirm } = await inquirer.prompt([{
          type: 'confirm', 
          name: 'confirm',
          message: `Install ${components.length} components and their dependencies?`
        }]);
        if (!confirm) return;
      }

      await installer.install(components, {
        deps: options.deps,
        tailwind: options.tailwind,
        styles: options.styles,
        force: options.force
      });

    } catch (error) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1); 
    }
  });

program
  .command('list')
  .description('List all available components')
  .action(() => {
    console.log(chalk.bold('\nAvailable components:'));
    Object.entries(componentRegistry).forEach(([key, value]) => {
      console.log(chalk.cyan(`\n${value.name} (${key})`));
      console.log(`Files: ${value.files.join(', ')}`);
      console.log(`Dependencies: ${value.dependencies.join(', ')}`);
    });
  });

program.parse();
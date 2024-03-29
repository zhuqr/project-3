const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const qs = require('./helper/questions');
const App = require('./app');
const Clean = require('./clean');
const ImgMin = require('./imgMin');

program
    .version(pkg.version, '-v, --version');

program
    .command('search')
    .alias('s')
    .description('Get search pictures what you want.')
    .action(async () => {
        const answers = await inquirer.prompt(qs.startQuestions);
        const app = new App(answers);
        await app.start();
    });

program
    .command('clean')
    .alias('c')
    .description('Clean all pictures in directory "output".')
    .action(async () => {
        const answers = await inquirer.prompt(qs.confirmClean);
        const clean = new Clean();
        answers.isRemove && await clean.clean();
    });

program
    .command('imgMin')
    .alias('p')
    .option('-k, --key [key]', `Tinypng's key, Required`)
    .option('-p, --path [path]', `Compress directory. By default, the /images in the current working directory are taken. 
    Please enter an absolute path such as /Users/admin/Documents/xx...`)
    .description('Compress your images by tinypng.')
    .action(options => {
        let conf = {};
        if(!options.key){
            console.log(chalk.red(`Please enter your tinypng's key by "gp p -k [key]"`));
            return;
        }
        options.key && (conf.key = options.key);
        options.path && (conf.imgMinPath = options.path);
        const imgMin = new ImgMin(conf);
        imgMin.start();
    });

program
    .command('*')
    .description('Not supposed commander.')
    .action(() => program.help());
    
program.parse(process.argv);

if(process.argv.length < 3){
    program.help();
}
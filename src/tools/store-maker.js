// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const configPath = process.env.npm_config_path;
let configName = process.env.npm_config_name;

if(configName) {
    configName = configName.charAt(0).toUpperCase() + configName.substring(1, configName.length);
}

const fileNames = [
    {
        name: 'actions.ts',
        content: `import { RootState } from '@/store/types';
// import api${configName} from '@/api/api${configName}';
import { ActionTree } from 'vuex';
import { ${configName}StateInterface } from './interfaces';
import { ${configName}Mutations } from './mutations';


const actions: ActionTree<${configName}StateInterface, RootState> = {
    async getSomething ({ commit }) {
       
    },
};
export default actions;`
    },
    {
        name: 'getters.ts',
        content: `import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';
import { ${configName}StateInterface } from './interfaces';

const getters: GetterTree<${configName}StateInterface, RootState> = {
    getSomething (state) {
        
        return state.something;
    },
};
        

export default getters;`
    },
    {
        name: 'index.ts',
        content: `import { Module } from 'vuex';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import { ${configName}StateInterface } from './interfaces';
import { RootState } from '@/store/types';

const ${configName}: Module<${configName}StateInterface, RootState> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state
};

export default ${configName};`
    },
    {
        name: 'interfaces.ts',
        content: `export interface ${configName}StateInterface {
    something: boolean;
}`
    },
    {
        name: 'mutations.ts',
        content: `import { MutationTree } from 'vuex';
import { ${configName}StateInterface } from './interfaces';

export enum ${configName}Mutations {
    SET_SOMETHING = 'SET_SOMETHING',
}

const mutation: MutationTree<${configName}StateInterface> = {
    [${configName}Mutations.SET_SOMETHING] (state, payload) {
        state.something = payload;
    },
   
};


export default mutation;`
    },
    {
        name: 'state.ts',
        content: `import { ${configName}StateInterface } from './interfaces';

const state = (): ${configName}StateInterface => {
    return {
        something: true,
    };
};

export default state;`
    },
];

const ruta = `${__dirname.split('tools')[0]}${configPath}\\store`;

const createFolder = (path) => {
    let status;
    if (!fs.existsSync(path)) {
        try {
            fs.mkdirSync(path);
            console.log('folder created');
            status = true;
        } catch (err) {
            console.error(err);
            status = false;
        }
    } else {
        console.log(`folder ${path} already exists`);
        status = false;
    }
    return status;
};

const createFile = (path, name, content) => {
    fs.writeFile(`${path}/${name}`, content, (err) => {
        if (err) {
            throw (err);
        }
        console.log(`file ${name} created`);

    });
};

const createStoreFiles = () => {
    fileNames.forEach((file) => createFile(ruta, file.name, file.content));
};

const main = () => {
    if (configPath && configName) {
        if (createFolder(ruta)) {
            createStoreFiles();
        };
    } else {
        console.error('ERROR --> missing --path or --name values');
    }
};

main();
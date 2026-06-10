import fs from 'fs';
import path from 'path'
import pages from '../structure/pages'
// import fetch from 'node-fetch';

/*const arrayToObject = (array) => {
    return array && array.length > 0 ? array.reduce((obj, item) => {
        return Object.assign(obj, {[item.key]: item.value});
    }, {}) : {};
}

const optionsToObject = (arrayOptions) => {

    const options = arrayOptions.map(option => {
        if (Array.isArray(option.value) && option.value.length && option.value[0].key) {
            option.value = arrayToObject(option.value);
        }
        return option;
    });

    return arrayToObject(options);

}

const nestedComponentToObject = async (components) => {

    if(components){
        return await Promise.all(components.map(async component => {
            component.options = await optionsToObject(component.options)
            component.components = await nestedComponentToObject(component.components)
            return component
        }))
    }else{
        return []
    }
}*/

export default async (req, res, next) => {

    if (req.url === '/generate-pages') {

        await pages.forEach(page => {

            const pageComponent = "<template>\n" + "    <Page/>\n" + "</template>\n" + "<script> \n" + "export default {\n" + "    name: 'index'\n" + "    middleware: page.config.route.middleware" + "}\n" + "</script>"

            const pagePath = page.config.route.i18n?.path

            if(pagePath){

                let baseDir = path.join(__dirname, `../pages/${pagePath}.vue`);

                function writeFileSyncRecursive(filename, content, charset) {
                    const folders = filename.split(path.sep).slice(0, -1)
                    if (folders.length) {
                        folders.reduce((last, folder) => {
                            const folderPath = last ? last + path.sep + folder : folder
                            if (!fs.existsSync(folderPath)) {
                                fs.mkdirSync(folderPath)
                            }
                            return folderPath
                        })
                    }
                    fs.writeFileSync(filename, content, charset)
                }

                writeFileSyncRecursive(baseDir, pageComponent, 'utf8')
            }

        })

        // const response = await fetch(process.env.DEV_API_URL + 'pages');
        // let data = await response.text();
        //
        // const mappedData = await Promise.all(JSON.parse(data).map(async page => {
        //     page.header.menu.options = optionsToObject(page.header.menu.options)
        //     page.body.wrapper.options = optionsToObject(page.body.wrapper.options)
        //
        //     if(page.body.header){
        //         page.body.header.options = optionsToObject(page.body.header.options)
        //         page.body.header.components = await nestedComponentToObject(page.body.header.components)
        //     }
        //
        //     page.body.wrapper.components = await nestedComponentToObject(page.body.wrapper.components)
        //
        //     return page
        // }));

    }

    next();
}

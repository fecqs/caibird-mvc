/**
 * @Owners cmZhou
 * @Title 安装一些工程必备的依赖
 */
const {
    execStdout,
    printf,
    ColorsEnum,
} = require('../utils');

const defaultGlobalList = ['rimraf'];

module.exports = ({
    globalList,
}) => {
    printf('请确认您安装了 Node v4 及以上版本', ColorsEnum.RED);
    printf('请自行安装tslint等插件', ColorsEnum.RED);

    const s = new Set(defaultGlobalList.concat(globalList || []));

    execStdout(`npm i -g ${[...s].join(' ')}`);
};

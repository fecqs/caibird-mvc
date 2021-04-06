/**
 * @Owners cmZhou
 * @Title html工具
 */
import base from '../../@com/utils/uHtml';

namespace _uHtml {
    export const getTextWidth = (text: string, opt?: {
        parent?: Element,
        fontFamily?: string,
        fontSize?: string,
        fontWeight?: string,
    }) => {
        const pre = document.createElement('pre');
        pre.style.opacity = '0';
        pre.style.position = 'absolute';
        pre.style.fontFamily = opt?.fontFamily || '';
        pre.style.fontSize = opt?.fontSize || '';
        pre.style.fontWeight = opt?.fontWeight || '';
        pre.innerText = text;

        if (opt?.parent) {
            opt.parent.appendChild(pre);
        } else {
            document.body.appendChild(pre);
        }

        const width = pre.clientWidth;
        pre.remove();
        return width;
    };

    export const checkTextNode = (node: Node | null) => !!node && node.nodeName === '#text';

    export const checkLinkNode = (node: Node | null) => !!node && node.nodeName === 'A';

    export const checkBrNode = (node: Node | null) => !!node && node.nodeName === 'BR';
}

export const uHtml = {
    ...base,
    ..._uHtml,
};

/**
 * @Owners cmZhou
 * @Title public array工具
 */
export namespace uArray {
    export const check = <T>(obj: unknown): obj is T[] => obj instanceof Array;

    export const jsonParse = <T>(str: string): T[] => {
        const dft: T[] = [];
        try {
            const arr: unknown = JSON.parse(str);
            return check<T>(arr) ? arr : dft;
        } catch {
            return dft;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const updateAndGetNew = <TItem extends dp.Obj<any> | null | undefined>(list: TItem[], value: Partial<TItem>, index: number) => {
        const newList = list.slice();

        if (index < 0 || index >= newList.length) return newList;

        if (newList[index] || value) {
            newList[index] = {
                ...newList[index],
                ...value,
            };
        } else {
            newList[index] = value;
        }

        return newList;
    };

    export const deleteAndGetNew = <TItem>(list: TItem[], index: number, length = 1) => {
        const newList = list.slice();
        newList.splice(index, length);
        return newList;
    };

    export const insertAndGetNew = <TItem>(list: TItem[], item: TItem, index = list.length) => {
        const newList = list.slice();
        newList.splice(index, 0, item);
        return newList;
    };
}

export default uArray;

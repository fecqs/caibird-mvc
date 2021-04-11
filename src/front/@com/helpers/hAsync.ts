/**
 * @Owners cmZhou
 * @Title async helper
 */
import { cError } from '../consts/cError';
import { uFunction } from '../utils/uFunction';
import { uObject } from '../utils/uObject';

export declare namespace eAsync {
    const enum Action {
        Break = 0, // 中断其它
        Hide = 1, // 隐藏其它
        Parallel = 2, // 并行
    }
    const enum Status {
        BeBreaked = 0, BeHided = 1, Running = 2,
    }
}

export abstract class HAsync<TCustomRunOpt extends Caibird.dp.Obj = Caibird.dp.Obj> {
    protected constructor() { }

    protected abstract readonly onRunBegin?: (...p: Parameters<HAsync<TCustomRunOpt>['run']>) => Caibird.dp.PromiseOrSelf<void>;
    protected abstract readonly onRunEnd?: (status: eAsync.Status, ...p: Parameters<HAsync<TCustomRunOpt>['run']>) => Caibird.dp.PromiseOrSelf<void>;

    protected readonly map: Caibird.dp.Obj<Caibird.dp.Obj<{
        status: eAsync.Status,
        task: Promise<unknown>,
    } | undefined>> = {};

    public readonly keys = {
        GLOBAL_UNIQUE: Symbol('GLOBAL_UNIQUE'),
    };

    protected readonly getNowState = (promiseKey: symbol, key?: symbol) => {
        const strKey = key as unknown as string;
        const strPromiseKey = promiseKey as unknown as string;
        if (strKey) {
            const obj = this.map[strKey][strPromiseKey];
            if (obj) {
                if (obj.status === eAsync.Status.Running) {
                    return eAsync.Status.Running;
                } else if (obj.status === eAsync.Status.BeHided) {
                    return eAsync.Status.BeHided;
                }
            }
            return eAsync.Status.BeBreaked;
        }
        return eAsync.Status.Running;
    };

    public readonly run = async <T = void>(task: Caibird.dp.PromiseFunc<unknown[], T> | Promise<T>, opt: Options & Partial<TCustomRunOpt> = {}) => {
        const { action = eAsync.Action.Break, key, onExecuteSuccess, onExecuteFail, onExecuteEnd } = opt;
        const promiseKey = Symbol();

        const handleStatus = (callback?: Callback, noThrow = false) => {
            const status = this.getNowState(promiseKey, key);

            if (status === eAsync.Status.BeBreaked) {
                if (noThrow) return status;
                throw new cError.Noop(`break ${key?.toString() ?? ''} promise`);
            }
            if (status === eAsync.Status.Running) {
                callback?.(status);
            }
            return status;
        };

        const promise = uFunction.check(task) ? task() : task;

        const strKey = key as unknown as string;
        const strPromiseKey = promiseKey as unknown as string;

        if (strKey) {
            if (!this.map[strKey]) {
                this.map[strKey] = {};
            }
            Object.getOwnPropertySymbols(this.map[strKey]).forEach(item => {
                const strItem = item as unknown as string;
                const promiseInfo = this.map[strKey][strItem];
                if (promiseInfo) {
                    if (action === eAsync.Action.Break) {
                        promiseInfo.status = eAsync.Status.BeBreaked;
                    } else if (action === eAsync.Action.Hide) {
                        promiseInfo.status = eAsync.Status.BeHided;
                    }
                }
            });
            this.map[strKey][strPromiseKey] = {
                status: eAsync.Status.Running,
                task: promise,
            };
        }

        try {
            this.onRunBegin && await this.onRunBegin(task, opt);
            const data = await promise;
            handleStatus(onExecuteSuccess);
            return data;
        } catch (e: unknown) {
            if (!uObject.checkInstance(e, cError.Noop)) {
                handleStatus(onExecuteFail);
            }
            throw e;
        } finally {
            const status = handleStatus(onExecuteEnd, true);
            this.onRunEnd && await this.onRunEnd(status, task, opt);
            if (strKey) {
                this.map[strKey][strPromiseKey] = undefined;
            }
        }
    };
}

//#region 私有类型
type Callback = (status: eAsync.Status) => void;

type Options = {
    onExecuteSuccess?: Callback,
    onExecuteFail?: Callback,
    onExecuteEnd?: Callback,

    key?: symbol,
    action?: eAsync.Action,
};
//#endregion

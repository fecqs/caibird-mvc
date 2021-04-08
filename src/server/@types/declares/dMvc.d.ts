/**
 * @Owners cmZhou
 * @Title mvc常用类型
 */
import BaseKoa from 'koa';
import KoaSend from 'koa-send';

declare global {
    namespace dMvc {
        type BaseCtxState = { fetchId?: string };

        interface BaseCtxCustom<TState> extends BaseKoa.Context {
            state: BaseCtxState & BaseKoa.DefaultState & TState,
        }

        type CtxState<TState> = BaseCtxState & TState;

        type CtxCustom<TState, TCustom> = BaseCtxCustom<TState> & TCustom;

        type Ctx<TState, TCustom> = BaseKoa.ParameterizedContext<CtxState<TState>, CtxCustom<TState, TCustom>>;

        type Koa<TState, TCustom> = BaseKoa<CtxState<TState>, CtxCustom<TState, TCustom>>;

        type Middleware<TState, TCustom> = BaseKoa.Middleware<CtxState<TState>, CtxCustom<TState, TCustom>>;

        type ActionReq<T extends dCaibird.Obj> = Partial<T>;

        type View = typeof import('../../app').default['View'];

        type BaseController<TState, TCustom> = new (ctx: Ctx<TState, TCustom>) => unknown;

        type ControllerProps<TRules, TState, TCustom> = {
            __actions__: dCaibird.Obj<Action<TRules, TState, TCustom>>,
        };

        type InitController<TRules, TState, TCustom> = BaseController<TState, TCustom> & Partial<CommonProps<TRules, TState, TCustom> & ControllerProps<TRules, TState, TCustom>>;
        type Controller<TRules, TState, TCustom> = BaseController<TState, TCustom> & CommonProps<TRules, TState, TCustom> & ControllerProps<TRules, TState, TCustom>;

        type BaseAction = dCaibird.PromiseFunc;

        type InitAction<TRules, TState, TCustom> = BaseAction & Partial<CommonProps<TRules, TState, TCustom>>;
        type Action<TRules, TState, TCustom> = BaseAction & CommonProps<TRules, TState, TCustom>;

        interface ActionPropertyDescriptor<TRules, TState, TCustom> extends PropertyDescriptor {
            value?: InitAction<TRules, TState, TCustom>,
        }

        type FilterController<TRules, TState, TCustom> = InitController<TRules, TState, TCustom> | InstanceType<InitController<TRules, TState, TCustom>>;
        type Decorator<TRules, TState, TCustom> = (controller: FilterController<TRules, TState, TCustom>, action?: string, actionDes?: ActionPropertyDescriptor<TRules, TState, TCustom>) => void;

        type Filter<TRules, TState, TCustom> = dCaibird.Func & FilterProps<TRules, TState, TCustom>;

        type FilterProps<TRules, TState, TCustom> = {
            filterName?: string,
            defaultOrder?: number,
            onCheckRule?(target: Action<TRules, TState, TCustom> | Controller<TRules, TState, TCustom>, options: { controller: string, action: string }, ctx: Ctx<TState, TCustom>): dCaibird.PromiseOrSelf<void>,
            preExecute?(target: Action<TRules, TState, TCustom> | Controller<TRules, TState, TCustom>, ctx: Ctx<TState, TCustom>): dCaibird.PromiseOrSelf<void>,
            postExecute?(target: Action<TRules, TState, TCustom> | Controller<TRules, TState, TCustom>, ctx: Ctx<TState, TCustom>): dCaibird.PromiseOrSelf<void>,
        };

        type CommonProps<TRules, TState, TCustom> = {
            filterOrderList: dCaibird.Obj<Filter<TRules, TState, TCustom>[]>,
            filterList: Filter<TRules, TState, TCustom>[],
            filterRules: Partial<TRules> & { httpMethod?: eCaibird.Http.MethodType | eCaibird.Http.MethodType[] },
            filterInfo: {
                name?: string,
                desc?: string,
            },
        };

        type ActionReturn<T> = {
            type: 'buffer' | 'file' | 'json' | 'redirect' | 'render' | 'xml',
            result: T,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interface JsonActionReturn<T extends dCaibird.Obj<any> | null> extends ActionReturn<dFetch.SuccessJsonBody<T>> {
            type: 'json',
        }

        interface FileActionReturn extends ActionReturn<{
            path: string,
            opt?: KoaSend.SendOptions,
        }> {
            type: 'file',
        }

        interface RenderActionReturn<T extends dCaibird.Obj | undefined> extends ActionReturn<{
            view: string,
            params?: T,
        }> {
            type: 'render',
        }

        interface BufferActionReturn extends ActionReturn<{
            buffer: Buffer,
            fileName: string,
            opt?: { type: eCaibird.Http.ContentDispositionType },
        }> {
            type: 'buffer',
        }

        interface RedirectActionReturn extends ActionReturn<{
            url: string,
        }> {
            type: 'redirect',
        }

        interface XmlActionReturn extends ActionReturn<{
            xmlStr: string,
        }> {
            type: 'xml',
        }
    }
}
export = dMvc;

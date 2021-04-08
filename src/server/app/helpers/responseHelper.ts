/**
 * @Owners cmZhou
 * @Title app responseHelper
 */
import koaSend from 'koa-send';

import { cError } from '../../consts/cError';
import { cMessage } from '../../consts/cMessage';

import { contextHelper, reportHelper, settingHelper } from '.';

class ResponseHelper {
    public static readonly instance = new ResponseHelper();
    private constructor() { }

    private isInitRender = false;

    public readonly setInitRender = () => this.isInitRender = true;

    public readonly json = <T>(json: dFetch.ErrorJsonBody | dFetch.SuccessJsonBody<T>, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_setJson_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }
        const version = settingHelper.getCustomConfig('version');
        json.version = version || Caibird.env.PROJECT_VERSION;
        json.msg = json.msg || (json.code !== eCaibird.Fetch.JsonSuccessCode.Success && cMessage.jsonError[json.code]) || '';
        json.fetchId = (ctx.state as Caibird.dp.Obj).fetchId as string;

        ctx.body = json;
        ctx.status = eCaibird.Http.StatusCode.Ok;
        ctx.type = 'json';
    };

    public readonly xml = (xmlStr: string, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_setXml_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }

        ctx.body = xmlStr;
        ctx.status = eCaibird.Http.StatusCode.Ok;
        ctx.type = 'xml';
    };

    public readonly status = (status: eCaibird.Http.StatusCode, msg?: string, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_setStatus_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }
        ctx.body = msg || cMessage.httpStatus[status];
        ctx.status = status;
    };

    public readonly buffer = (buffer: Buffer, fileName: string, opt: { type?: eCaibird.Http.ContentDispositionType } = {}, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_sendBuffer_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }
        ctx.set('Content-Disposition', `${opt.type ?? eCaibird.Http.ContentDispositionType.Attachment};filename=${encodeURIComponent(fileName)}`);
        ctx.body = buffer;
        ctx.status = eCaibird.Http.StatusCode.Ok;
    };

    public readonly file = async (path: string, opt?: koaSend.SendOptions, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_sendFile_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }
        try {
            await koaSend(ctx, path, opt);
        } catch (e: unknown) {
            const error = (e || new Error()) as Error;
            throw new cError.Status(eCaibird.Http.StatusCode.ServerError,
                { key: 'responseHelper_sendFile', error });
        }
    };

    public readonly render = async <T>(view: string, params?: T, ctx = contextHelper.get()) => {
        if (ctx.headerSent) {
            reportHelper.appError({
                key: 'responseHelper_render_headerSent',
                msg: 'ctx.headerSent===true',
            });
            return;
        }
        if (!this.isInitRender) {
            throw new cError.Status({
                status: eCaibird.Http.StatusCode.ServerError,
                msg: '未初始化render中间件',
            }, { key: 'responseHelper_render_noInit' });
        }
        try {
            await ctx.render(view, params);
        } catch (e: unknown) {
            const error = (e || new Error()) as Error;
            throw new cError.Status(eCaibird.Http.StatusCode.ServerError,
                { key: 'responseHelper_render', error });
        }
    };
}

export const responseHelper = ResponseHelper.instance;

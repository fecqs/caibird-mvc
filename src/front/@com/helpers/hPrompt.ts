/**
 * @Owners cmZhou
 * @Title prompt helper
 */

export declare namespace ePrompt {
    const enum Type {
        Modal = 0,
        Toast = 1,
    }
    const enum StyleType {
        Warning = 0,
        Info = 1,
        Error = 2,
        Success = 3,
        Confirm = 4,
    }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class HPrompt {
    protected constructor() {
    }
}

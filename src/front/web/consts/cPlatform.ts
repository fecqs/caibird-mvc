/**
 * @Owners cmZhou
 * @Title platform 常量
 */
import platform from 'platform';

export declare namespace ePlatform {
    const enum OsName {
        Windows = 'Windows',
        MacOS = 'MacOS',
        Linux = 'Linux',

        IOS = 'IOS',
        Android = 'Android',
    }
}

namespace _cPlatform {
    export const MODEL = platform.product ?? '';
    export const MANUFACTURER = platform.manufacturer ?? '';

    export const OS_NAME = platform.os?.family ?? '';
    const OS_NAME_LC = OS_NAME.toLowerCase();

    export const OS_VERSION = platform.os?.version ?? '';

    export const isIOS = OS_NAME_LC === ePlatform.OsName.IOS.toLowerCase();
    export const isAndroid = OS_NAME_LC === ePlatform.OsName.Android.toLowerCase();
    export const isMobile = isIOS || isAndroid;

    export const isWindows = OS_NAME_LC === ePlatform.OsName.Windows.toLowerCase();
    export const isMacOS = OS_NAME_LC === ePlatform.OsName.MacOS.toLowerCase();
    export const isLinux = OS_NAME_LC === ePlatform.OsName.Linux.toLowerCase();
    export const isPC = isWindows || isMacOS || isLinux;
}

export const cPlatform: Caibird.dp.DeepReadonly<typeof _cPlatform> = _cPlatform;

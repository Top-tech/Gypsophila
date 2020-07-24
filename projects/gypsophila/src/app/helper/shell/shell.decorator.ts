import { Tangerine, WindowWithExtension } from './shell.interface';

export const TangerineClient = () => {
    return (target, key) => {
        const getter = (): Tangerine => (window as unknown as WindowWithExtension).TangerineClient;
        return Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true,
        });
    };
};

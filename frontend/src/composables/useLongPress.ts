import { type Ref, unref } from "vue";

type DisabledArg = Ref<boolean> | boolean | (() => boolean) | undefined;

function readDisabled(d: DisabledArg): boolean {
    if (d == null) return false;
    if (typeof d === "function") return d();
    return unref(d);
}

/**
 * Touch long-press (e.g. open reactor list on mobile). Passive touchstart where possible.
 */
export function useLongPress(options: {
    durationMs?: number;
    disabled?: DisabledArg;
    onLongPress: () => void;
}) {
    const duration = options.durationMs ?? 480;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clear = () => {
        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const onTouchStart = () => {
        if (readDisabled(options.disabled)) return;
        clear();
        timer = setTimeout(() => {
            timer = null;
            options.onLongPress();
        }, duration);
    };

    const onTouchEnd = () => clear();
    const onTouchCancel = () => clear();

    return { onTouchStart, onTouchEnd, onTouchCancel, cancel: clear };
}

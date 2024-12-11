export const bag = <T, >(initial: T[] = []) => {
    const theBag = new Map<T, number>();
    const inc = (t: T, count = 1) => {
        theBag.set(t, (theBag.get(t) ?? 0) + count);
    }
    const dec = (t: T, count = 1) => {
        const old = theBag.get(t) ?? 0;
        if (old == count) {
            theBag.delete(t)
        } else {
            theBag.set(t, old - count);
        }
    }
    const incAll = (many: T[], count = 1) => many.forEach(n => inc(n, count))
    incAll(initial);
    const entries = () => [...theBag.entries()];
    const keys = () => [...theBag.keys()];
    const values = () => [...theBag.values()];
    const map = <S, >(cb: (a: T, c: number) => S) => entries().map(([a, c]) => cb(a, c))
    const forEach = (cb: (a: T, c: number) => void) => entries().forEach(([a, c]) => cb(a, c))

    const get = (t: T) => theBag.get(t);
    return {
        inc, dec, entries, incAll, keys, values, map, forEach, get
    };
}
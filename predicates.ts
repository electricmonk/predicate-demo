type Context = {
    a: string;
    b: number;
    c: boolean;
}

export type SubContext<T extends keyof Context> = Pick<
    Context,
    T
>;


type Allowed = {
    status: 'allowed';
};
export const Allowed: Allowed = { status: 'allowed' };

type Disabled = {
    status: 'disabled';
    reason: string;
};
export const Disabled = (reason: string): Disabled => ({
    status: 'disabled',
    reason
});

type Hidden = {
    status: 'hidden';
    reason: string;
};
export const Hidden = (reason: string): Hidden => ({
    status: 'hidden',
    reason
});

export type Result = Allowed | Disabled | Hidden;

const needsAndB = ({a, b} : SubContext<'a' | 'b'>) => {
    if (a == "allow" || b > 0) {
        return Allowed
    }

    return Hidden("not allowed");
}

const needsA = ({a} : SubContext<'a'>) => {
    if (a == "allow") {
        return Allowed
    }

    return Hidden("not allowed");
}

const alsoNeedsA = ({a} : SubContext<'a'>) => {
    if (a == "allow") {
        return Allowed
    }

    return Disabled("not allowed");
}

const needsAandC = ({a, c} : SubContext<'a' | 'c'>) => {
    if (a == "allow" || c) {
        return Allowed
    }

    return Hidden("not allowed");
}

function runPredicates<T extends Partial<Context>>(
    predicates: ((props: T) => Result)[],
    props: T
) {
    for (const predicate of predicates) {
        const limitation = predicate(props);
        if (limitation) {
            return limitation;
        }
    }
    return Allowed;
}

runPredicates([needsAndB, needsA, needsAandC], {a: 'allowed', b: 1, c: true});
runPredicates([needsAndB, needsA, needsAandC], {a: 'allowed', b: 1});
runPredicates([needsAndB, needsA, needsAandC], {a: 'allowed', c: true});
runPredicates([needsA, alsoNeedsA], {a: 'allowed', c: true});
runPredicates([needsA, alsoNeedsA], {a: 'allowed'});
runPredicates([needsA, alsoNeedsA], {b: 1});
runPredicates([needsAndB, needsA, alsoNeedsA], {a: 'allowed', b: 1});
runPredicates([needsAndB, needsA, alsoNeedsA], {a: 'allowed', c: true});
runPredicates([needsAndB, needsA, alsoNeedsA], {a: 'allowed'});
runPredicates([needsAndB, needsA, alsoNeedsA], {b: 1});

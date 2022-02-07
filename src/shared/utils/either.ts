/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
export type Either<F, S> = Left<F, S> | Right<F, S>;

export class Left<F, S> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  isLeft(): this is Left<F, S> {
    return true;
  }

  isRight(): this is Right<F, S> {
    return false;
  }
}

export class Right<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isLeft(): this is Left<F, S> {
    return false;
  }

  isRight(): this is Right<F, S> {
    return true;
  }
}

export const left = <F, S>(f: F): Either<F, S> => {
  return new Left<F, S>(f);
};

export const right = <F, S>(s: S): Either<F, S> => {
  return new Right<F, S>(s);
};

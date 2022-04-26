import { BEMBlock, BEMModifiers } from 'bem-helpers';

export type modList = (string | undefined)[];

export interface BEMFunction {
  (element?: string, modifiers?: BEMModifiers | modList): string;
  (modifiers?: BEMModifiers | modList): string;
}

/**
 *
 * @param blockName blockname used to create element & modifiers
 * @param styles
 * @returns a function that creates element & modifiers based on the base name
 */
export const BEM = (blockName: string, styles: { [key: string]: string } = {}): BEMFunction => {
  const bem = BEMBlock(blockName);

  return (
    nameOrModifiers?: string | BEMModifiers | modList,
    modifiers?: BEMModifiers | modList
  ) => {
    const toModifiers = (list: modList) =>
      list.filter((_) => !!_).reduce((acc, mod) => ({ ...acc, [mod as any]: true }), {});

    if (nameOrModifiers instanceof Array) {
      nameOrModifiers = toModifiers(nameOrModifiers);
    } else if (modifiers instanceof Array) {
      modifiers = toModifiers(modifiers);
    }

    return bem(nameOrModifiers as any, modifiers as any)
      .split(' ')
      .map((name) => styles[name] || name)
      .join(' ');
  };
};

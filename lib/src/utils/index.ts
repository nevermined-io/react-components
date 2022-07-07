// if empty returns true
export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;

export const convertHextoIntString = (hex: string) => {
  const removedAddressFormat = hex.replace('0x', '');
  const intString = parseInt(removedAddressFormat, 16);

  return intString.toString();
};

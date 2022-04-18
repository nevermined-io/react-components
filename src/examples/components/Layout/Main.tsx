import React, { ReactNode } from 'react';

export interface MainProps {
  children?: ReactNode | string;
}
export const Main = ({ children }: MainProps) => {
  return <main>{children}</main>;
};

export default Main;

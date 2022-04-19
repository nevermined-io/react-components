import React, { ReactNode } from 'react';

export interface HeaderProps {
  children?: ReactNode | string;
}
export const Header = ({ children }: HeaderProps) => {
  return <header>{children}</header>;
};

export default Header;

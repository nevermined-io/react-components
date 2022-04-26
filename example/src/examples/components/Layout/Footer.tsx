import React, { ReactNode } from 'react';

export interface FooterProps {
  children?: ReactNode | string;
}
export const Footer = ({ children }: FooterProps) => {
  return <footer>{children}</footer>;
};

export default Footer;

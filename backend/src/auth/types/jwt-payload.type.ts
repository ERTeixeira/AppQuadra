export type JwtPayload = {
  sub: string;
  role: 'proprietario' | 'cliente';
  name: string;
};

export interface JWT {
  exp?: number;
  iat?: number;
}

export interface Token {
  access: string;
  refresh: string;
}

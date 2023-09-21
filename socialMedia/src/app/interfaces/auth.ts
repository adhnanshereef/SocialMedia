export interface LoginUser {
  username: string;
  password: string;
}

export interface Tokens {
  refresh: string;
  access: string;
}

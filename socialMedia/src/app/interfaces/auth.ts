export interface TokenUser {
  id: number;
  username: string;
  name: string;
  profile: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface SignupUser {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface Tokens {
  refresh: string;
  access: string;
}

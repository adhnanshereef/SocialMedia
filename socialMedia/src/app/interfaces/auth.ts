export interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
  profile_pic: string;
  dateofbirth: string;
  joined: string;
  followers: Array<any>;
  following: Array<any>;
}

export interface TokenUser {
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

export interface LoginRequestDto {
  email: string;
  password: string;
  userType: string;
}

export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: string;
  };
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
  phone?: string;
  organization?: string;
}

export interface RegisterResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: string;
    phone?: string;
    organization?: string;
  };
}

// Infrastructure Layer - 외부 API 응답/요청 스키마
export interface UserDto {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  user: UserDto;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  token: string;
  expiresIn?: number;
} 
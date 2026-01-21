export interface ApiResponse<T = any> {
  status: number;
  ok: boolean;
  [key: string]: any;
}

export interface tokens {
  refreshToken?: string;
  accessToken: string;
}

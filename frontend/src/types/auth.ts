export interface User {
  id: string;
  username: string;
  role: "admin" | "club_officer";
  clubId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  confirmPassword: string;
  clubId?: string;
}

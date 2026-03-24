export interface Instructor {
  id: string;
  name: string;
  lastname: string;
  email: string;
  dni: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface CreateInstructorDto {
  email: string;
  name: string;
  lastname: string;
  dni: string;
}

export interface UpdateInstructorDto {
  name: string;
  lastname: string;
  dni: string;
}

export interface Instructor {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
  image?: string;
  isActive: boolean;
  lastLoginAt: string;
}

export interface RegisterInstructorDto {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
  image?: File;
}

export interface UpdateInstructorDto {
  name: string;
  lastname: string;
  dni: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
  image?: File;
}

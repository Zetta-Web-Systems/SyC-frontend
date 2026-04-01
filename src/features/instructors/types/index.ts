interface BaseInstructor {
  name: string;
  lastname: string;
  dni: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface Instructor extends BaseInstructor {
  id: string;
  email: string;
  image?: string;
  isActive: boolean;
  lastLoginAt: string;
}

export interface RegisterInstructorDto extends BaseInstructor {
  email: string;
  image?: File;
}

export interface UpdateInstructorDto extends Partial<BaseInstructor> {
  image?: File;
}

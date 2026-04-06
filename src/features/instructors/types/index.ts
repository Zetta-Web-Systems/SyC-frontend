interface BaseInstructor {
  name: string;
  lastname: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface Instructor extends BaseInstructor {
  id: string;
  dni: string;
  email: string;
  image?: string;
  isActive: boolean;
  lastLoginAt: string;
}

export interface RegisterInstructorDto extends BaseInstructor {
  dni: string;
  email: string;
  image?: File;
}

export interface UpdateInstructorDto extends Partial<BaseInstructor> {
  image?: File;
  deleteImage?: boolean;
}

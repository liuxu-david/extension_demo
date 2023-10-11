import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateDeptDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  thirdId: string;
  sortNo: number;
  pid: number;
}

export class UpdateDeptDto {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  thirdId: string;
  @IsNumber()
  sortNo: number;
}
export class CreateUserDto {
  username?: string;
  employeeId: string;
  actualName: string;
  tel?: string;
  email?: string;
  position?: string;
  sortNo?: string;
  deptId: Array<number>;
  thirdId: string;
}

export class  UpdateUserDto {
  id: number;
  username?: string;
  employeeId: string;
  actualName: string;
  tel?: string;
  email?: string;
  position?: string;
  sortNo?: string;
  deptId: Array<number>
  thirdId: string;
}
import { IsString, Length, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 1000)
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

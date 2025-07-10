import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsString()
  @Length(1, 1000)
  content: string;
}

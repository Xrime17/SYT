import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class ReorderCategoriesDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  orderedIds!: string[];
}

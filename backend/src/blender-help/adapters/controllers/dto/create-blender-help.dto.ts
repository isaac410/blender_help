import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBlenderHelpDto {
  @ApiProperty({
    description: 'The search query/question/topic to remember',
    example: 'como ocultar objetos',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Detailed explanation of how to perform the action',
    example: 'Presionar la tecla H en el viewport. Alt+H para volver a mostrar.',
  })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty({
    description: 'Array of keywords/tags associated with this action',
    example: ['ocultar', 'hide', 'viewport', 'objetos'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({
    description: 'Blender version, e.g. 4.2 or 5.1',
    example: '4.2',
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}

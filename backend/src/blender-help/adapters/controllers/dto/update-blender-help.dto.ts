import { PartialType } from '@nestjs/swagger';
import { CreateBlenderHelpDto } from './create-blender-help.dto';

export class UpdateBlenderHelpDto extends PartialType(CreateBlenderHelpDto) {}

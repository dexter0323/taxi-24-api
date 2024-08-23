import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { DriverWithinRadiusDto } from 'src/infrastructure/controllers/driver/driver-dto.class';

export class RequestTripDto extends OmitType(DriverWithinRadiusDto, ['radius']) {}

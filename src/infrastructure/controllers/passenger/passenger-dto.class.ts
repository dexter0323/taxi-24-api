import { OmitType } from '@nestjs/swagger';
import { DriverDto } from 'src/infrastructure/controllers/driver/driver-dto.class';

export class RequestTripDto extends OmitType(DriverDto, ['radius']) {}

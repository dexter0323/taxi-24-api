import { OmitType } from '@nestjs/swagger';
import { DriverWithinRadiusDto } from 'src/infrastructure/controllers/driver/driver-dto.class';

export class RequestTripDto extends OmitType(DriverWithinRadiusDto, ['radius']) {}

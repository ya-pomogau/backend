import { VKNewUserDto } from '../../auth-api/dto/vk-new.dto';

export type UpdateProfileDto = Partial<Omit<VKNewUserDto, 'vkId'>>;

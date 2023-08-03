import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Response } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async getAdminById(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findById(id);
  }

  @Post()
  async createAdmin(@Body() admin: Admin): Promise<Admin> {
    return this.adminService.create(admin);
  }

  @Patch(':id')
  async updateAdmin(@Param('id') id: number, @Body() admin: Admin): Promise<Admin> {
    return this.adminService.update(id, admin);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: number): Promise<Admin> {
    return this.adminService.delete(id);
  }

  // Подтверждение / Блокировка статуса волонтера
  @Patch('volunteers/:id')
  async updateVolunteerStatus(@Param('id') id: number, @Body() status: string): Promise<Admin> {
    return this.adminService.updateVolunteerStatus(id, status);
  }

  @Patch('recipients/:id')
  async updateRecipientStatus(@Param('id') id: number, @Body() status: string): Promise<Admin> {
    return this.adminService.updateRecipientStatus(id, status);
  }

  // Создание заявки у реципиента
  @Post('recipients/:id/requests')
  async createRequest(@Param('id') id: number, @Body() request: any): Promise<Admin> {
    return this.adminService.createRequest(id, request);
  }

  // Редактирование заявки у реципиента
  @Patch('recipients/:id/requests/:requestId')
  async updateRequest(@Param('id') id: number, @Param('requestId') requestId: number, @Body() request: any): Promise<Admin> {
    return this.adminService.updateRequest(id, requestId, request);
  }

  // Удаление заявки у реципиента
  @Delete('recipients/:id/requests/:requestId')
  async deleteRequest(@Param('id') id: number, @Param('requestId') requestId: number): Promise<Admin> {
    return this.adminService.deleteRequest(id, requestId);
  }
  
  // Подтвердить выполнение заявки
  @Patch('recipients/:id/requests/:requestId/confirm')
  async confirmRequest(@Param('id') id: number, @Param('requestId') requestId: number): Promise<Admin> {
    return this.adminService.confirmRequest(id, requestId);
  }

  // Завершить заявку
  @Patch('recipients/:id/requests/:requestId/complete')
  async completeRequest(@Param('id') id: number, @Param('requestId') requestId: number): Promise<Admin> {
    return this.adminService.completeRequest(id, requestId);
  }

  // Отменить отклик на заявку
  @Patch('volunteers/:id/requests/:requestId/cancel')
  async cancelResponse(@Param('id') id: number, @Param('requestId') requestId: number): Promise<Admin> {
    return this.adminService.cancelResponse(id, requestId);
  }

  // Генерировать и скачивать отчет
  @Get('statistics')
  async generateReport(@Query() queryParams, @Response() res): Promise<void> {
    const report = await this.adminService.generateReport(queryParams);
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', 'attachment; filename=report.xlsx');
    res.send(report);
  }
  // Открыть чат с пользователем
  @Get('chats/:userId')
  async openChat(@Param('userId') userId: string): Promise<any> {
    return this.adminService.openChat(userId);
  }

  // Взять чат в работу
  @Get('chats/:userId/take')
  async takeChat(@Param('userId') userId: string): Promise<any> {
    return this.adminService.takeChat(userId);
  }

  // Закрыть чат
  @Get('chats/:userId/close')
  async closeChat(@Param('userId') userId: string): Promise<any> {
    return this.adminService.closeChat(userId);
  }

  // Ответить на конфликт о закрытии заявки
  @Get('chats/conflicts/:requestId')
  async getConflictChat(@Param('requestId') requestId: string): Promise<any> {
    return this.adminService.getConflictChat(requestId);
  }

  // Решить конфликт о закрытии заявки
  @Post('chats/conflicts/:requestId/resolve')
  async resolveConflict(
    @Param('requestId') requestId: string,
    @Body() resolution: { resolved: boolean, action: string },
  ): Promise<any> {
    return this.adminService.resolveConflict(requestId, resolution);
  }

  // Создать запись в блоге
  @Post('blog')
  async createBlogPost(@Body() blogPost: any): Promise<any> {
    return this.adminService.createBlogPost(blogPost);
  }

  // Редактировать запись в блоге
  @Post('blog/:id')
  async updateBlogPost(
    @Param('id') id: string,
    @Body() blogPost: any,
  ): Promise<any> {
    return this.adminService.updateBlogPost(id, blogPost);
  }

  // Удалить запись из блога
  @Delete('blog/:id')
  async deleteBlogPost(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteBlogPost(id);
  }

  // Настроить баллы по категориям
  @Post('configure-points')
  async configurePoints(@Body() pointsConfig: any): Promise<any> {
    return this.adminService.configurePoints(pointsConfig);
  }
}

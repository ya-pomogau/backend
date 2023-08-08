import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface MainAdminAuthorization {
    username: string;
    password: string;
}

@Table({ tableName: 'main-admin' })
export class MainAdmin extends Model<MainAdmin, MainAdminAuthorization> {
    @ApiProperty({ example: 'username', description: 'username' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    username: string;

    @ApiProperty({ example: '12345678', description: 'Пароль' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

}
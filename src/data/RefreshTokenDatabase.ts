import { BaseDataBase } from "./BaseDatabase";

export class RefreshTokenDatabase extends BaseDataBase{

    public async create(
        token: string,
        device: string,
        isActive: boolean,
        userId: string
    ): Promise <void> {
        await super.getConnection().raw(`
            INSERT INTO ${BaseDataBase.REFRESHTOKEN_TABLE_NAME}(refresh_token, device, is_active, user_id)
            VALUES(
                "${token}",
                "${device}",
                ${super.convertBooleanToTinyInt(isActive)},
                "${userId}"
            )
        `);
    }

    public async getByToken(token: string): Promise <any> {
        const result = await super.getConnection().raw(`
            SELECT * FROM ${BaseDataBase.REFRESHTOKEN_TABLE_NAME}
            WHERE refresh_token = "${token}"
        `);

        const refreshTokenDb = result[0][0]

        return{
            refreshToken: refreshTokenDb.refresh_token,
            device: refreshTokenDb.device,
            userId: refreshTokenDb.user_id,
            isActive: super.convertTinyIntToBoolean(refreshTokenDb.is_active)
        }
    }

    public async getByUserIdAndDevice(userId: string, device: string): Promise <any> {
        const result = await super.getConnection().raw(`
            SELECT * FROM ${BaseDataBase.REFRESHTOKEN_TABLE_NAME}
            WHERE user_id = "${userId}" AND device = "${device}"
        `);

        const refreshTokenDb = result[0][0]

        return refreshTokenDb && {
            refreshToken: refreshTokenDb.refresh_token,
            device: refreshTokenDb.device,
            userId: refreshTokenDb.user_id,
            isActive: super.convertTinyIntToBoolean(refreshTokenDb.is_active)
        }
    }

    public async delete(token: string){
        await super.getConnection().raw(`
            DELETE FROM ${BaseDataBase.REFRESHTOKEN_TABLE_NAME}
            WHERE refresh_token = "${token}"
        `)
    }
}
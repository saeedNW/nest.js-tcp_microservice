import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";
import { TaskModule } from "../task/task.module";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve("../.env"),
			isGlobal: true,
		}),

		UserModule,
		TaskModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./schema/task.schema";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve("../.env"),
			isGlobal: true,
		}),

		/** Initialize database connection */
		MongooseModule.forRoot("mongodb://127.0.0.1:27017/todo_microservice"),
		MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
	],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}

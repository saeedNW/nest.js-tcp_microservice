import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { UserModule } from "../user/user.module";

@Module({
	imports: [UserModule],
	controllers: [TaskController],
	providers: [
		{
			/**
			 * Add task microservice as a provider for task module
			 */
			provide: "TASK_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.TCP,
					options: {
						port: parseInt(process.env.TASK_SERVICE_PORT, 10), // Define microservice port
						host: "0.0.0.0", // Define microservice host
					},
				});
			},
		},
	],
})
export class TaskModule {}

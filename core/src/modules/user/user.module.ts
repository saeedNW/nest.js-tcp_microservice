import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

@Module({
	controllers: [UserController],
	providers: [
		{
			/**
			 * Add user microservice as a provider for user module
			 */
			provide: "USER_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.TCP,
					options: {
						port: parseInt(process.env.USER_SERVICE_PORT, 10), // Define microservice port
						host: "0.0.0.0", // Define microservice host
					},
				});
			},
		},
		{
			/**
			 * Add token microservice as a provider for user module
			 */
			provide: "TOKEN_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.TCP,
					options: {
						port: parseInt(process.env.TOKEN_SERVICE_PORT, 10), // Define microservice port
						host: "0.0.0.0", // Define microservice host
					},
				});
			},
		},
	],
	exports: ["USER_SERVICE", "TOKEN_SERVICE"],
})
export class UserModule {}

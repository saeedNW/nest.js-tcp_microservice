import { NestFactory } from "@nestjs/core";
import { TokenModule } from "./modules/token/token.module";
import { TcpOptions, Transport } from "@nestjs/microservices";
import { ServiceExceptionFilter } from "./common/Filters/exception.filter";

async function bootstrap() {
	/**
	 * Initializes a microservice application using the `createMicroservice` method.
	 * This is required for setting up a microservice instead of a standard HTTP-based application.
	 */
	const app = await NestFactory.createMicroservice(TokenModule, {
		// Define microservice transport layer
		transport: Transport.TCP,
		options: {
			port: parseInt(process.env.TOKEN_SERVICE_PORT, 10), // Define microservice port
			host: "0.0.0.0", // Define microservice host
		},
	} as TcpOptions);

	// initialize custom exception filter
	app.useGlobalFilters(new ServiceExceptionFilter());

	await app.listen();
	console.log(`Token service is running on ${process.env.TOKEN_SERVICE_URL}`);
}
bootstrap();

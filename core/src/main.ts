import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { swaggerConfiguration } from "./configs/swagger.config";
import { HttpExceptionFilter } from "./common/Filters/exception.filter";
import { ResponseTransformerInterceptor } from "./common/interceptor/response-transformer.interceptor";
import { UnprocessableEntityPipe } from "./common/pipe/unprocessable-entity.pipe";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// initialize custom exception filter
	app.useGlobalFilters(new HttpExceptionFilter());

	// initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe());

	// initialize custom response interceptor
	app.useGlobalInterceptors(new ResponseTransformerInterceptor());

	// initialize swagger
	swaggerConfiguration(app);

	// Define the port number to run the application
	const PORT = parseInt(process.env.CORE_APPLICATION_PORT, 10) || 3000;

	await app.listen(PORT, () =>
		console.log(`Core application is running on ${process.env.CORE_APPLICATION_URL}`)
	);
}
bootstrap();

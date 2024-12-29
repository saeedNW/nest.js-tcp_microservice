import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Query,
	Req,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { RegisterDto } from "./dto/register.dto";
import { lastValueFrom } from "rxjs";
import { plainToClass } from "class-transformer";
import { exceptionHandler } from "src/common/utilities/exception-handler.utility";
import { LoginDto } from "./dto/login.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Request } from "express";

@Controller("user")
@ApiTags("User")
export class UserController {
	constructor(
		/** Inject user microservice */
		@Inject("USER_SERVICE")
		private readonly userClientService: ClientProxy,

		/** Inject token microservice */
		@Inject("TOKEN_SERVICE")
		private tokenClientService: ClientProxy
	) {}

	/**
	 * Registers a new user.
	 * @param {RegisterDto} registerDto - The data transfer object containing user registration details.
	 */
	@Post("register")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	async register(@Body() registerDto: RegisterDto) {
		try {
			// Filter and transform the incoming data based on the required DTO class
			registerDto = plainToClass(RegisterDto, registerDto, {
				excludeExtraneousValues: true,
			});

			// Send the data to the user microservice register method
			const { userId } = await lastValueFrom(
				this.userClientService.send("register", registerDto)
			);

			// Send the user ID to the token microservice create-token method
			const { token } = await lastValueFrom(
				this.tokenClientService.send("create-token", { userId })
			);

			return {
				message: "User account created successfully",
				token,
			};
		} catch (error) {
			exceptionHandler(error);
		}
	}

	/**
	 * Logs in a user.
	 * @param {LoginDto} loginDto - The data transfer object containing user login details.
	 */
	@Post("login")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	async login(@Body() loginDto: LoginDto) {
		try {
			// Filter and transform the incoming data based on the required DTO class
			loginDto = plainToClass(LoginDto, loginDto, {
				excludeExtraneousValues: true,
			});

			// Send the data to the user microservice login method
			const { token } = await lastValueFrom(
				this.userClientService.send("login", loginDto)
			);

			return {
				message: "User logged in successfully",
				token,
			};
		} catch (err) {
			exceptionHandler(err);
		}
	}

	/**
	 * Retrieves all users.
	 * @param {PaginationDto} paginationDto - The pagination data transfer object.
	 */
	@Get()
	@AuthDecorator()
	async findAll(@Query() paginationDto: PaginationDto) {
		try {
			// Filter and transform the incoming data based on the paginate DTO class
			paginationDto = plainToClass(PaginationDto, paginationDto, {
				excludeExtraneousValues: true,
			});

			// Send the data to the user microservice find-all method
			const data = await lastValueFrom(
				this.userClientService.send("find-all", paginationDto)
			);

			return data;
		} catch (err) {
			exceptionHandler(err);
		}
	}

	/**
	 * Logs out the user by destroying their token.
	 * @param {Request} request - The request object containing the user's information.
	 */
	@Get("logout")
	@AuthDecorator()
	async logout(@Req() request: Request) {
		try {
			// Destructure the user ID from the request object
			const { _id: userId } = request?.user;
			// Send the user ID to the token microservice destroy-token method
			await lastValueFrom(
				this.tokenClientService.send("destroy-token", { userId })
			);

			return "User logged out successfully";
		} catch (err) {
			exceptionHandler(err);
		}
	}
}

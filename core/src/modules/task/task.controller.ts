import { Body, Controller, Get, Inject, Post, Req } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Request } from "express";
import { exceptionHandler } from "src/common/utilities/exception-handler.utility";
import { plainToClass } from "class-transformer";
import { lastValueFrom } from "rxjs";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("task")
@ApiTags("Task")
@AuthDecorator()
export class TaskController {
	constructor(
		/** Inject Task microservice */
		@Inject("TASK_SERVICE")
		private readonly taskClientService: ClientProxy
	) {}

	/**
	 * Creates a new task.
	 * @param {CreateTaskDto} createTaskDto - The data transfer object containing task creation details.
	 * @param {Request} request - The incoming request object.
	 */
	@Post()
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
		try {
			// Extract the user ID from the request object
			const { _id: userId } = request?.user;

			// Filter and transform the incoming data based on the required DTO class
			createTaskDto = plainToClass(CreateTaskDto, createTaskDto, {
				excludeExtraneousValues: true,
			});

			// Send the data to the task microservice create-task method
			const { task } = await lastValueFrom(
				this.taskClientService.send("create-task", { ...createTaskDto, userId })
			);

			return {
				message: "Task created successfully",
				task,
			};
		} catch (err) {
			exceptionHandler(err);
		}
	}

	/**
	 * Retrieves all tasks for the user.
	 * @param {Request} request - The incoming request object.
	 */
	@Get()
	async tasks(@Req() request: Request) {
		try {
			// Extract the user ID from the request object
			const { _id: userId } = request.user;
			// Send the user ID to the task microservice get-my-tasks method
			const newTaskResponse = await lastValueFrom(
				this.taskClientService.send("user-tasks", { userId })
			);

			return newTaskResponse;
		} catch (err) {
			exceptionHandler(err);
		}
	}
}

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchUserQuery } from "./search-user.query";
import { UsersService } from "src/core/users/users.service";

@QueryHandler(SearchUserQuery)
export class SearchUserHandler implements IQueryHandler<SearchUserQuery> {
  constructor(private userService: UsersService) {}

  async execute(query: SearchUserQuery) {
    const userId = query;
    const user = await this.userService.getProfile(userId.toString());
  }
}

import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this.authService.signin(email, password);
    res.status(200).json(result);
  }
}

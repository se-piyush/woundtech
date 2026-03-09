import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UnauthorizedError } from "../../errors";

const authService = new AuthService();

export class AuthController {
  async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const result = await authService.signin(email, password);
      res.status(200).json(result);
    } catch (error) {
      throw new UnauthorizedError("Invalid credentials");
    }
  }
}

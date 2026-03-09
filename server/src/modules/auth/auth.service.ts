import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { UnauthorizedError } from "../../errors";

const prisma = new PrismaClient();

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = "1h";

  constructor() {
    this.JWT_SECRET =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string, role: UserRole): string {
    return jwt.sign({ userId, email, role }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): {
    userId: string;
    email: string;
    role: UserRole;
  } {
    try {
      return jwt.verify(token, this.JWT_SECRET) as {
        userId: string;
        email: string;
        role: UserRole;
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: { id: string; email: string; role: UserRole };
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

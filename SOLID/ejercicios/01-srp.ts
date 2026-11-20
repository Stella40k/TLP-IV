//contrato de usuario
interface User {
  username: string;
  email: string;
}

class UserValidator {
  isValid(email: string): boolean {
    if (!email.includes("@")) {
      throw new Error("El correo no es valido ");
    }
    return true;
  }
}

class UserRepository {
  users: User[] = []; //array de tipo users q es la interfas q viene pre definida
  register(username: string, email: string): void {
    this.users.push({ username, email });
  }
}
class EmailService {
  sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

class UserRegistrationService {
  public userValidator: UserValidator;
  public userRepository: UserRepository;
  public emailService: EmailService;

  constructor(
    userValidator: UserValidator = new UserValidator(),
    userRepository: UserRepository = new UserRepository(),
    emailService: EmailService = new EmailService(),
  ) {
    this.userValidator = userValidator;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  newUser({ username, email }: User): string {
    this.emailService.sendWelcomeEmail(email);
    this.userValidator.isValid(email);
    this.userRepository.register(username, email);
    return `Usuario registrado: ${username}`;
  }
}

//prueba

const user = new UserRegistrationService();
const result = user.newUser({ username: "Chichi", email: "chihi@gmail.com" });

console.log(result);

// Preguntas:

// Que responsabilidades tiene UserManager?
// tienen la responsabilidad de validar correos, registrar users y enviar correos de bienvenida4

// Que ocurre si cambia la forma de guardar datos?
//si cambio la forma de guardar datos se deberia modificaar la claase UserRepository

// Que clase podria encargarse de enviar correos?
//EmailService se encarga de enviar correos

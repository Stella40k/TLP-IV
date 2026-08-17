//Getters y Setters son funciones disfrazadas de variables
//variable = guarda un dato o valor como texto o numero
//funcion = bloqie de codigo reutilizable q hace alguna tarea

//el sistema ejecuta secretamnete un codigo de validacion. Getter (get): se
//ejecuta cuando alguien lee el dato
//Setter(set): se ejecuta automaticamente cuando alfuien intenta modificar o
//asignar el dato (usando el signo =)

//set interceptan los datps q quieren entrar en la  variable. Si alguien quiere guardar
//un -5 el setter lo frena, revisa la logica (el if) y salta el error pero si es valido lo
//deja pasar y lo guarda

//get es el vocero, cuando alguien de afuera quiere saber la edad no puede mirar la variable
//privada directamente tiene que pregutarle a getter y este se encarga en devolver el valor

//usamos el codigo como si fuera una cariable normal pero por detras ts activa automaticamente
//los metodos de seguridad (ppedir ejemplos en clases)

class Persona {
  //private readonly hace q no se pueda ver desde afuera y
  // jamas se pueda modificar despues del constructor
  private readonly dni: string;

  //atributo/propiedad publica, con public le da acceso libre
  public nombre: string;

  //todo lo que guarde daros y est e dentro de una clase se le llama atributo
  //     _edad (con guion bajo): Es el atributo real (la caja física) que guarda el dato en secreto.
  //   - edad (sin guion bajo): Son los Getters y Setters. Actúan como la "puerta de seguridad" de la caja.
  //     * El 'set' (guardia): Valida el dato (ej. que no sea negativo) antes de guardarlo en _edad.
  //     * El 'get' (vocero): Te entrega el valor de _edad cuando lo pides.

  //   Usamos el guion bajo simplemente para que el nombre de la variable oculta
  //   no choque con el nombre del get/set.
  private _edad: number = 0;
  private _email: string = "";

  constructor(
    dni: string,
    nombre: string,
    edadInicial: number,
    emailInicial: string,
  ) {
    this.dni = dni;
    this.nombre = nombre;

    //al usar "this.edad" y "this.email" sin el guion bajo estamos obligando a q los datos iniciales
    //pasen por la seguridad de los setters
    this.edad = edadInicial;
    this.email = emailInicial;
  }

  //getter y settter de edad
  get edad(): number {
    return this._edad;
  }
  set edad(valor: number) {
    if (valor < 0 || valor > 120) {
      throw new Error("Error: la edad debe ser entre 0 y 120.");
    }
    this._edad = valor; // si pasa el if recien ahi lo guarda en la var oculta
  }

  // getter y setter de email
  get email(): string {
    return this._email;
  }

  set email(valor: string) {
    //si el texto no incluye el arroba debe lanzar el error
    if (!valor.includes("@")) {
      throw new Error(
        "Error: el email es invalido, debe contener un arroba (@).",
      );
    }
    this._email = valor;
  }

  //getters de calculo
  get esMayorDeEdad(): boolean {
    return this.edad >= 18;
  }
  get datosPublicos(): string {
    const estado = this.esMayorDeEdad ? "Mayor de edad" : "Menor de edad";
    return `Perfil: ${this.nombre} - ${estado}`;
  }
}

//pruebas
console.log("--- Creacion de persona ---");
const usuario = new Persona("46153403", "Chihi", 7, "gorda@gmail.com");
console.log(usuario.datosPublicos); // Perfil: chihi - Mayor de edad

console.log("\n--- Modificando datos usando Setters ---");
//llama internamente al 'set edad'
usuario.edad = 30;
console.log(`Nueva edad de chihi: ${usuario.edad}`); //  llama al 'get edad'

console.log("\n--- Pruebas de seguridad (Errores) ---");

try {
  console.log("Intentando poner edad negativa...");
  usuario.edad = -5; // el setter intercepta esto y lanza el error
} catch (error) {
  if (error instanceof Error) {
    console.error("Interceptado:", error.message);
  }
}

try {
  console.log("Intentando poner un correo sin arroba...");
  usuario.email = "gorda.com"; // el setter intercepta esto
} catch (error) {
  if (error instanceof Error) {
    console.error("Interceptado:", error.message);
  }
}

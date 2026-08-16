// Regla de trabajo: si npx tsc no está limpio, el código no está terminado.

class CuentaBAncaria {
  //palabra clave readonly para indicar que el valor no puede ser modificado
  readonly titular: string;
  //private para proteger datos para que nadie los rompa o acceda, obliga a respetar las reglas del codiso
  private saldo: number;
  private historial: string[];

  constructor(titular: string, saldo: number) {
    this.titular = titular;
    this.saldo = saldo;
    //historial de transacciones inicializado como un array vacio
    this.historial = [`Cuenta: +$${saldo}`];
  }

  //metodo para depositar dinero en la cuenta
  deposito(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto a depositar debe ser mayor a cero.");
    }
    this.saldo += monto;
    this.historial.push(`Deposito: +$${monto}`);
  }

  //metodo para retirar el dinero en cuenta
  retirar(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto debe ser mayor a cero.");
    }
    if (monto > this.saldo) {
      throw new Error("fondos insuficientes.");
    }
    //linea que descuenta
    //-= atajo matematico, lo mismo que escribir this.saldo = this.saldo - monto. Si el saldo es 5000 y retira
    //1500 (monto) le resta el monto al saldo y guarda el nuevo resultado como el saldo actual
    this.saldo -= monto;

    //anota lo que pasa en la cuenta(el arreglo historial)
    //push metodo para los arrays en js. "Empuja" o agrega un nuevo elemento al final de la lista
    //resta la plata y anota la lista de texto mostrando cuanto saco
    this.historial.push(`retiro: -$${monto}`);
  }

  //consultar saldo actual
  consultarSaldo(): number {
    return this.saldo;
  }
  //historial pero respetando las reglas
  obtenerHistorial(): string[] {
    return [...this.historial];
  }
}

//pruebass
console.log("---Creando cuenta..---");
const miCuenta = new CuentaBAncaria("Chihiro", 10000);
console.log(`Titular: ${miCuenta.titular}`);
console.log(`Saldo: $${miCuenta.consultarSaldo()} pesos.`);

//transacciones
console.log("\n---Realizando transaccion---");
miCuenta.deposito(2000);
console.log("\n---Transaccion exitosa---");
console.log(miCuenta.consultarSaldo());

miCuenta.retirar(1500);
console.log("\n---Retiro exitoso.---");
console.log(`Saldo disponible: $${miCuenta.consultarSaldo()}`);

//movimientos para comprobar el historial
console.log("\n---Realizando transaccion---");
miCuenta.deposito(5000);
console.log("\n---Transaccion exitosa---");
console.log(miCuenta.consultarSaldo());

miCuenta.retirar(1700);
console.log("\n---Retiro exitoso.---");
console.log(`Saldo disponible: $${miCuenta.consultarSaldo()}`);

//historial
console.log("\n---Historial de movimientos.---");
//obtengo el hist
const historialUsuario = miCuenta.obtenerHistorial();
console.log(historialUsuario);

//pruebas de aislamiento
historialUsuario.push("deposito falso: +$99999");
console.log("Intento de inyeccion");

// Verificamos si el historial real de la cuenta fue alterado
console.log("Historial REAL de la cuenta:");
console.log(miCuenta.obtenerHistorial());

//prueba de errores
console.log("\n---Errores.---");
try {
  miCuenta.retirar(800000); //prueba de so supera el saldo
} catch (error) {
  if (error instanceof Error) {
    //instanceof valida si la cariable pertenece a una clase especif.
    console.error("Error atrapado;", error.message);
  }
}

try {
  miCuenta.deposito(-500);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error atrapado: ", error.message);
  }
}

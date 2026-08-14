//Regla de trabajo: si npx tsc no está limpio, el código no está terminado.
class Producto {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  constructor(
    nombre: string,
    precio: number,
    categoria: string,
    stock: number,
  ) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  //cadena de texto que retorna coon el formato
  describir(): string {
    return `${this.nombre} (${this.categoria}): $${this.precio} — ${this.stock} unidades`;
  }
  stockDisponible(cantidad: number): boolean {
    return cantidad <= this.stock;
  }

  //verificacion del stock y aviso de error en caso de q no se cumpla
  venderUnidades(cantidad: number): void {
    //palabra clave q se usa para indicar funciones sin retonos de valor
    if (this.stockDisponible(cantidad)) {
      this.stock -= cantidad; //descuenta ddel stock original
      console.log(
        `Venta conbcluida: Se vendieron ${cantidad} unidades de ${this.nombre}.`,
      );
    } else {
      throw new Error("No hay suficiente stock para vender."); //dispara error si no hay suficiente stock
      //Just: decidi lanzar un Error porque en los sistemas de ventas
      //reales si se intenta vender sin stock es una operacion invvalida que debe
      //detener el flujo de ejecucuion y no procese el pago por errror
    }
  }

  //descuento sin modificar precio original
  aplicarDescuento(porcentaje: number): number {
    const descuento = (this.precio * porcentaje) / 100;
    return this.precio - descuento;
  }
}
//bloque de prueba

const teclado = new Producto("Teclado mecanico", 100, "Electronica", 5);

console.log("Descripcion del producto:", teclado.describir());

//prueba de descuento con el 20%
console.log("Precio con descuento del 20%:", teclado.aplicarDescuento(20));
console.log(`Precio original: $${teclado.precio}`);

//prueba de venta de unidades
console.log(
  "Stock disponible para vender 3 unidades:",
  teclado.stockDisponible(3),
);
try {
  teclado.venderUnidades(1);
  console.log("Stock restante después de la venta:", teclado.stock);
} catch (error) {
  console.error("Error:", error);
}

// //class Persona {
// //  nombre: string;
// edad: number;
//   constructor(nombre: string, edad: number) {
//     this.nombre = nombre;
//     this.edad = edad;
//   }
//   saludar(): string {
//     return `Hola, mi nombre es ${this.nombre} y tengo ${this.edad} años.`;
//   }
// }
// try {
//   //constancia objetos
//   const persona1 = new Persona("stella", 22);
//   const persona2 = new Persona("chihiro", 6);

//   //se muestra en consola
//   console.log("ejercicio1");
//   console.log("Datos de la persona 1:", persona1);
//   console.log("Datos de la persona 2:", persona2);

//   console.log(persona1.saludar());
//   console.log(persona2.saludar());
// } catch (error) {
//   console.error("Error:", error);
// }

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
  hayStock(cantidad: number): boolean {
    return cantidad > 0 && cantidad <= this.stock;
  }

  //verificacion del stock y aviso de error en caso de q no se cumpla
  venderUnidades(cantidad: number): void {
    //palabra clave q se usa para indicar funciones sin retonos de valor
    if (this.hayStock(cantidad)) {
      this.stock -= cantidad; //descuenta ddel stock original
      console.log(
        `Venta concluida: Se vendieron ${cantidad} unidades de ${this.nombre}.`,
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
  teclado.hayStock(3),
);
try {
  teclado.venderUnidades(1);
  console.log("Stock restante después de la venta:", teclado.stock);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}

try {
  teclado.venderUnidades(10);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error atrapado:", error.message);
  }
}

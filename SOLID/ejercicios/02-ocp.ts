// Interfaz comun para todos los metodos de pago
interface PaymentMethod {
  pay(amount: number): void;
}

// Clases concretas por cada medio de pago
class CardPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}

class CashPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}

class TransferPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con transferencia`);
  }
}

// PaymentProcessor ahora delega en el medio de pago recibido y está cerrado a modificación
class PaymentProcessor {
  pay(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

// Pruebas
const processor = new PaymentProcessor();

processor.pay(new CardPayment(), 12600);
processor.pay(new CashPayment(), 150000);
processor.pay(new TransferPayment(), 200000);

// Preguntas:

// Que parte debe modificarse para agregar pago con transferencia?
// No se modifica PaymentProcessor. Simplemente se crea una nueva clase que implemente PaymentMethod (ej: TransferPayment).

// Como podriamos representar un medio de pago?
// Mediante una interfaz (PaymentMethod) con un metodo comun pay(amount: number).

// Que comportamiento comun tienen todos los medios de pago?
// Todos reciben un monto y ejecutan la accion de cobro/pago correspondiente.

type PaymentType = "card" | "cash" | "transfer";

class PaymentProcessor {
  pay(type: PaymentType, amount: number): void {}
}
class PayWhitCard implements PaymentProcessor {
  pay(type: PaymentType, amount: number): void {
    type = "card";
    console.log(`Pagando ccon tarjeta ${amount} `);
  }
}

class PayWhitCash implements PaymentProcessor {
  pay(type: PaymentType, amount: number): void {
    ((type = "cash"), console.log(`Pagando con efectivo ${amount}`));
  }
}
class Transfer {
  pay(type: PaymentType, amount: number): void {
    type = "transfer";
    console.log(`Pagando con transferencia ${amount}`);
  }
}
const paymentProcessor = new PaymentProcessor().pay("card", 100);
//amount es la cantidad
const tarjeta = new PayWhitCard();
tarjeta.pay("card", 12600);
const efectivo = new PayWhitCash();
efectivo.pay("cash", 150000);
const mp = new Transfer();
mp.pay("transfer", 200000);

// Preguntas:

// Que parte debe modificarse para agregar pago con transferencia?
// se debe crear una nuefa clase que implementa la interface paymentprocess y
// se debe agregar un metodo pay q recibe el tipo de pago y el monto

// Como podriamos representar un medio de pago?
// se podria representar como una interface que tenga un metodo pay
//  que reciba el tipo de pago y el monto

// Que comportamiento comun tienen todos los medios de pago?
// todos los medios de pago tienen un metodo pay que recibe el tipo de pago y el monto

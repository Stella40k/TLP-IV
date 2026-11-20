// Las clases de alto nivel no deberian depender directamente de clases
// concretas de bajo nivel. Ambas deberian depender de abstracciones.

interface Notifier {
  send(to: string, message: string): void;
}

class EmailSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`Enviando correa a ${to}`);
  }
}

class OrderService {
  public notifier: Notifier;

  constructor(notifier: Notifier) {
    this.notifier = notifier;
  }

  createOrder(customerEmail: string): void {
    console.log("Pedido creado");
    this.notifier.send(customerEmail, "pedido creado");
  }
}
const notificador = new EmailSender();
new OrderService(notificador).createOrder("chihi@gorda.com");

// Preguntas:

// Que dependencia concreta crea OrderService?
// crea la dependencia de EmailSender q es una clase de bajo nivel de la cual no se debe
// depender directamente

// Como probarias la clase sin enviar un correo?
// con un mok pero no sabria bien como explicar ya que no probe y no use todavia

// Que contrato comun podrian implementar el correo y el SMS?
// se podria implementar una interface de notificador q tenga un metodo

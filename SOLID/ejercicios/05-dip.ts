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
// Crea la dependencia con EmailSender directamente en su metodo createOrder con 'new EmailSender()'.

// Como probarias la clase sin enviar un correo?
// Creando una clase 'MockNotifier implements Notifier' (o un doble de prueba) que solo registre las llamadas en memoria en lugar de enviar correos reales, y pasándosela a OrderService por constructor.

// Que contrato comun podrian implementar el correo y el SMS?
// La interfaz Notifier con el metodo send(to: string, message: string): void. Tanto EmailSender como SMSSender pueden implementarla.

//Es mejor tener varias interfaces pequenas y especificas que una interfaz grande
// que obligue a implementar metodos innecesarios.
interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(document: string): void;
}

interface Fax {
  fax(document: string): void;
}

class SimplePrinter implements Printer {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }

  //// scan(_document: string): void {
  //   throw new Error("Esta impresora no puede escanear");
  // }

  // fax(_document: string): void {
  //   throw new Error("Esta impresora no puede enviar fax");
  // }
}

new SimplePrinter().print("tarea.txt");

// Preguntas:

// Que metodo no necesita SimplePrinter?
//necesita el metodo print

// Que problema causa implementar metodos que lanzan errores?
// el prooblema es si se implementan metodos que lanzan errores puede ser inutil
//ya q la clase no utiliza esos cobtratos y no se pueden usar de forma correcta

// Como separar las capacidades de una impresora?
// se pueden separar en distintas interfaces donde cada una se encargue de una
// unica funcionalidad

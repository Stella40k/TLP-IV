//clase abstracta madre
abstract class Equipo {
  constructor(
    protected nombre: string,
    protected ram: string,
    protected procesador: string,
  ) {}

  //metodo abstracto q obligada a cada clase hija sus detalles
  abstract detalles(): string;
}
//clase hija para cada equipo
class Notebook extends Equipo {
  detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Desktop extends Equipo {
  detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Servidor extends Equipo {
  detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

//clase fabrica (Factory Method)
class EquipoFactory {
  //basado en "tipo", decide q clase instanciar
  public crearEquipo(
    tipo: string,
    nombre: string,
    ram: string,
    procesador: string,
  ): Equipo {
    switch (tipo) {
      case "Notebook":
        return new Notebook(nombre, ram, procesador);
      case "Desktop":
        return new Desktop(nombre, ram, procesador);
      case "Servidor":
        return new Servidor(nombre, ram, procesador);
      default:
        throw new Error(`Tipo de equipo no conocido: ${tipo}`);
    }
  }
}

//pruebas
const fabrica = new EquipoFactory();

const notebook = fabrica.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");
console.log(notebook.detalles());

const desktop = fabrica.crearEquipo(
  "Desktop",
  "Lenovo ThinkCentre",
  "32GB",
  "i9",
);
console.log(desktop.detalles());

const servidor = fabrica.crearEquipo("Servidor", "HP ProLiant", "64GB", "Xeon");
console.log(servidor.detalles());

//interfaz observador, separa en clases concretas
interface Observador {
  notificar(nombreEquipo: string, nuevoEstado: string): void;
}

//clase observador en especifico: soporte
class Soporte implements Observador {
  notificar(nombreEquipo: string, nuevoEstado: string): void {
    console.log(
      `Soporte notificado: ${nombreEquipo} ha cambiado su estado a ${nuevoEstado}.`,
    );
  }
}

class Equipo {
  private observadores: Observador[] = [];

  constructor(
    public nombre: string,
    public tipo: string,
    public estado: string,
  ) {}

  //permite subscribir observadores a la lista
  agregarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  //cambia el estado y avisa a todos los registrados/subs
  cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    this.notificarObservadores();
  }

  //recorre el array de obs
  private notificarObservadores(): void {
    for (const observador of this.observadores) {
      observador.notificar(this.nombre, this.estado);
    }
  }
}

//prueba
const soporte = new Soporte();
const equipo = new Equipo("Notebook HP", "Portatil", "disponible");

equipo.agregarObservador(soporte);
equipo.cambiarEstado("en reparacion");

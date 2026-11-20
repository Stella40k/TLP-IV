// Interfaz para tipar equipos registros
interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

//clase inventario con patron singleton
class Inventario {
  //propiedad estatica privada para almacenar la unica instancia
  private static instancia: Inventario;

  //arreglo privado para guardar los equipos registrados
  private equipos: Equipo[] = [];

  //constructor privado: evita que alguien cree deposito nuevo
  private constructor() {}

  //metodo estatico para obtener o crear instancias

  //instancia es un objeto real dentro de la memoria de la computadora
  //q se fabrica a partir de una clase

  //clase: modelo plano o recto. solo se escribe como deberia ser, no ocupa lugar
  //instancia: ya el objeto creado en base de la clase. Ocupa lugar en memoria y tiene datos

  //cuando es class... solo esta leyendo, no se guardan datos
  //cuando se ejecuta new.... usa el plano q viene de la clase
  // y crea un lugar en RAM para esos datos. Se lo instancia
  public static obtenerInstancia(): Inventario {
    if (!Inventario.instancia) {
      Inventario.instancia = new Inventario();
    }
    return Inventario.instancia;
  }

  //metodo estatico para obtener o crear instancias unicas
  public agregarEquipo(nombre: string, tipo: string, estado: string): void {
    const nuevoEquipo: Equipo = {
      nombre,
      tipo,
      estado,
    };
    this.equipos.push(nuevoEquipo);
  }

  //metodopara devolver el historial de equipos registrados
  public listarEquipos(): Equipo[] {
    return this.equipos;
  }
}

//prueba
const inventario = Inventario.obtenerInstancia();
inventario.agregarEquipo("Notebook HP", "Portatil", "disponible");
console.log(inventario.listarEquipos());

//comprobar ambas referencias al mismo objeto en memoria
const inventario2 = Inventario.obtenerInstancia();
inventario2.agregarEquipo('Monitor Dell 24"', "Periferico", "en reparacion");

console.log("Es la misma instancia?: ", inventario === inventario2);
console.log(inventario.listarEquipos());

//tipo para modelar equipo
interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

//interfaz objetivvo (contrato moderno para usar el sistema)
interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): Equipo[];
}

//sistema adaptado (clase vieja q tiene metodos distintos)
class InventarioViejo {
  private items: any[] = [];

  //metodo viejo q no encaja con la nueva interfaz
  agregarItem(item: any): void {
    this.items.push(item);
  }

  getItems(): any[] {
    return this.items;
  }
}

//adaptador(envuelve a la clase vieja y traduce a la nueva)
class AdaptadorInventario implements Inventario {
  private inventarioViejo: InventarioViejo;

  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }

  //traduce los parametros individuales al formato esperado
  agregarEquipo(nombre: string, tipo: string, estado: string): void {
    const item = {
      nombre,
      tipo,
      estado,
    };
    this.inventarioViejo.agregarItem(item);
  }

  //delega la captura de elementodos al metodo viejo
  listarEquipos(): Equipo[] {
    return this.inventarioViejo.getItems();
  }
}

//prueba
const inventarioViejo = new InventarioViejo();
const adaptador = new AdaptadorInventario(inventarioViejo);

adaptador.agregarEquipo("Servidor dell", "Servidor", "Disponible");
console.log(adaptador.listarEquipos());

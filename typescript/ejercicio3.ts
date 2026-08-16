//el polimorfismo esta armado por dos partes: "poli"= muchas y "morfismo" = formas
//el polimorfismo es la capacidad q tiene el codigo para dar una misma orden
//a diferentes objetos y q cada uno de estos responda a esa orden pero a su manera

//clase base
class Empleado {
  protected nombre: string;
  protected antiguedad: number;

  constructor(nombre: string, antiguedad: number) {
    //protected significa que solo esta clase y sus subclases (padres e hijas)
    //pueden acceder a estas variables. Si quieren acceder desde afuera no se
    // prodra pq estan bloqueadas
    this.nombre = nombre;
    this.antiguedad = antiguedad;
  }

  //la clase de base no sabe como es el sueldo, por defecto sera 0
  calcularSueldo(): number {
    return 0;
  }

  //este metodo no se reescribe en las subclasses
  //gracias al polimorfismo "this.calcularSueldo()" llamara a la formula
  //correcta dependiendo del tipo de empleado q sea
  describir(): string {
    return `${this.nombre} ${this.antiguedad} años - sueldo: $${this.calcularSueldo()}`;
  }
}

//subclase
//extend para heredar todo de la clase padre(Empleado)
class EmpleadoFijo extends Empleado {
  private sueldoBase: number;

  constructor(nombre: string, antiguedad: number, sueldoBase: number) {
    super(nombre, antiguedad);
    this.sueldoBase = sueldoBase;
  }

  //reemplazo el metodo de la clase padre con la formula real
  calcularSueldo(): number {
    //el bono del 2% (0.02) del sueldo base por cada año trabajado
    const bonoPorAntiguedad = this.sueldoBase * 0.02 * this.antiguedad;
    return this.sueldoBase + bonoPorAntiguedad;
  }
}

//priuebas

console.log("\n---Carga de empleado base---");
const empleado = new Empleado("CHaru", 7);
console.log(empleado.describir());

console.log("\n---Carga de empleado fijo.---");
const empleadoFijo = new EmpleadoFijo("Chihiro", 7, 100000);
console.log(empleadoFijo.describir());

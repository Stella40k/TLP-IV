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

//nueva subclase
class EmpleadoPorHoras extends Empleado {
  private horasTrabajadas: number;
  private valorHora: number;

  constructor(
    nombre: string,
    antiguedad: number,
    horasTrabajadas: number,
    valorHora: number,
  ) {
    super(nombre, antiguedad); //llamo al constructor empleado
    this.horasTrabajadas = horasTrabajadas;
    this.valorHora = valorHora;
  }

  // reescribo el metodo con la misma formula
  calcularSueldo(): number {
    return this.horasTrabajadas * this.valorHora;
  }
}

class EmpleadoPorComision extends Empleado {
  private ventasDelMes: number;
  private porcentajesPorComision: number;

  constructor(
    nombre: string,
    antiguedad: number,
    ventasDelMes: number,
    porcentajesPorComision: number,
  ) {
    super(nombre, antiguedad);
    this.ventasDelMes = ventasDelMes;
    this.porcentajesPorComision = porcentajesPorComision;
  }

  //reecribo el metodo
  calcularSueldo(): number {
    return (this.ventasDelMes * this.porcentajesPorComision) / 100;
  }
}

//parte de la funcion independiente
//funcion suelta por el principio de responsabilidad unica
function calcularNomina(empleados: Empleado[]): number {
  let totalAPagar = 0;

  //recorro el array sumando el sueldo de cada uno de los empleados
  for (const empleado of empleados) {
    totalAPagar += empleado.calcularSueldo();
  }
  return totalAPagar;
}
//priuebas

console.log("\n---Cargando lista de empleados---");
//creo un array mezclando todos los tipods de empleados
const listaEmpleados: Empleado[] = [
  new EmpleadoFijo("Chihiro (Fijo)", 5, 100000), // 100000 + 10% bono =110,000
  new EmpleadoPorHoras("Haru (Por Horas)", 2, 160, 500), // 160 horas x 500 = 80,000
  new EmpleadoPorComision("Nobara (Comisión)", 3, 500000, 10), // 10% de 500000 =50,000
];

console.log("\n---Detalles individuales.---");
//recorro el array llamando al metodos calcularSueldo si preguntar cual es cual
for (const empleado of listaEmpleados) {
  console.log(empleado.describir());
}

console.log("\n---Calcula de nomina total---");
const total = calcularNomina(listaEmpleados);
console.log(`Total a pagar por la empresa: $${total}`);

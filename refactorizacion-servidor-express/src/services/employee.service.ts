//aca se hara la inyeccion, tomo la herramienta construida en el repo
import { EmployeeRepository } from "../repositories/employee.repository";
import { IEmployee } from "../models/employee.model";

//este archivo es el encargado de la logica de negocio y se manejara por la Responsabilidad
//Unica (SRP). solo se debe ocupar de calcular bonos y salarios, nada mas

//DTO de entrada: defino que datos necesito recibir el servicio para dar de alta un epleado
//informacionn necesaria, no mas
export interface CreateEmployeeDTO {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
}
//DTO -> Objeto de Transferencia de Datos (modelo para transportar datos entre capas)
//el DTO es el paquete limpo q el controlador arma para darselo al servicio

//transportar datos entre capas es solo pasar objetos limpios como parametross de una
// funcion a otra. Usando al DTO como molde para garantizar q ninguna capa reciba otros
// datos de mas o incorrectos

//aca inyecto la dependencia
export class EmployeeService {
  //toda esta clase cumple con la responsabilidad unica y la inyeccion de devs
  //este constructor es la funcion q se ejecuta cuando alguien hace un new empleadoservice
  constructor(private readonly employeeRepo: EmployeeRepository) {}
  //el private reandonly empl.. es un atajo. Al poner private readonly delnte de un parametro
  //en un construc le croe automat una variable interna en la clase y le guardo el repo q pasaron
  //desde afuera

  //es una caja vacia, dentro necesito q tenga una herramientaa (employeeRepo) q le entrego desde afuera
  //para q la herramienta entre tendria q medir la caja y manualmente agarrar esa herramien. y meterlo dentro
  //al escribir private readonly es como si fuera una caja magica q hace todo eso en un movimiento:
  // crea el hueco interno
  //guardo la herramienta dentro del mismo
  //pravate le pone una tapa cerrada: esa herramiwnrta se usa solo desde adentro de la caja (nadie de afuera puede sacarmela)
  //reandonly le pone un seguro, una vez q entro esa  herramienta nadie puede cambiarla por otra o romperla siempre q la caja exista

  //aca se representa el calculo de la regla de negocios
  private calculateFinalSalary(
    //al usar el private escondemos la clase
    //nadie de afuera ni el controll ni rutas puede llamarlo directamente . Solo este archivo puede usarlo

    //estos son los parametros de entrada, para calcular tienn q recibir estos numeros
    baseSalary: number,
    yearsOfService: number,
  ): number {
    //aca le especificco el dato q saldra al terminar el metodo
    const bonus = baseSalary * 0.02 * yearsOfService;
    return baseSalary + bonus;
  }

  //aca creo un empleado aplicando la regla de negocio  ccon una funcion asincronica
  //espera a la bd para guardar este registro por eso devuelve una promesa ": Promise<IEmployee>"
  //cuando ttermina todo el proceso la fun entregara un empleado completo con el salario final y el id asignado por mongp
  async createEmployee(data: CreateEmployeeDTO): Promise<IEmployee> {
    //aca invoco el calculo, con this le digo q use la misma calculadora interna q esta dentro de la misma clase
    const finalSalary = this.calculateFinalSalary(
      data.baseSalary, //saco solo el salario base de la caja
      data.yearsOfService, //saco solo los añoss de servvicio de la caja
    );
    //llamo al repositorio (la herramienta guardada en la clase) para q inserte el doc en mongodb
    return await this.employeeRepo.create({
      ...data, //derrama todo lo q venia en la caja original (name, position, etc)
      finalSalary, //le suma al paquete el salario calculado recien
    });
  }
  //espera q la bd confirme q se guardo y devuelve el empleado xon su _id

  //estos son metodos puentes: el servicio no hace los calculos aca sino
  //q solo pude los datos al repo y se los devuelve al controlador
  async getAllEmployees(): Promise<IEmployee[]> {
    //promete devolver un array con los datos de los empleados encontrados
    //llamo a todos los empleados
    return await this.employeeRepo.findAll();
  }

  async getEmployeeById(id: string | string[]): Promise<IEmployee | null> {
    //devuelve el empleado si lo encontro o null
    return await this.employeeRepo.findById(id); //recibo eel texto con el id del empleado q busco
  }
}
// "Las clases deben depender de abstracciones y no de implementaciones concretas.
// ¿Por qué importa? Depender de clases concretas acopla el código y dificulta cambiar
// implementaciones —por ejemplo, para testear con mocks o cambiar de proveedor"

//la implementacion concreta q hago aca es: mi clase EmployeeRepository pq dentro
//usa EmployeeModel.create() q es codifo exclusivo de mongo y mongoose

//si EmployeeService depende directamente de la clase fija cada vez q yo quiera probar la formula
//voy a tener mongodb prendido y funcionando

//la solucion entonces es la DIP, cuando le paso por parametros el repo (q es una inyeccion) si mañana
//quiero cambiar o hacer pruebas sin tocar un bd real puedo pasarle al constructor. El servicio seguira calculando
//pq solo le importa el objeto q le pasamos con los metodos.

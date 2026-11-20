//aca se hace la persistencia
//se encapsula todo mongoose opara q ninguna otra capa dependa de la bd

import { EmployeeModel, IEmployee } from "../models/employee.model";

//type = interface
//creo un molde donde indico los datos de entrada necesarios para crear un empleado
//Omit<...> herramienta nativa de ts con la funcion de restar o quitar propiedades. Le quito
//los creat y update q vienen por defecto de mongo
export type CreateEmployeeInput = Omit<IEmployee, "createdAt" | "updatedAt">;

//instancio una nueva clase q es una plantilla q agrupa las operaciones de la bd para instanciarlas
//y pasarlas por parametros (por inyeccion de devs)

//*el EmployeeModel no es la lista suno un modelo de mongoose que se conecta a mongo
//*EmployeeRepository es LA CLASE q usa ese modelo para accionar en la bd
//* y EmployeeService no usa directamente EmployeeModel sino q el service debe hablar unicamente con la clase EmployeeRepository

//aca aplico tres funciones basias de la bd (las operaciones crud q saque del app)

//create(data): recibe los datos limpios de un empleado en la variable "data"
//llamo a EmployeeModel.create(data) para q mongoose haga un insert a la mongo
//devuelvo el empleado RECIEN AHI GUARDADO
export class EmployeeRepository {
  async create(data: CreateEmployeeInput): Promise<IEmployee> {
    return await EmployeeModel.create(data);
  }

  //findAll(): llamo a EmployeeModel.find() para traer todos los documentos de la coleccion
  //le agrego .sort({ createdAt: -1 }) para q los ordene del mas nuevo al mas viejo
  //devuelvo una lista cmpleta de los empleado
  async findAll(): Promise<IEmployee[]> {
    //.sort es un metodo de consulta de mongoose y es para
    //ordenatr los resultados de la bd antes de entregarlos
    return await EmployeeModel.find().sort({ createdAt: -1 });
  }

  //findById(id): recibe el texto con el id (id: string), llamo al EmployeeModel.findById(id)
  //para buscar ese unico documento por su _id y si lo encuentra devuelve el empleado, sino tira null
  async findById(id: string | string[]): Promise<IEmployee | null> {
    return await EmployeeModel.findById(id);
  }
}

//esta clase SERA LA Q SE INYECTARA en el service. aca solo fabrico una herramienta

//aca es el intermediario con la bd, se adapta. Su unica responsabilidad es ser la unica clase
//autorizada a tocar mongoose.

//sin este archivo , cualquier parte del sistema puede llamar directamente a EmployeeModel.create()
// o EmployeeModel.find() al meterlo dentro de esta clase lo escondo del resto del programa

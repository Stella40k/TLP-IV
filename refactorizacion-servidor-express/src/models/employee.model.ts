import { Schema, model } from "mongoose";
//aislamiento de datos. Se extrae todo lo q dependa de mongoosee
//del server, osea, todo lo q sea hablar con la bd estara aca

//esta interfas sera mi modelo de bd. ANtes tenia el esquema en server
//lo q viola el principio de la Responsabilidad Únicaa.
//si mañana quiero agregar algo lo hago aca y se aplica automaticamente

//sin la interfas ts no sabra q propiedades hay en la variable de employee. Saltaria un any.
//con la interfas le digo a ts como debe ser un empleado, is o si
//estas 5 propiedades y con estos tipos especificos. Tambien a
export interface IEmployee {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
  finalSalary: number;
}

//con esto tambien puedo acceder a todas las claves valor q hay dentro de la interfas
//y avisara sobre errores o asy. Esa misma interfaz se puede usar en otros, no depende
//  de tipos suno de contratos explicitos

//el esquema es para la configuracion de mongoose usa para
//cuando la app ya esta funcionando  al usar <IEmployee> ts comprueba q los campos se definen
//dentro del objeto coincidan con la interfaz.
const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    yearsOfService: { type: Number, required: true },
    finalSalary: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const EmployeeModel = model<IEmployee>("Employee", employeeSchema);
//con model tomo lo que cree y construyo la herramienta/clase
//'Employee' es el nombre q toma y buscara o creara en la bd
//"employeeSchema" le indica a mongoosse q use esas reglas, validaciones y campos para esa coleccion
//"EmployeeModel" objeto q contiene los metodfos de consulta. Por eso exporto estopara poder hacer las ejecuciones reales

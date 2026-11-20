import { Request, Response, NextFunction } from "express";
//red de seguridad de toda la app, atrapa cualquier fallo para q la app no se caiga

//extend error es una clase de errores de js. Js lo trae de fabrica y se activa cuando algfo falla
export class AppError extends Error {
  constructor(
    //Creo una caja publica dentro de la clase y guarda el valor dentro apenas nace el objeto
    //esta caja como tiene readonly no se puede modifica, nadie puede cambiar el valor del error. Solo leerlo no reescribirlo

    //creo una caja llamada statusCode q guarda ahi el numero q me pases y permite q cualquiera
    //pueda ver contenidos pero no q se cambie
    public readonly statusCode: number,
    message: string, //una vez se guarda el codigo del error dse devuelve un mensaje explicativo del error
  ) {
    super(message);
    //cuando heredo de la clase hja (AppError) no puedo empezar con la configuacion hasta q la clase padre (Error)
    //haya hecho su trabajo inicial

    //la clase padre (Error)construye los cimientos y paredes
    //la clase hija (AppError) quiere construir el segundo piso (agrega los status)
    this.name = "AppError";
  }
}

//viene a ser como un filtro final
export const errorHandler = (
  //le mando cuatro parametros
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    //pregunto si el error es nuestro o a prposito. Si es si da un codigo y msj descriptivo
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err); //si es no, es un eeror desconocido no muestra detalles tecnicos por seguridad, imprime un detalle
  //con un console y responde con el msj generico de 500-..
  return res.status(500).json({ message: "Error interno del servidor" });
};

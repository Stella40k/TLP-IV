//en este bloque esta:
//el req.body q es el cuerpo de la solicitud
//calcula y aplica las reglas de negocio (el salario finañ)
//valida datos de entrada
//habla con la bd
//y encima maneja los errores y responde al cliente

//se cconstruira una arq siguiendo un flujo de peticiones con un camino unidireccional

//cliente -> rutas (q solo definen las url y metodos) -> controladores (extrae los req.bodys/parametros, valida y responde) -> servicios (regla de negocios pura: calculo del bono y asi) -> repositoriso(habla cpn la bd)

//esto seria una arq en capas, lo podemos identificar por como estan
// agrupadas las carpetas (especificas y con sus responsabilidades cada una.
//  No por modulos). Se comunican entre ellas de forma lineal

//esta arq es conveniente y muy usada pq:
//*Mantenible: un cambio en la bd o en librerias no rompera las reglas de negicios
//*Testeable:podemos probar las reglas de negocios (serivicios) sin necesidad de un servidor o una bd reañ
//*Escalable: podemos trabajarlo en grupo de forma paralelas en cada capa sin hacer conflictos
//*Reutulizables: los services se peden re usar con otros puntos de entradas

import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

startServer();

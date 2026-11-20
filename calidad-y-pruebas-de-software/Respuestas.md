**Preguntas:** ¿qué archivo contiene la regla de cálculo? ¿Qué archivo define la ruta HTTP? ¿En qué se diferencian sus responsabilidades?

- src/services/precios.ts contiene la regla de cálculo
- src/app.ts define la ruta HTTP

**Leé la prueba que contiene `calcularPrecioFinal(1000, 150)`. ¿Qué comportamiento exige? ¿Qué hace realmente el código? **Todavía no modifiques la implementación.**

- Salen errores a proposito para enseñarnos como el test detecta defectos o errores antes de modificar el codigo.
- Sale un error intencional rehazando el descuento superior a 100% pero el codigo no lo rechaza (primer error antes de modificar codigo)

**Observá que la función se escribe dentro de `() => ...` para que Vitest pueda ejecutarla y comprobar si lanza un error. Es distinto de pasar directamente el resultado de la función a `expect`.**

**1. ¿Qué total devuelve actualmente un descuento del 150 % sobre $1.000?**
- Devuelve un error: "RangeError" o error de rango porque no se lo programo para rechazar descientos mayores a %100. Y el total que devuelve es -500

**2. ¿Por qué ese resultado no cumple la regla de negocio?**
- Porque la regla de negocios dice que no se pueden aplicar descuentos <100% o 0> y el resultado da un valor negativo

**3. ¿Por qué la prueba falla si la función terminó de ejecutarse?**
- La prueba falla porque esperaba que la funcion se interrumpiera lanzando un error (RangeError) al recibir un descuento invalido. En lugar de eso, la funcion se ejecuto hasta el final y devolvio un resultado numerico (-500) por ende hay que aplicar validaciones.

**¿La validación actual lo rechaza?**

- si, lanza un error de rango(RangeError)

**Explicá por qué esta comprobación es de **integración** y no solamente una prueba unitaria.**

- Prueba unitaria: prueba solo una fun o modulo de forma aislada (como si llamaramos directamente a las funciiones pero sin el servidor http)

- Prueba de integracion: veridica o controla uno o mas modulos juntos. Verifica multiples capas y componentes del sistemana, si colaboran y que interactuen correctamente entre si

- Siguiendo esto, esta prueba es de integracion porque verifican como se comportan: express, los middlewares, los controladores y el servicio y el manejo de errores. Los prueba en conjunto y no aislada.

**¿por qué conviene utilizar tanto `typecheck` como `npm test`?**

- Conviene usar los dos porqur son herramientas complementarias que atrapan distinros errores:

    **typecheck:** detecta errores de tipos estaticos y estructura del codigo (errores antes de que el codigo se ejecute). Analisiz estaticos sin ejecutar codigo asegurando los tipos de datos y propiedades sean correctas en la app

    **npm test:** detecta errores en tiempo de ejecucion, como bugs en la logica del negocio, manejo de errores, etc. Verifica de forma dinamica ejecutando el codigo y comprobando la log de negocio, validaciones y respuestas htpp

Ninguno reemplaza, ts no detecra fallas en las reglas de negocio y los test unitarios no revisan la coheremcia de tiops 

**Preguntas de cierre**

1. ¿Qué diferencia hay entre comprobar manualmente una respuesta y ejecutar una prueba automatizada?
- La comprovacion manual es lenta y propensa a tener fallos y muy molesto de repetir continuamente. La prueba automatizada se ejecuta rapido (en milisegundos), es reproducible, compara resultados con los esperados y se pueden ejecutar con cada commit mediante CI

2. ¿Cuál fue la causa de la primera prueba fallida?
-  'calcularPrecioFinal' no tenia validaciones, seguia devolviendo aunque no aplicaba o no tenia logica en vez de tirar la expecion 

3. ¿Por qué es útil incluir casos inválidos además de los casos habituales?
- Para asegurar el software frente a tador errados. Aseguramos que el sistema responda segun lo esperado, sin datos incosistentes o huecos donde puedan producirse errores o fallos de logica

4. ¿Qué parte del sistema comprueba `tests/precios.test.ts` y qué partes comprueba `tests/api.test.ts`?
- **tests/precios.test.ts:** comprueba de forma unitaria lam logica (la funcion y las validaciones)
- **tests/api.test.ts:** comprueba de formas intefradaas las chttp, las rutas y codigos de estado con el manejo de errores

5. ¿Qué ventajas ofrece ejecutar las pruebas después de cada modificación?
- detectan errores inmediatamente, ayudan a mantener la calidad del codigo, facilitan refactorizacion, son automaticas y rapidas y ayudan a entender el comportamiento del codigo
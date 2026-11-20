//calcula el precio luego de aplicar un porcentaje de descuento
export function calcularPrecioFinal(precio: number, descuento: number): number {
  //validacion del precio
  if (!Number.isFinite(precio) || precio < 0) {
    throw new RangeError('El precio debe ser finito igual o mayor a cero')
  }
  //validacion del descuento
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new RangeError('El descuento debe ser un número finito entre 0 y 100')
  }

  return precio - (precio * descuento) / 100;
}

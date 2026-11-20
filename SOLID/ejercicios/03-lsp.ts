interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  protected side: number;

  constructor(side: number) {
    this.side = side;
  }

  setSide(side: number): void {
    this.side = side;
  }

  area(): number {
    return this.side * this.side;
  }
}

function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
}

resizeRectangle(new Rectangle(1, 1));

//se saca la otra variable porque espera un rectangulo, si rompo la herencia no se ´puede calcular

// Preguntas:

// Por que el area final no coincide con lo que espera resizeRectangle?
//no coincide porque se esta usando un cuadrado que tiene misma h y a que trae por herencia de un cuadrado

// Es siempre correcto modelar un cuadrado como un rectangulo por herencia?
// no siempre, para eso se deberian hacer class separadas

// Que abstraccion comun podriamos usar?
// al usar shape se permite a cada uno calcular el area de la forma en que convenga segun la class

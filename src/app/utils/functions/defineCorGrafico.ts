export function DefineCor(valor: number): string{
    const minSaldo = -2000;
    const maxSaldo = 2000;
    // Clampe o saldo dentro do intervalo
    let saldo = Math.max(minSaldo, Math.min(maxSaldo, valor));

    // Normaliza o saldo para o intervalo [0, 1]
    const normalized = (saldo - minSaldo) / (maxSaldo - minSaldo);

    // Cores de gradiente: vermelho -> laranja -> verde -> azul
    const startColor = { r: 187, g: 72, b: 18 }; // vermelho pastel
    const midColor1 = { r: 223, g: 126, b: 62 }; // laranja pastel
    const midColor2 = { r: 63, g: 141, b: 76 }; // verde pastel
    const endColor = { r: 78, g: 156, b: 156 }; // azul pastel

    let color;

    if (normalized < 0.5) {
      // Transição do vermelho para o laranja
      color = interpolateColor(startColor, midColor1, normalized * 3);
    } else if (normalized < 0.66) {
      // Transição do laranja para o verde
      color = interpolateColor(midColor1, midColor2, (normalized - 0.33) * 3);
    } else {
      // Transição do verde para o azul
      color = interpolateColor(midColor2, endColor, (normalized - 0.66) * 3);
    }

    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

  // Função para interpolar entre duas cores
function interpolateColor(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }, factor: number): { r: number, g: number, b: number } {
    const result = {
      r: Math.round(color1.r + factor * (color2.r - color1.r)),
      g: Math.round(color1.g + factor * (color2.g - color1.g)),
      b: Math.round(color1.b + factor * (color2.b - color1.b))
    };
    return result;
}

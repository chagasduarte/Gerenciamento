export function defineImagem(tipoDespesa: number): string {
   
    switch(tipoDespesa) {
      case 1:
        return "/assets/img/food-wine-cheese-bread-national-culture-paris.svg";
      case 2:
        return "/assets/img/sport-utility-vehicle.svg";
      case 3: 
        return "/assets/img/health.svg";
      case 4: 
        return "/assets/img/books.svg";
      case 5:
        return "/assets/img/beach.svg";
      case 6:
        return "/assets/img/house-with-garden.svg";
      case 7:
        return "/assets/img/customer-service.svg";
      case 8: 
        return "/assets/img/tools-chainsaw.svg";
    }
    return "";
}
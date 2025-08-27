// Serviço utilitário para filtros
export class FilterUtils {
  static filtrarPorCampo(valor: any, valorFiltro: string): boolean {
    if (!valorFiltro) return true;
    return valor?.toString().toLowerCase().includes(valorFiltro.toLowerCase()) ?? false;
  }

  static filtrarPorData(data: Date | string | undefined, dataFiltro: string): boolean {
    if (!dataFiltro) return true;
    if (!data) return false;
    
    const dataObj = new Date(data);
    const dataFiltroObj = new Date(dataFiltro);
    
    return dataObj.toDateString() === dataFiltroObj.toDateString();
  }
}
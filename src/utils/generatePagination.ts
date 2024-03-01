

export const generatePaginationNumber = (currentPage: number, totalPages: number) => {

    if(totalPages <= 5 ) {
        return Array.from({length: totalPages}, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
      }
    
      //si la pagina actual esta entre las ultimas 3
      //mostrar las 2 primaras, puntos suspensivos, las ultimas tres paginas, por eso estas restas: totalPages - 2, totalPages - 1, totalPages
      // 50 - 2 = 48, 50 - 1 = 49, 50 = 50 ejemplo de los anterior
      if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
      }

      //si la pagina esta en otro lugar muestra esto
    
      return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
      ];
}   
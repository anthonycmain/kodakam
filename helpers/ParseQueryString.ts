// export const parseQueryString = (string: string): { [key: string]: string } => {
//     return string
//       .slice(1)
//       .split("&")
//       .map((queryParam) => {
//         let kvp = queryParam.split("=")
//         return { key: kvp[0], value: kvp[1] }
//       })
//       .reduce((query, kvp) => {
//         query[kvp.key] = kvp.value
//         return query
//       }, {})
//   }

export const parseQueryString = (queryString: string): { key: string, value: string }[] => {
    const queryParams = queryString.slice(1).split("&");
    
    return queryParams.map((queryParam) => {
      const [key, value] = queryParam.split("=");
      return { key, value };
    });
  };
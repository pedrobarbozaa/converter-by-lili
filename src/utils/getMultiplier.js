const getMultiplier = (formType) => { //Abstrair
  switch (formType) {
    case 'radius':
      return 2*Math.PI;
    case 'circunference':
      return 1/(2*Math.PI);
    case 'waist': 
      return 3;
    case 'hip':
      return 1/16;
    default:
      return 1;
  }
};

export default getMultiplier
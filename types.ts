export interface Domicilio {
  nombre: string;
  apellido: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  pais?: string;
}

export interface AppliancePreset {
  id: string;
  name: string;
  powerW: number;
  hoursPerDayDefault: number;
}

export interface CustomAppliance {
  id: string;
  name: string;
  cantidad: number;
  consumptionWh: number; // Watt-hours per day total for this row
  hoursPerDay: number;
}

export interface ProvinceData {
  name: string;
  hsp: number; // Horas de Sol Pico (Peak Sun Hours)
}

export interface CountryData {
  name: string;
  code: string;
  provinces: ProvinceData[];
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    name: "Argentina",
    code: "AR",
    provinces: [
      { name: "Entre Ríos", hsp: 4.2 },
      { name: "Buenos Aires", hsp: 3.8 },
      { name: "Capital Federal", hsp: 3.7 },
      { name: "Córdoba", hsp: 4.5 },
      { name: "Santa Fe", hsp: 4.1 },
      { name: "Corrientes", hsp: 4.3 },
      { name: "Misiones", hsp: 4.0 },
      { name: "Chaco", hsp: 4.6 },
      { name: "Formosa", hsp: 4.7 },
      { name: "Santiago del Estero", hsp: 4.8 },
      { name: "Tucumán", hsp: 4.6 },
      { name: "Salta", hsp: 5.2 },
      { name: "Jujuy", hsp: 5.5 },
      { name: "Catamarca", hsp: 5.4 },
      { name: "La Rioja", hsp: 5.3 },
      { name: "San Juan", hsp: 5.6 },
      { name: "Mendoza", hsp: 5.1 },
      { name: "San Luis", hsp: 4.8 },
      { name: "La Pampa", hsp: 4.0 },
      { name: "Neuquén", hsp: 3.9 },
      { name: "Río Negro", hsp: 3.5 },
      { name: "Chubut", hsp: 3.2 },
      { name: "Santa Cruz", hsp: 2.8 },
      { name: "Tierra del Fuego", hsp: 2.2 }
    ]
  },
  {
    name: "Brasil",
    code: "BR",
    provinces: [
      { name: "Acre", hsp: 4.1 },
      { name: "Alagoas", hsp: 5.4 },
      { name: "Amapá", hsp: 4.3 },
      { name: "Amazonas", hsp: 4.0 },
      { name: "Bahia", hsp: 5.5 },
      { name: "Ceará", hsp: 5.7 },
      { name: "Distrito Federal", hsp: 5.3 },
      { name: "Espírito Santo", hsp: 4.6 },
      { name: "Goiás", hsp: 5.4 },
      { name: "Maranhão", hsp: 5.2 },
      { name: "Mato Grosso", hsp: 5.1 },
      { name: "Mato Grosso do Sul", hsp: 5.0 },
      { name: "Minas Gerais", hsp: 5.2 },
      { name: "Pará", hsp: 4.5 },
      { name: "Paraíba", hsp: 5.6 },
      { name: "Paraná", hsp: 4.4 },
      { name: "Pernambuco", hsp: 5.6 },
      { name: "Piauí", hsp: 5.8 },
      { name: "Rio de Janeiro", hsp: 4.7 },
      { name: "Rio Grande do Norte", hsp: 5.8 },
      { name: "Rio Grande do Sul", hsp: 4.2 },
      { name: "Rondônia", hsp: 4.4 },
      { name: "Roraima", hsp: 4.6 },
      { name: "Santa Catarina", hsp: 4.1 },
      { name: "São Paulo", hsp: 4.8 },
      { name: "Sergipe", hsp: 5.3 },
      { name: "Tocantins", hsp: 5.3 }
    ]
  },
  {
    name: "Chile",
    code: "CL",
    provinces: [
      { name: "Arica y Parinacota", hsp: 6.2 },
      { name: "Tarapacá", hsp: 6.1 },
      { name: "Antofagasta", hsp: 6.5 },
      { name: "Atacama", hsp: 6.3 },
      { name: "Coquimbo", hsp: 5.5 },
      { name: "Valparaíso", hsp: 4.8 },
      { name: "Metropolitana de Santiago", hsp: 4.6 },
      { name: "O'Higgins", hsp: 4.4 },
      { name: "Maule", hsp: 4.2 },
      { name: "Ñuble", hsp: 4.1 },
      { name: "Biobío", hsp: 3.9 },
      { name: "Araucanía", hsp: 3.6 },
      { name: "Los Ríos", hsp: 3.2 },
      { name: "Los Lagos", hsp: 3.0 },
      { name: "Aysén", hsp: 2.6 },
      { name: "Magallanes", hsp: 2.2 }
    ]
  },
  {
    name: "Colombia",
    code: "CO",
    provinces: [
      { name: "Amazonas", hsp: 4.0 },
      { name: "Antioquia", hsp: 4.2 },
      { name: "Arauca", hsp: 4.8 },
      { name: "Atlántico", hsp: 5.4 },
      { name: "Bogotá D.C.", hsp: 4.0 },
      { name: "Bolívar", hsp: 5.2 },
      { name: "Boyacá", hsp: 4.3 },
      { name: "Caldas", hsp: 4.1 },
      { name: "Caquetá", hsp: 3.8 },
      { name: "Casanare", hsp: 4.6 },
      { name: "Cauca", hsp: 4.2 },
      { name: "Cesar", hsp: 5.3 },
      { name: "Chocó", hsp: 3.2 },
      { name: "Córdoba", hsp: 5.0 },
      { name: "Cundinamarca", hsp: 4.0 },
      { name: "Guainía", hsp: 4.2 },
      { name: "Guaviare", hsp: 4.1 },
      { name: "Huila", hsp: 4.8 },
      { name: "La Guajira", hsp: 6.0 },
      { name: "Magdalena", hsp: 5.4 },
      { name: "Meta", hsp: 4.5 },
      { name: "Nariño", hsp: 4.1 },
      { name: "Norte de Santander", hsp: 4.6 },
      { name: "Putumayo", hsp: 3.7 },
      { name: "Quindío", hsp: 4.1 },
      { name: "Risaralda", hsp: 4.1 },
      { name: "San Andrés y Providencia", hsp: 5.5 },
      { name: "Santander", hsp: 4.3 },
      { name: "Sucre", hsp: 5.1 },
      { name: "Tolima", hsp: 4.6 },
      { name: "Valle del Cauca", hsp: 4.5 },
      { name: "Vaupés", hsp: 3.9 },
      { name: "Vichada", hsp: 4.7 }
    ]
  },
  {
    name: "España",
    code: "ES",
    provinces: [
      { name: "Álava", hsp: 3.8 },
      { name: "Albacete", hsp: 5.0 },
      { name: "Alicante", hsp: 5.1 },
      { name: "Almería", hsp: 5.5 },
      { name: "Asturias", hsp: 3.4 },
      { name: "Ávila", hsp: 4.7 },
      { name: "Badajoz", hsp: 5.2 },
      { name: "Baleares", hsp: 4.7 },
      { name: "Barcelona", hsp: 4.4 },
      { name: "Burgos", hsp: 4.0 },
      { name: "Cáceres", hsp: 5.0 },
      { name: "Cádiz", hsp: 5.4 },
      { name: "Cantabria", hsp: 3.4 },
      { name: "Castellón", hsp: 4.8 },
      { name: "Ceuta", hsp: 5.0 },
      { name: "Ciudad Real", hsp: 5.1 },
      { name: "Córdoba", hsp: 5.3 },
      { name: "La Coruña", hsp: 3.5 },
      { name: "Cuenca", hsp: 4.9 },
      { name: "Gerona", hsp: 4.3 },
      { name: "Granada", hsp: 5.4 },
      { name: "Guadalajara", hsp: 4.7 },
      { name: "Guipúzcoa", hsp: 3.4 },
      { name: "Huelva", hsp: 5.4 },
      { name: "Huesca", hsp: 4.5 },
      { name: "Jaén", hsp: 5.2 },
      { name: "León", hsp: 4.3 },
      { name: "Lérida", hsp: 4.5 },
      { name: "Lugo", hsp: 3.5 },
      { name: "Madrid", hsp: 4.9 },
      { name: "Málaga", hsp: 5.4 },
      { name: "Melilla", hsp: 5.1 },
      { name: "Murcia", hsp: 5.2 },
      { name: "Navarra", hsp: 3.9 },
      { name: "Orense", hsp: 3.8 },
      { name: "Palencia", hsp: 4.2 },
      { name: "Las Palmas", hsp: 5.6 },
      { name: "Pontevedra", hsp: 3.6 },
      { name: "La Rioja", hsp: 4.2 },
      { name: "Salamanca", hsp: 4.6 },
      { name: "Santa Cruz de Tenerife", hsp: 5.5 },
      { name: "Segovia", hsp: 4.6 },
      { name: "Sevilla", hsp: 5.4 },
      { name: "Soria", hsp: 4.4 },
      { name: "Tarragona", hsp: 4.6 },
      { name: "Teruel", hsp: 4.7 },
      { name: "Toledo", hsp: 5.0 },
      { name: "Valencia", hsp: 4.8 },
      { name: "Valladolid", hsp: 4.4 },
      { name: "Vizcaya", hsp: 3.3 },
      { name: "Zamora", hsp: 4.5 },
      { name: "Zaragoza", hsp: 4.6 }
    ]
  },
  {
    name: "Estados Unidos (USA)",
    code: "US",
    provinces: [
      { name: "Alabama", hsp: 4.6 },
      { name: "Alaska", hsp: 2.5 },
      { name: "Arizona", hsp: 6.4 },
      { name: "Arkansas", hsp: 4.5 },
      { name: "California", hsp: 5.6 },
      { name: "Colorado", hsp: 5.2 },
      { name: "Connecticut", hsp: 3.9 },
      { name: "Delaware", hsp: 4.1 },
      { name: "Florida", hsp: 4.8 },
      { name: "Georgia", hsp: 4.7 },
      { name: "Hawaii", hsp: 5.5 },
      { name: "Idaho", hsp: 4.4 },
      { name: "Illinois", hsp: 4.1 },
      { name: "Indiana", hsp: 4.0 },
      { name: "Iowa", hsp: 4.2 },
      { name: "Kansas", hsp: 4.9 },
      { name: "Kentucky", hsp: 4.2 },
      { name: "Louisiana", hsp: 4.5 },
      { name: "Maine", hsp: 3.8 },
      { name: "Maryland", hsp: 4.1 },
      { name: "Massachusetts", hsp: 3.9 },
      { name: "Michigan", hsp: 3.8 },
      { name: "Minnesota", hsp: 4.0 },
      { name: "Mississippi", hsp: 4.6 },
      { name: "Missouri", hsp: 4.4 },
      { name: "Montana", hsp: 4.1 },
      { name: "Nebraska", hsp: 4.7 },
      { name: "Nevada", hsp: 6.0 },
      { name: "New Hampshire", hsp: 3.8 },
      { name: "New Jersey", hsp: 4.0 },
      { name: "New Mexico", hsp: 6.2 },
      { name: "New York", hsp: 3.8 },
      { name: "North Carolina", hsp: 4.5 },
      { name: "North Dakota", hsp: 4.1 },
      { name: "Ohio", hsp: 3.9 },
      { name: "Oklahoma", hsp: 5.0 },
      { name: "Oregon", hsp: 3.8 },
      { name: "Pennsylvania", hsp: 3.8 },
      { name: "Rhode Island", hsp: 3.9 },
      { name: "South Carolina", hsp: 4.6 },
      { name: "South Dakota", hsp: 4.4 },
      { name: "Tennessee", hsp: 4.3 },
      { name: "Texas", hsp: 5.0 },
      { name: "Utah", hsp: 5.5 },
      { name: "Vermont", hsp: 3.7 },
      { name: "Virginia", hsp: 4.3 },
      { name: "Washington", hsp: 3.2 },
      { name: "Washington D.C.", hsp: 4.1 },
      { name: "West Virginia", hsp: 3.9 },
      { name: "Wisconsin", hsp: 3.9 },
      { name: "Wyoming", hsp: 4.8 }
    ]
  },
  {
    name: "México",
    code: "MX",
    provinces: [
      { name: "Aguascalientes", hsp: 5.8 },
      { name: "Baja California", hsp: 5.9 },
      { name: "Baja California Sur", hsp: 6.2 },
      { name: "Campeche", hsp: 5.1 },
      { name: "Chiapas", hsp: 5.0 },
      { name: "Chihuahua", hsp: 6.1 },
      { name: "Ciudad de México", hsp: 5.0 },
      { name: "Coahuila", hsp: 5.8 },
      { name: "Colima", hsp: 5.6 },
      { name: "Durango", hsp: 6.0 },
      { name: "Guanajuato", hsp: 5.7 },
      { name: "Guerrero", hsp: 5.5 },
      { name: "Hidalgo", hsp: 5.3 },
      { name: "Jalisco", hsp: 5.4 },
      { name: "México (Estado de)", hsp: 5.1 },
      { name: "Michoacán", hsp: 5.5 },
      { name: "Morelos", hsp: 5.4 },
      { name: "Nayarit", hsp: 5.5 },
      { name: "Nuevo León", hsp: 4.8 },
      { name: "Oaxaca", hsp: 5.5 },
      { name: "Puebla", hsp: 5.1 },
      { name: "Querétaro", hsp: 5.6 },
      { name: "Quintana Roo", hsp: 5.0 },
      { name: "San Luis Potosí", hsp: 5.3 },
      { name: "Sinaloa", hsp: 5.9 },
      { name: "Sonora", hsp: 6.3 },
      { name: "Tabasco", hsp: 4.8 },
      { name: "Tamaulipas", hsp: 5.0 },
      { name: "Tlaxcala", hsp: 5.2 },
      { name: "Veracruz", hsp: 4.4 },
      { name: "Yucatán", hsp: 5.2 },
      { name: "Zacatecas", hsp: 6.0 }
    ]
  },
  {
    name: "Perú",
    code: "PE",
    provinces: [
      { name: "Amazonas", hsp: 4.2 },
      { name: "Áncash", hsp: 5.1 },
      { name: "Apurímac", hsp: 5.5 },
      { name: "Arequipa", hsp: 6.2 },
      { name: "Ayacucho", hsp: 5.4 },
      { name: "Cajamarca", hsp: 4.8 },
      { name: "Callao", hsp: 3.8 },
      { name: "Cusco", hsp: 5.3 },
      { name: "Huancavelica", hsp: 5.2 },
      { name: "Huánuco", hsp: 4.5 },
      { name: "Ica", hsp: 5.7 },
      { name: "Junín", hsp: 5.0 },
      { name: "La Libertad", hsp: 5.0 },
      { name: "Lambayeque", hsp: 5.5 },
      { name: "Lima", hsp: 3.8 },
      { name: "Loreto", hsp: 4.1 },
      { name: "Madre de Dios", hsp: 4.3 },
      { name: "Moquegua", hsp: 6.0 },
      { name: "Pasco", hsp: 4.8 },
      { name: "Piura", hsp: 5.8 },
      { name: "Puno", hsp: 5.7 },
      { name: "San Martín", hsp: 4.2 },
      { name: "Tacna", hsp: 5.9 },
      { name: "Tumbes", hsp: 5.6 },
      { name: "Ucayali", hsp: 4.3 }
    ]
  },
  {
    name: "Uruguay",
    code: "UY",
    provinces: [
      { name: "Montevideo", hsp: 4.0 },
      { name: "Maldonado", hsp: 3.9 },
      { name: "Canelones", hsp: 4.0 },
      { name: "Colonia", hsp: 4.1 },
      { name: "San José", hsp: 4.1 },
      { name: "Soriano", hsp: 4.2 },
      { name: "Río Negro", hsp: 4.2 },
      { name: "Paysandú", hsp: 4.3 },
      { name: "Salto", hsp: 4.4 },
      { name: "Artigas", hsp: 4.5 },
      { name: "Rivera", hsp: 4.3 },
      { name: "Tacuarembó", hsp: 4.3 },
      { name: "Cerro Largo", hsp: 4.2 },
      { name: "Treinta y Tres", hsp: 4.1 },
      { name: "Rocha", hsp: 4.0 },
      { name: "Lavalleja", hsp: 4.1 },
      { name: "Florida", hsp: 4.1 },
      { name: "Flores", hsp: 4.2 },
      { name: "Durazno", hsp: 4.2 }
    ]
  },
  {
    name: "Paraguay",
    code: "PY",
    provinces: [
      { name: "Alto Paraguay", hsp: 5.1 },
      { name: "Alto Paraná", hsp: 4.5 },
      { name: "Amambay", hsp: 4.7 },
      { name: "Asunción (Distrito Capital)", hsp: 4.7 },
      { name: "Boquerón", hsp: 5.2 },
      { name: "Caaguazú", hsp: 4.6 },
      { name: "Caazapá", hsp: 4.5 },
      { name: "Canindeyú", hsp: 4.6 },
      { name: "Central", hsp: 4.7 },
      { name: "Concepción", hsp: 4.9 },
      { name: "Cordillera", hsp: 4.7 },
      { name: "Guairá", hsp: 4.5 },
      { name: "Itapúa", hsp: 4.4 },
      { name: "Misiones", hsp: 4.4 },
      { name: "Ñeembucú", hsp: 4.3 },
      { name: "Paraguarí", hsp: 4.6 },
      { name: "Presidente Hayes", hsp: 5.0 },
      { name: "San Pedro", hsp: 4.8 }
    ]
  },
  {
    name: "Bolivia",
    code: "BO",
    provinces: [
      { name: "Potosí", hsp: 6.0 },
      { name: "Oruro", hsp: 5.9 },
      { name: "La Paz", hsp: 5.4 },
      { name: "Cochabamba", hsp: 5.2 },
      { name: "Chuquisaca", hsp: 5.1 },
      { name: "Tarija", hsp: 5.0 },
      { name: "Santa Cruz", hsp: 4.7 },
      { name: "Beni", hsp: 4.5 },
      { name: "Pando", hsp: 4.3 }
    ]
  },
  {
    name: "Canadá",
    code: "CA",
    provinces: [
      { name: "Ontario", hsp: 3.8 },
      { name: "Quebec", hsp: 3.6 },
      { name: "British Columbia", hsp: 3.3 },
      { name: "Alberta", hsp: 4.2 },
      { name: "Manitoba", hsp: 4.0 },
      { name: "Saskatchewan", hsp: 4.3 },
      { name: "Nova Scotia", hsp: 3.5 },
      { name: "New Brunswick", hsp: 3.6 },
      { name: "Newfoundland and Labrador", hsp: 3.1 },
      { name: "Prince Edward Island", hsp: 3.5 },
      { name: "Northwest Territories", hsp: 2.8 },
      { name: "Yukon", hsp: 2.7 },
      { name: "Nunavut", hsp: 2.5 }
    ]
  },
  {
    name: "Costa Rica",
    code: "CR",
    provinces: [
      { name: "Guanacaste", hsp: 5.5 },
      { name: "San José", hsp: 4.8 },
      { name: "Alajuela", hsp: 4.9 },
      { name: "Heredia", hsp: 4.6 },
      { name: "Cartago", hsp: 4.5 },
      { name: "Puntarenas", hsp: 5.2 },
      { name: "Limón", hsp: 4.3 }
    ]
  },
  {
    name: "Cuba",
    code: "CU",
    provinces: [
      { name: "La Habana", hsp: 5.3 },
      { name: "Santiago de Cuba", hsp: 5.6 },
      { name: "Camagüey", hsp: 5.5 },
      { name: "Holguín", hsp: 5.5 },
      { name: "Guantánamo", hsp: 5.7 },
      { name: "Villa Clara", hsp: 5.2 },
      { name: "Cienfuegos", hsp: 5.3 },
      { name: "Matanzas", hsp: 5.4 },
      { name: "Pinar del Río", hsp: 5.3 },
      { name: "Sancti Spíritus", hsp: 5.3 },
      { name: "Ciego de Ávila", hsp: 5.4 },
      { name: "Granma", hsp: 5.5 },
      { name: "Las Tunas", hsp: 5.5 },
      { name: "Artemisa", hsp: 5.3 },
      { name: "Mayabeque", hsp: 5.3 },
      { name: "Isla de la Juventud", hsp: 5.4 }
    ]
  },
  {
    name: "Ecuador",
    code: "EC",
    provinces: [
      { name: "Azuay", hsp: 4.8 },
      { name: "Bolívar", hsp: 4.5 },
      { name: "Cañar", hsp: 4.7 },
      { name: "Carchi", hsp: 4.4 },
      { name: "Chimborazo", hsp: 4.9 },
      { name: "Cotopaxi", hsp: 4.6 },
      { name: "El Oro", hsp: 4.8 },
      { name: "Esmeraldas", hsp: 4.1 },
      { name: "Galápagos", hsp: 5.6 },
      { name: "Guayas", hsp: 4.6 },
      { name: "Imbabura", hsp: 4.8 },
      { name: "Loja", hsp: 5.2 },
      { name: "Los Ríos", hsp: 4.2 },
      { name: "Manabí", hsp: 4.6 },
      { name: "Morona Santiago", hsp: 3.9 },
      { name: "Napo", hsp: 3.8 },
      { name: "Orellana", hsp: 3.9 },
      { name: "Pastaza", hsp: 3.8 },
      { name: "Pichincha", hsp: 4.7 },
      { name: "Santa Elena", hsp: 5.0 },
      { name: "Santo Domingo de los Tsáchilas", hsp: 4.2 },
      { name: "Sucumbíos", hsp: 3.9 },
      { name: "Tungurahua", hsp: 4.8 },
      { name: "Zamora Chinchipe", hsp: 4.0 }
    ]
  },
  {
    name: "El Salvador",
    code: "SV",
    provinces: [
      { name: "San Salvador", hsp: 5.3 },
      { name: "Santa Ana", hsp: 5.4 },
      { name: "San Miguel", hsp: 5.7 },
      { name: "La Libertad", hsp: 5.3 },
      { name: "Sonsonate", hsp: 5.4 },
      { name: "Usulután", hsp: 5.6 },
      { name: "Ahuachapán", hsp: 5.3 },
      { name: "La Paz", hsp: 5.4 },
      { name: "La Unión", hsp: 5.8 },
      { name: "Chalatenango", hsp: 5.2 },
      { name: "Cuscatlán", hsp: 5.3 },
      { name: "Morazán", hsp: 5.5 },
      { name: "San Vicente", hsp: 5.4 },
      { name: "Cabañas", hsp: 5.3 }
    ]
  },
  {
    name: "Guatemala",
    code: "GT",
    provinces: [
      { name: "Guatemala", hsp: 5.2 },
      { name: "Alta Verapaz", hsp: 4.5 },
      { name: "Baja Verapaz", hsp: 4.9 },
      { name: "Chimaltenango", hsp: 5.2 },
      { name: "Chiquimula", hsp: 5.5 },
      { name: "El Progreso", hsp: 5.6 },
      { name: "Escuintla", hsp: 5.3 },
      { name: "Huehuetenango", hsp: 5.1 },
      { name: "Izabal", hsp: 4.8 },
      { name: "Jalapa", hsp: 5.3 },
      { name: "Jutiapa", hsp: 5.6 },
      { name: "Petén", hsp: 5.0 },
      { name: "Quetzaltenango", hsp: 5.1 },
      { name: "Quiché", hsp: 4.8 },
      { name: "Retalhuleu", hsp: 5.2 },
      { name: "Sacatepéquez", hsp: 5.2 },
      { name: "San Marcos", hsp: 5.0 },
      { name: "Santa Rosa", hsp: 5.4 },
      { name: "Sololá", hsp: 5.1 },
      { name: "Suchitepéquez", hsp: 5.2 },
      { name: "Totonicapán", hsp: 5.0 },
      { name: "Zacapa", hsp: 5.8 }
    ]
  },
  {
    name: "Guyana",
    code: "GY",
    provinces: [
      { name: "Demerara-Mahaica (Georgetown)", hsp: 4.8 },
      { name: "Berbice", hsp: 4.9 },
      { name: "Essequibo Islands-West Demerara", hsp: 4.8 },
      { name: "Potaro-Siparuni", hsp: 4.5 },
      { name: "Upper Takutu-Upper Essequibo", hsp: 5.1 }
    ]
  },
  {
    name: "Guayana Francesa",
    code: "GF",
    provinces: [
      { name: "Cayenne", hsp: 4.6 },
      { name: "Saint-Laurent-du-Maroni", hsp: 4.5 },
      { name: "Kourou", hsp: 4.7 }
    ]
  },
  {
    name: "Haití",
    code: "HT",
    provinces: [
      { name: "Ouest (Puerto Príncipe)", hsp: 5.4 },
      { name: "Nord", hsp: 5.2 },
      { name: "Artibonite", hsp: 5.5 },
      { name: "Sud", hsp: 5.3 },
      { name: "Centre", hsp: 5.4 },
      { name: "Nord-Ouest", hsp: 5.6 },
      { name: "Nord-Est", hsp: 5.4 },
      { name: "Sud-Est", hsp: 5.3 },
      { name: "Grand'Anse", hsp: 5.2 },
      { name: "Nippes", hsp: 5.3 }
    ]
  },
  {
    name: "Honduras",
    code: "HN",
    provinces: [
      { name: "Francisco Morazán (Tegucigalpa)", hsp: 5.3 },
      { name: "Cortés (San Pedro Sula)", hsp: 5.0 },
      { name: "Choluteca", hsp: 5.8 },
      { name: "Atlántida", hsp: 4.8 },
      { name: "Comayagua", hsp: 5.4 },
      { name: "Copán", hsp: 5.1 },
      { name: "El Paraíso", hsp: 5.3 },
      { name: "Gracias a Dios", hsp: 4.9 },
      { name: "Intibucá", hsp: 5.0 },
      { name: "Islas de la Bahía", hsp: 5.2 },
      { name: "La Paz", hsp: 5.2 },
      { name: "Lempira", hsp: 5.1 },
      { name: "Ocotepeque", hsp: 5.0 },
      { name: "Olancho", hsp: 5.2 },
      { name: "Santa Bárbara", hsp: 5.0 },
      { name: "Valle", hsp: 5.8 },
      { name: "Yoro", hsp: 5.1 },
      { name: "Colón", hsp: 4.9 }
    ]
  },
  {
    name: "Jamaica",
    code: "JM",
    provinces: [
      { name: "Kingston & St. Andrew", hsp: 5.5 },
      { name: "St. Catherine", hsp: 5.4 },
      { name: "Clarendon", hsp: 5.5 },
      { name: "Manchester", hsp: 5.3 },
      { name: "St. Elizabeth", hsp: 5.6 },
      { name: "Westmoreland", hsp: 5.4 },
      { name: "St. James (Montego Bay)", hsp: 5.5 },
      { name: "St. Ann", hsp: 5.3 },
      { name: "Portland", hsp: 5.1 }
    ]
  },
  {
    name: "Nicaragua",
    code: "NI",
    provinces: [
      { name: "Managua", hsp: 5.5 },
      { name: "León", hsp: 5.8 },
      { name: "Chinandega", hsp: 5.9 },
      { name: "Matagalpa", hsp: 5.0 },
      { name: "Jinotega", hsp: 4.9 },
      { name: "Masaya", hsp: 5.4 },
      { name: "Granada", hsp: 5.5 },
      { name: "Carazo", hsp: 5.4 },
      { name: "Rivas", hsp: 5.6 },
      { name: "Estelí", hsp: 5.3 },
      { name: "Madriz", hsp: 5.4 },
      { name: "Nueva Segovia", hsp: 5.3 },
      { name: "Boaco", hsp: 5.2 },
      { name: "Chontales", hsp: 5.3 },
      { name: "Río San Juan", hsp: 4.8 },
      { name: "RACCN", hsp: 4.7 },
      { name: "RACCS", hsp: 4.7 }
    ]
  },
  {
    name: "Panamá",
    code: "PA",
    provinces: [
      { name: "Panamá", hsp: 4.8 },
      { name: "Panamá Oeste", hsp: 4.8 },
      { name: "Chiriquí", hsp: 5.0 },
      { name: "Colón", hsp: 4.5 },
      { name: "Coclé", hsp: 5.1 },
      { name: "Veraguas", hsp: 4.9 },
      { name: "Herrera", hsp: 5.2 },
      { name: "Los Santos", hsp: 5.3 },
      { name: "Bocas del Toro", hsp: 4.3 },
      { name: "Darién", hsp: 4.4 },
      { name: "Guna Yala", hsp: 4.6 },
      { name: "Emberá-Wounaan", hsp: 4.4 },
      { name: "Ngäbe-Buglé", hsp: 4.6 }
    ]
  },
  {
    name: "Puerto Rico",
    code: "PR",
    provinces: [
      { name: "San Juan", hsp: 5.4 },
      { name: "Bayamón", hsp: 5.3 },
      { name: "Ponce", hsp: 5.8 },
      { name: "Caguas", hsp: 5.2 },
      { name: "Mayagüez", hsp: 5.5 },
      { name: "Arecibo", hsp: 5.4 },
      { name: "Carolina", hsp: 5.4 },
      { name: "Guaynabo", hsp: 5.3 },
      { name: "Aguadilla", hsp: 5.6 },
      { name: "Humacao", hsp: 5.3 }
    ]
  },
  {
    name: "República Dominicana",
    code: "DO",
    provinces: [
      { name: "Santo Domingo", hsp: 5.3 },
      { name: "Distrito Nacional", hsp: 5.3 },
      { name: "Santiago", hsp: 5.4 },
      { name: "La Altagracia (Punta Cana)", hsp: 5.6 },
      { name: "Puerto Plata", hsp: 5.2 },
      { name: "San Cristóbal", hsp: 5.3 },
      { name: "La Vega", hsp: 5.1 },
      { name: "San Pedro de Macorís", hsp: 5.4 },
      { name: "Duarte", hsp: 5.1 },
      { name: "La Romana", hsp: 5.5 },
      { name: "Barahona", hsp: 5.7 },
      { name: "Azua", hsp: 5.8 },
      { name: "Espaillat", hsp: 5.2 },
      { name: "Samaná", hsp: 5.2 },
      { name: "Peravia", hsp: 5.6 },
      { name: "Monseñor Nouel", hsp: 5.0 }
    ]
  },
  {
    name: "Surinam",
    code: "SR",
    provinces: [
      { name: "Paramaribo", hsp: 4.8 },
      { name: "Wanica", hsp: 4.8 },
      { name: "Nickerie", hsp: 5.1 },
      { name: "Commewijne", hsp: 4.9 },
      { name: "Para", hsp: 4.7 }
    ]
  },
  {
    name: "Venezuela",
    code: "VE",
    provinces: [
      { name: "Distrito Capital (Caracas)", hsp: 5.0 },
      { name: "Zulia (Maracaibo)", hsp: 5.8 },
      { name: "Miranda", hsp: 4.9 },
      { name: "Carabobo (Valencia)", hsp: 5.2 },
      { name: "Lara (Barquisimeto)", hsp: 5.6 },
      { name: "Aragua", hsp: 5.1 },
      { name: "Bolívar", hsp: 5.0 },
      { name: "Anzoátegui", hsp: 5.6 },
      { name: "Táchira", hsp: 4.7 },
      { name: "Falcón", hsp: 6.0 },
      { name: "Sucre", hsp: 5.7 },
      { name: "Portuguesa", hsp: 5.3 },
      { name: "Monagas", hsp: 5.3 },
      { name: "Barinas", hsp: 5.1 },
      { name: "Mérida", hsp: 4.6 },
      { name: "Trujillo", hsp: 4.8 },
      { name: "Nueva Esparta (Margarita)", hsp: 5.9 },
      { name: "Yaracuy", hsp: 5.2 },
      { name: "Guárico", hsp: 5.5 },
      { name: "Apure", hsp: 5.3 },
      { name: "La Guaira", hsp: 5.4 },
      { name: "Delta Amacuro", hsp: 4.8 },
      { name: "Amazonas", hsp: 4.4 }
    ]
  },
  {
    name: "Belice",
    code: "BZ",
    provinces: [
      { name: "Belize District", hsp: 5.2 },
      { name: "Cayo", hsp: 5.1 },
      { name: "Corozal", hsp: 5.4 },
      { name: "Orange Walk", hsp: 5.3 },
      { name: "Stann Creek", hsp: 5.1 },
      { name: "Toledo", hsp: 4.9 }
    ]
  },
  {
    name: "Bahamas",
    code: "BS",
    provinces: [
      { name: "New Providence (Nassau)", hsp: 5.4 },
      { name: "Grand Bahama", hsp: 5.3 },
      { name: "Abaco", hsp: 5.4 },
      { name: "Eleuthera", hsp: 5.5 },
      { name: "Exuma", hsp: 5.6 }
    ]
  },
  {
    name: "Barbados",
    code: "BB",
    provinces: [
      { name: "St. Michael (Bridgetown)", hsp: 5.5 },
      { name: "Christ Church", hsp: 5.5 },
      { name: "St. James", hsp: 5.4 },
      { name: "St. Philip", hsp: 5.6 }
    ]
  },
  {
    name: "Trinidad y Tobago",
    code: "TT",
    provinces: [
      { name: "Port of Spain", hsp: 5.1 },
      { name: "Chaguanas", hsp: 5.2 },
      { name: "San Fernando", hsp: 5.2 },
      { name: "Tobago", hsp: 5.3 },
      { name: "Tunapuna-Piarco", hsp: 5.1 }
    ]
  },
  {
    name: "Antigua y Barbuda",
    code: "AG",
    provinces: [
      { name: "St. John's", hsp: 5.5 },
      { name: "Barbuda", hsp: 5.6 },
      { name: "St. Paul", hsp: 5.5 }
    ]
  },
  {
    name: "Dominica",
    code: "DM",
    provinces: [
      { name: "St. George (Roseau)", hsp: 5.1 },
      { name: "St. Andrew", hsp: 5.0 },
      { name: "St. David", hsp: 5.1 }
    ]
  },
  {
    name: "Granada",
    code: "GD",
    provinces: [
      { name: "St. George's", hsp: 5.3 },
      { name: "St. Andrew", hsp: 5.2 },
      { name: "Carriacou", hsp: 5.5 }
    ]
  },
  {
    name: "San Cristóbal y Nieves",
    code: "KN",
    provinces: [
      { name: "St. George Basseterre", hsp: 5.4 },
      { name: "Nevis", hsp: 5.5 }
    ]
  },
  {
    name: "Santa Lucía",
    code: "LC",
    provinces: [
      { name: "Castries", hsp: 5.3 },
      { name: "Gros Islet", hsp: 5.4 },
      { name: "Vieux Fort", hsp: 5.5 }
    ]
  },
  {
    name: "San Vicente y las Granadinas",
    code: "VC",
    provinces: [
      { name: "St. George (Kingstown)", hsp: 5.3 },
      { name: "Grenadines", hsp: 5.6 }
    ]
  },
  {
    name: "Aruba",
    code: "AW",
    provinces: [
      { name: "Oranjestad", hsp: 5.8 },
      { name: "San Nicolas", hsp: 5.9 },
      { name: "Noord", hsp: 5.8 }
    ]
  },
  {
    name: "Curazao",
    code: "CW",
    provinces: [
      { name: "Willemstad", hsp: 5.8 },
      { name: "Bandabou", hsp: 5.8 },
      { name: "Bandariba", hsp: 5.8 }
    ]
  },
  {
    name: "San Martín",
    code: "SX",
    provinces: [
      { name: "Philipsburg (Sint Maarten)", hsp: 5.5 },
      { name: "Marigot (Saint-Martin)", hsp: 5.5 }
    ]
  },
  {
    name: "Islas Caimán",
    code: "KY",
    provinces: [
      { name: "George Town (Grand Cayman)", hsp: 5.5 },
      { name: "Cayman Brac", hsp: 5.6 },
      { name: "Little Cayman", hsp: 5.6 }
    ]
  },
  {
    name: "Islas Vírgenes",
    code: "VI",
    provinces: [
      { name: "St. Thomas", hsp: 5.5 },
      { name: "St. Croix", hsp: 5.6 },
      { name: "St. John", hsp: 5.5 },
      { name: "Tortola (BVI)", hsp: 5.5 }
    ]
  },
  {
    name: "Guadalupe",
    code: "GP",
    provinces: [
      { name: "Basse-Terre", hsp: 5.4 },
      { name: "Pointe-à-Pitre", hsp: 5.5 },
      { name: "Le Gosier", hsp: 5.5 },
      { name: "Sainte-Anne", hsp: 5.6 },
      { name: "Le Moule", hsp: 5.5 }
    ]
  },
  {
    name: "Martinica",
    code: "MQ",
    provinces: [
      { name: "Fort-de-France", hsp: 5.4 },
      { name: "Le Lamentin", hsp: 5.4 },
      { name: "Le Robert", hsp: 5.5 },
      { name: "Schoelcher", hsp: 5.4 },
      { name: "Sainte-Luce", hsp: 5.6 }
    ]
  }
];

export const PROVINCIAS_ARGENTINA: ProvinceData[] = [
  { name: "Entre Ríos", hsp: 4.2 },
  { name: "Buenos Aires", hsp: 3.8 },
  { name: "Capital Federal", hsp: 3.7 },
  { name: "Córdoba", hsp: 4.5 },
  { name: "Santa Fe", hsp: 4.1 },
  { name: "Corrientes", hsp: 4.3 },
  { name: "Misiones", hsp: 4.0 },
  { name: "Chaco", hsp: 4.6 },
  { name: "Formosa", hsp: 4.7 },
  { name: "Santiago del Estero", hsp: 4.8 },
  { name: "Tucumán", hsp: 4.6 },
  { name: "Salta", hsp: 5.2 },
  { name: "Jujuy", hsp: 5.5 },
  { name: "Catamarca", hsp: 5.4 },
  { name: "La Rioja", hsp: 5.3 },
  { name: "San Juan", hsp: 5.6 },
  { name: "Mendoza", hsp: 5.1 },
  { name: "San Luis", hsp: 4.8 },
  { name: "La Pampa", hsp: 4.0 },
  { name: "Neuquén", hsp: 3.9 },
  { name: "Río Negro", hsp: 3.5 },
  { name: "Chubut", hsp: 3.2 },
  { name: "Santa Cruz", hsp: 2.8 },
  { name: "Tierra del Fuego", hsp: 2.2 }
];

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  { id: "preset_all", name: "✏️ EQUIPO PERSONALIZADO / CARGA MANUAL", powerW: 0, hoursPerDayDefault: 0 },
  { id: "preset_fridge", name: "Heladera con Freezer A+++ (Eficiente)", powerW: 150, hoursPerDayDefault: 12 }, // ~1800Wh/day
  { id: "preset_water_pump", name: "Bomba de Agua Monofásica 1/2 HP", powerW: 375, hoursPerDayDefault: 1 }, // 375Wh/day
  { id: "preset_led_lighting", name: "Iluminación LED Completa Casa", powerW: 80, hoursPerDayDefault: 5 }, // 400Wh/day
  { id: "preset_tv", name: "Televisor Smart LED 43\"", powerW: 75, hoursPerDayDefault: 4 }, // 300Wh/day
  { id: "preset_ac", name: "Aire Acondicionado Split 2200 Frigorías", powerW: 900, hoursPerDayDefault: 3 }, // 2700Wh/day
  { id: "preset_computer", name: "Computadora de Escritorio / Monitor", powerW: 150, hoursPerDayDefault: 4 }, // 600Wh/day
  { id: "preset_fan", name: "Ventilador de Techo/Pie", powerW: 60, hoursPerDayDefault: 6 }, // 360Wh/day
  { id: "preset_microwave", name: "Horno Microondas Eléctrico", powerW: 1200, hoursPerDayDefault: 0.5 }, // 600Wh/day
  { id: "preset_washing_machine", name: "Lavarropas Automático (Agua Fría)", powerW: 500, hoursPerDayDefault: 1 }, // 500Wh/day
];

export interface SolarSizingResult {
  // Common
  totalWhPerDay: number;
  panelsCount: number;
  panelPowerW: number;
  totalPvPowerW: number;
  inverterPowerW: number;
  inverterModel: string;
  
  // Off-Grid specific
  batterySystemVoltage: number; // 12, 24 or 48V
  batteryType: string;
  batteryCapacityAh: number;
  batteriesTotalCount: number;
  batteriesInSeries: number;
  batteriesInParallel: number;
  backupAutonomyDays: number;
  panelsInSeries?: number;
  panelsInParallel?: number;
  panelsLayout?: string;
  batteriesLayout?: string;
  panelsWiringDetail?: string;
  batteriesWiringDetail?: string;
  originalWhPerDay?: number;
  isThermostatOptimized?: boolean;
  thermostatSavingsWh?: number;
  
  // On-Grid Spicific
  estimatedAnualSavingsArs: number;
  carbonOffsetTonsCo2Year: number;
  paybackPeriodYears: number;

  // Dynamic Multi-Country Financials
  totalCostUsd?: number;
  annualSavingsUsd?: number;
  kwhTariffUsd?: number;
  estimatedAnualSavingsLocal?: number;
  estimatedCostLocal?: number;
  currencySymbol?: string;
  currencyCode?: string;

  // Thermal spec
  tankLiters: number;
  collectorTubesCount: number;
  auxiliaryHeaterPowerW: number;
  thermalEquipments?: number[];
  thermalExplanation?: string;
  waterHardness?: "blanda" | "dura";
  hasMinors?: boolean;
  hasPressurizer?: boolean;
  solarCoverage?: number;
  thermalProfile?: "familiar" | "intenso";

  // HSP & Winter Solar Window
  winterHsp?: number;
  hspUsed?: number;
}

export interface SavedProject {
  id: string;
  name: string;
  timestamp: number;
  domicilio: Domicilio;
  techType: "on-grid" | "off-grid" | "thermal";
  hsp: number;
  appliances: CustomAppliance[];
  personasCount: number;
  autonomyDays: number;
  batteryType: "gel" | "lithium";
  batteryVoltage: 12 | 24 | 48;
  solarCoverage: number;
  thermalProfile: "familiar" | "intenso";
  waterHardness: "blanda" | "dura";
  hasMinors: boolean;
  hasPressurizer: boolean;
  anualConsumptionKwh: number | "";
  gridPhaseType: "monofasica" | "trifasica";
}


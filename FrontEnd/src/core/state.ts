
export interface User {
  id: string | null;
  name: string;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  createdAt: Date | null;
}

export interface Pet {
  id: string;
  userId: string;
  status: 'ENCONTRADA' | 'EN_ADOPCION' | 'ADOPTADA' | 'DEVUELTA';
  name: string | null;
  animal_type: string;
  description: string;
  event_date: Date;
  location_text: string;
  location_geo: {
    type: string;
    coordinates: [number, number];
  };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
}

export interface AppState {
  // ========== USUARIO ==========
  user: User;
  isAuthenticated: boolean;
  token: string | null;

  // ========== MASCOTAS ==========
  pets: {
    all: Pet[];
    myPets: Pet[];
    currentPet: Pet | null;
  };

  // ========== FILTROS Y PAGINACIÓN ==========
  filters: {
    status: string | null;
    animalType: string | null;
    searchText: string;
  };

  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };

  // ========== ESTADOS DE CARGA ==========
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// ESTADO INICIAL
// ==========================================

const initialState: AppState = {
  user: {
    id: null,
    name: '',
    email: '',
    phone: null,
    profile_picture: null,
    createdAt: null,
  },
  isAuthenticated: false,
  token: null,

  pets: {
    all: [],
    myPets: [],
    currentPet: null,
  },

  filters: {
    status: null,
    animalType: null,
    searchText: '',
  },

  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },

  isLoading: false,
  error: null,
};

// ==========================================
// ESTADO GLOBAL Y SUSCRIPTORES
// ==========================================

let state: AppState = { ...initialState };
type StateListener = (newState: AppState) => void;
const listeners: Set<StateListener> = new Set();

// ==========================================
// FUNCIONES CORE
// ==========================================

/**
 * Obtiene el estado actual
 */
export function getState(): AppState {
  return { ...state };
}

/**
 * Suscribe un componente a cambios de estado
 */
export function subscribe(listener: StateListener): () => void {
  listeners.add(listener);

  // Retornar función para desuscribirse
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Actualiza el estado y notifica a todos los listeners
 */
function setState(newState: Partial<AppState>): void {
  state = { ...state, ...newState };
  persistState(); // Guardar en localStorage
  notifyListeners();
}

/**
 * Notifica a todos los listeners
 */
function notifyListeners(): void {
  listeners.forEach((listener) => listener(getState()));
}

/**
 * Guarda el estado en localStorage
 */
function persistState(): void {
  const persistData = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
  };
  localStorage.setItem('appState', JSON.stringify(persistData));
}

/**
 * Carga el estado desde localStorage
 */
function loadState(): void {
  const saved = localStorage.getItem('appState');
  if (saved) {
    try {
      const parsedData = JSON.parse(saved);
      state = { ...state, ...parsedData };
    } catch (error) {
      console.error('Error al cargar estado:', error);
    }
  }
}

// ==========================================
// ACCIONES - USUARIO
// ==========================================

/**
 * Establece los datos del usuario y marca como autenticado
 */
export function setUser(userData: User, token: string): void {
  setState({
    user: userData,
    token,
    isAuthenticated: true,
    error: null,
  });
}

/**
 * Cierra la sesión y limpia el estado del usuario
 */
export function logout(): void {
  state.pets.myPets = [];
  state.pets.currentPet = null;
  setState({
    user: { ...initialState.user },
    token: null,
    isAuthenticated: false,
    pets: { ...state.pets },
  });
  localStorage.removeItem('appState');
}

/**
 * Actualiza el perfil del usuario
 */
export function updateUserProfile(updates: Partial<User>): void {
  setState({
    user: { ...state.user, ...updates },
  });
}

// ==========================================
// ACCIONES - MASCOTAS
// ==========================================

/**
 * Establece la lista completa de mascotas (del mapa)
 */
export function setPets(pets: Pet[]): void {
  setState({
    pets: { ...state.pets, all: pets },
    pagination: {
      ...state.pagination,
      total: pets.length,
    },
  });
}

/**
 * Establece las mascotas del usuario actual
 */
export function setMyPets(pets: Pet[]): void {
  setState({
    pets: { ...state.pets, myPets: pets },
  });
}

/**
 * Selecciona una mascota para ver sus detalles
 */
export function setCurrentPet(pet: Pet | null): void {
  setState({
    pets: { ...state.pets, currentPet: pet },
  });
}

/**
 * Agrega una nueva mascota a la lista
 */
export function addPet(pet: Pet): void {
  const updatedAll = [...state.pets.all, pet];
  const updatedMyPets = state.user.id === pet.userId 
    ? [...state.pets.myPets, pet] 
    : state.pets.myPets;

  setState({
    pets: {
      ...state.pets,
      all: updatedAll,
      myPets: updatedMyPets,
    },
  });
}

/**
 * Actualiza una mascota existente
 */
export function updatePet(updatedPet: Pet): void {
  const updatedAll = state.pets.all.map((pet) =>
    pet.id === updatedPet.id ? updatedPet : pet
  );

  const updatedMyPets = state.pets.myPets.map((pet) =>
    pet.id === updatedPet.id ? updatedPet : pet
  );

  const updatedCurrent =
    state.pets.currentPet?.id === updatedPet.id ? updatedPet : state.pets.currentPet;

  setState({
    pets: {
      all: updatedAll,
      myPets: updatedMyPets,
      currentPet: updatedCurrent,
    },
  });
}

/**
 * Elimina una mascota de las listas
 */
export function deletePet(petId: string): void {
  const updatedAll = state.pets.all.filter((pet) => pet.id !== petId);
  const updatedMyPets = state.pets.myPets.filter((pet) => pet.id !== petId);

  setState({
    pets: {
      all: updatedAll,
      myPets: updatedMyPets,
      currentPet:
        state.pets.currentPet?.id === petId ? null : state.pets.currentPet,
    },
  });
}

// ==========================================
// ACCIONES - FILTROS
// ==========================================

/**
 * Actualiza los filtros de búsqueda
 */
export function setFilters(filters: Partial<AppState['filters']>): void {
  setState({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, currentPage: 1 }, // Reset a primera página
  });
}

/**
 * Limpia todos los filtros
 */
export function clearFilters(): void {
  setState({
    filters: {
      status: null,
      animalType: null,
      searchText: '',
    },
    pagination: { ...state.pagination, currentPage: 1 },
  });
}

// ==========================================
// ACCIONES - PAGINACIÓN
// ==========================================

/**
 * Cambia la página actual
 */
export function setPage(pageNumber: number): void {
  setState({
    pagination: { ...state.pagination, currentPage: pageNumber },
  });
}

/**
 * Establece el tamaño de página
 */
export function setPageSize(size: number): void {
  setState({
    pagination: { ...state.pagination, pageSize: size, currentPage: 1 },
  });
}

// ==========================================
// ACCIONES - LOADING Y ERRORES
// ==========================================

/**
 * Establece el estado de carga
 */
export function setLoading(isLoading: boolean): void {
  setState({ isLoading });
}

/**
 * Establece un error
 */
export function setError(error: string | null): void {
  setState({ error });
}

/**
 * Limpia el error
 */
export function clearError(): void {
  setState({ error: null });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

/**
 * Inicializa el estado al cargar la app
 */
export function initializeState(): void {
  loadState();
}

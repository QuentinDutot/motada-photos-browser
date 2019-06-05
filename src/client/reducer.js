const Actions = {
  MAKE_SEARCH: 'MAKE_SEARCH',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  REACH_BOTTOM: 'REACH_BOTTOM',
  IS_LOADING: 'IS_LOADING',
  CLEAN_IMAGES: 'CLEAN_IMAGES',
  ADD_IMAGE: 'ADD_IMAGE',
  UPDATE_DISPLAY: 'UPDATE_DISPLAY',
};

export const makeSearch = search => ({
  type: Actions.MAKE_SEARCH,
  payload: { search },
});

export const updateNotification = notification => ({
  type: Actions.UPDATE_NOTIFICATION,
  payload: { notification },
});

export const reachBottom = reached => ({
  type: Actions.REACH_BOTTOM,
  payload: { reached },
});

export const isLoading = loading => ({
  type: Actions.IS_LOADING,
  payload: { loading },
});

export const cleanImages = () => ({
  type: Actions.CLEAN_IMAGES,
  payload: { images: [] },
});

export const addImage = image => ({
  type: Actions.ADD_IMAGE,
  payload: { image },
});

export const updateDisplay = image => ({
  type: Actions.UPDATE_DISPLAY,
  payload: { image },
});

const defaultState = {
  search: '',
  notification: '',
  bottomReached: false,
  loading: false,
  images: [],
  display: {},
};

export default function reducer(prevState, action) {
  const state = prevState || defaultState;

  switch (action.type) {
    case Actions.MAKE_SEARCH:
      return { ...state, search: action.payload.search };
    case Actions.UPDATE_NOTIFICATION:
      return { ...state, notification: action.payload.notification };
    case Actions.REACH_BOTTOM:
      return { ...state, bottomReached: action.payload.reached };
    case Actions.IS_LOADING:
      return { ...state, loading: action.payload.loading };
    case Actions.CLEAN_IMAGES:
      return { ...state, images: action.payload.images };
    case Actions.ADD_IMAGE:
      return { ...state, images: [...state.images, action.payload.image] };
    case Actions.UPDATE_DISPLAY:
      return { ...state, display: action.payload.image };
    default:
      return state;
  }
}

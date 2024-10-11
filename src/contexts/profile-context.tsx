import { FC, createContext, useContext, useEffect, useState, ReactNode, useMemo, SetStateAction, useCallback } from 'react';
import Prefs from '../models/prefs';
import Show from '../models/show';

const getSavedShows = () => {
  const loaded = localStorage.getItem('sor-casting-tool_shows');
  if (loaded)
    return JSON.parse(loaded) as Show[];
  return undefined;
}
interface ProfileContextProps {
  shows: Show[];
  saveShows: (currentShow: Show) => void;
  prefs: Prefs | null;
  setPrefs: React.Dispatch<SetStateAction<Prefs | null>>;
  unsavedData: boolean;
  setUnsavedData: (unsaved: boolean) => void;
}

const ProfileContext = createContext<ProfileContextProps | null>(null);

export const useProfile = () => {
  const profileContext = useContext(ProfileContext);

  if (!profileContext)
    throw new Error(
      'profile has to be used within <ProfileProvider>',
    );

  return profileContext;
};

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [shows, setShows] = useState<Show[]>(getSavedShows() || []);

  const [unsavedData, setUnsavedData] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  const saveShows = useCallback((currentShow: Show) => {
    setShows(oldState => {
     const oldShowIndex = oldState.findIndex(x => x.id === currentShow.id);

     if (oldShowIndex >= 0)
      return oldState.toSpliced(oldShowIndex, 1, currentShow)
    return [...oldState, currentShow];
    });

  }, []);

  useEffect(() => {
    const storagePrefs = localStorage.getItem('prefs');
    if (!storagePrefs)
      return setPrefs({ hideGuitar3: false, hideKeys3: false, hideExtras: false });
    const loadedPrefs = JSON.parse(storagePrefs);
    return setPrefs(loadedPrefs);
  }, []);

  useEffect(() => {
    if (!prefs)
      return;
    localStorage.setItem('prefs', JSON.stringify(prefs))
  }, [prefs]);

  useEffect(() => {
    localStorage.setItem('sor-casting-tool_shows', JSON.stringify(shows))
  }, [shows]);

  const context = useMemo(() => ({
    shows,
    saveShows,
    prefs,
    setPrefs,
    unsavedData,
    setUnsavedData,
  }), [
    shows,
    saveShows,
    prefs,
    setPrefs,
    unsavedData,
    setUnsavedData,
  ]);

  return (
    <ProfileContext.Provider value={ context }>
      { children }
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;

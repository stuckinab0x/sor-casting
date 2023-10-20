import { FC, createContext, useContext, useCallback, useEffect, useState, ReactNode, useMemo, SetStateAction } from 'react';
import Prefs from '../models/prefs';
import Show from '../models/show';
import useGetProfile from '../hooks/use-get-profile';

interface ProfileContextProps {
  profile: string | undefined;
  prefs: Prefs | null;
  setPrefs: React.Dispatch<SetStateAction<Prefs | null>>;
  setProfileRequest: (profileName: string) => void;
  saveShowRequest: (currentEditingShow: Show) => Promise<void>;
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
  const profile = useGetProfile();

  const [unsavedData, setUnsavedData] = useState(false);
  
  const saveShowRequest = useCallback(async (currentEditingShow: Show) => {
    const res = await fetch('/api/shows', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentEditingShow),
    });

    if (res.status === 200)
      setUnsavedData(false);
  }, []);

  const [prefs, setPrefs] = useState<Prefs | null>(null);

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

  const setProfileRequest = useCallback(async (profileName: string) => {
    await fetch(`/api/profiles/${ profileName }`, { method: 'PUT' });
    location.reload();
  }, []);

  const context = useMemo(() => ({
    profile,
    prefs,
    setPrefs,
    setProfileRequest,
    saveShowRequest,
    unsavedData,
    setUnsavedData,
  }), [
    profile,
    prefs,
    setPrefs,
    setProfileRequest,
    saveShowRequest,
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

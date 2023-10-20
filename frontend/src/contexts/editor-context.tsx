import { FC, useState, createContext, useCallback, useContext, ReactNode, useMemo, SetStateAction } from 'react';
import Show from '../models/show';
import Student, { Casting, CastingInst, FivePMStartLesson, MainInstrument, TwoPMStartLesson } from '../models/student';
import Song from '../models/song';
import { useProfile } from './profile-context';

type NewShowStatus = 'songsWereAdded' | 'castWasAdded' | undefined;
interface StudentInfoOptions {
  name: string;
  lesson?: FivePMStartLesson | TwoPMStartLesson;
  main: MainInstrument;
}

interface EditorContextProps {
  singleArtist: boolean;
  setSingleArtist: React.Dispatch<SetStateAction<boolean>>;
  currentEditingShow: Show | null;
  setCurrentEditingShow: React.Dispatch<SetStateAction<Show | null>>;
  newShowStatus: NewShowStatus;
  setNewShowStatus: React.Dispatch<SetStateAction<NewShowStatus>>;
  currentCastEdit: Casting | null;
  highlightedStudent: string | null;
  setHighlightedStudent: (studentName: string | null) => void;
  setCastEdit: (songName: string, inst: CastingInst) => void;
  discardCastEdit: () => void;
  assignCasting: (studentName: string) => void;
  clearAndCloseCasting: () => void;
  addStudent: (newStudent: Student) => void;
  updateStudentInfo: (studentName: string, studentInfo: StudentInfoOptions) => void;
  deleteStudent: (studentName: string) => void;
  addSong: (songName: string, artist?: string) => void;
  renameSong: (oldName: string, newName: string, newArtist?: string) => void;
  reorderSong: (moved: string, target: number) => void;
  deleteSong: (songName: string) => void;
  initializeShow: (showName: string, singleArtist: boolean, startsAtTwo: boolean) => void;
  saveSetListSplitIndex: (setSplitIndex: number) => void;
}

const EditorContext = createContext<EditorContextProps | null>(null);

export const useEditor = () => {
  const editorContext = useContext(EditorContext);

  if (!editorContext)
    throw new Error(
      'editor has to be used within <EditorProvider>',
    );

  return editorContext;
};

interface EditorProviderProps {
  children: ReactNode;
}

const EditorProvider: FC<EditorProviderProps> = ({ children }) => {
  const { setUnsavedData } = useProfile();
  
  const [singleArtist, setSingleArtist] = useState(false);
  const [currentEditingShow, setCurrentEditingShow] = useState<Show | null>(null);
  const [newShowStatus, setNewShowStatus] = useState<NewShowStatus>();
  const [currentCastEdit, setCurrentCastEdit] = useState<Casting | null>(null);
  const [highlightedStudent, setHighlightedStudent] = useState<string | null>(null);
  
  const initializeShow = useCallback((showName: string, singleArtist: boolean, startsAtTwo: boolean) => {
    const newShow: Show = {
      name: showName.trim(),
      singleArtist,
      twoPmRehearsal: startsAtTwo,
      setSplitIndex: 0,
      songs: [],
      cast:[],
    }
    setCurrentEditingShow(newShow);
    setUnsavedData(true);
  }, [setUnsavedData]);

  const setCastEdit = useCallback((songName: string, inst: CastingInst) => {
    setCurrentCastEdit({ songName, inst });
  }, [setCurrentCastEdit]);

  const discardCastEdit = useCallback(() => setCurrentCastEdit(null), []);

  const unAssignCasting = useCallback(() => {
    if (!currentCastEdit)
      return;
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const oldStudent = oldState.cast.find(x => x.castings.some(casting => casting.inst === currentCastEdit.inst && casting.songName === currentCastEdit.songName));
      if (!oldStudent)
        return oldState;
      const removedCasting = oldStudent.castings.find(x => x.inst === currentCastEdit.inst && x.songName === currentCastEdit.songName);
      const newStudent: Student = { ...oldStudent, castings: oldStudent.castings.filter(x => x !== removedCasting) };
      return { ...oldState, cast: [...oldState.cast.filter(x => x.name !== oldStudent.name), newStudent] };
    });
    setUnsavedData(true);
  }, [currentCastEdit, setUnsavedData]);

  const clearAndCloseCasting = useCallback(() => {
    unAssignCasting();
    setCurrentCastEdit(null);
    setUnsavedData(true);
  }, [unAssignCasting, setUnsavedData]);

  const assignCasting = useCallback((studentName: string) => {
    unAssignCasting()
    if (!currentCastEdit)
      return;
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const oldStudent = oldState.cast.find(x => x.name === studentName);
      if (!oldStudent)
        return oldState;
      const newStudent: Student = { ...oldStudent, castings: [...oldStudent.castings, { songName: currentCastEdit?.songName, inst: currentCastEdit?.inst }] };
      return { ...oldState, cast: [...oldState.cast.filter(x => x.name !== studentName), newStudent] };
    }) 
    setCurrentCastEdit(null);
    setUnsavedData(true);
  }, [currentCastEdit, unAssignCasting, setUnsavedData]);

  const addStudent = useCallback((newStudent: Student) => {
    if (currentEditingShow?.cast.some(x => x.name === newStudent.name))
      return;
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      return { ...oldState, cast: [...oldState.cast, newStudent]};
    })
    setUnsavedData(true);
  }, [currentEditingShow, setUnsavedData]);

  const updateStudentInfo = useCallback((studentName: string, studentInfo: StudentInfoOptions) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const oldStudent = oldState.cast.find(x => x.name === studentName);
      if (!oldStudent)
        return oldState;
      const newStudent: Student = { ...oldStudent, name: studentInfo.name, lesson: studentInfo.lesson, main: studentInfo.main };
      return { ...oldState, cast: [...oldState.cast.filter(x => x.name !== studentName), newStudent] };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const deleteStudent = useCallback((studentName: string) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      return { ...oldState, cast: [...oldState.cast.filter(x => x.name !== studentName)] };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const addSong = useCallback((songName: string, artist?: string) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const song: Song = { name: songName, artist, order: oldState.songs.length };
      return { ...oldState, songs: [...oldState.songs, song] };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const renameSong = useCallback((oldName: string, newName: string, newArtist?: string) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const affectedStudents = oldState.cast.filter(x => x.castings.some(casting => casting.songName === oldName))
        .map(x => {
          const affectedCastings = x.castings.filter(casting => casting.songName === oldName)
            .map(casting => ({ songName: newName, inst: casting.inst }));
          return { ...x, castings: [...x.castings.filter(casting => casting.songName !== oldName), ...affectedCastings] };
        });
      const oldSong = oldState.songs.find(x => x.name === oldName);
      if (!oldSong)
        return oldState;
      return { 
        ...oldState,
        songs: [...oldState.songs.filter(x => x.name !== oldName), { name: newName, artist: newArtist, order: oldSong.order }],
        cast: [...oldState.cast.filter(x => !x.castings.some(casting => casting.songName === oldName)), ...affectedStudents],
      };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const reorderSong = useCallback((moved: string, target: number) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      
      const allSongsInOrder = [...oldState.songs].sort((a, b) => a.order - b.order);
      const movedIndex = allSongsInOrder.findIndex(x => x.name === moved);
      if (movedIndex === -1)
        return oldState;
      const newSong: Song = { ...allSongsInOrder[movedIndex] };
      const songsWithPlaceholder = [...allSongsInOrder.slice(0, movedIndex), { ...allSongsInOrder[movedIndex], name: '$placeholder' },...allSongsInOrder.slice(movedIndex + 1)];
      songsWithPlaceholder.splice(target, 0, newSong);
      const orderedSongs = songsWithPlaceholder.filter(x => x.name !== '$placeholder').map((x, i) => ({ ...x, order: i }));
      return { ...oldState, songs: orderedSongs };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const deleteSong = useCallback((songName: string) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      const affectedStudents = oldState.cast.filter(x => x.castings.some(casting => casting.songName === songName))
        .map(x => ({ ...x, castings: x.castings.filter(casting => casting.songName !== songName) }));
      return {
        ...oldState,
        cast: [...oldState.cast.filter(x => !x.castings.some(casting => casting.songName === songName)), ...affectedStudents],
        songs: oldState.songs.filter(x => x.name !== songName),
      };
    });
    setUnsavedData(true);
  }, [setUnsavedData]);

  const saveSetListSplitIndex = useCallback((setSplitIndex: number) => {
    setCurrentEditingShow(oldState => {
      if (!oldState)
        return null;
      return { ...oldState, setSplitIndex };
    })
    setUnsavedData(true);
  }, [setUnsavedData]);

  const context = useMemo(() => ({
    singleArtist,
    setSingleArtist,
    currentEditingShow,
    setCurrentEditingShow,
    newShowStatus,
    setNewShowStatus,
    currentCastEdit,
    highlightedStudent,
    setHighlightedStudent,
    setCastEdit,
    discardCastEdit,
    assignCasting,
    clearAndCloseCasting,
    addStudent,
    updateStudentInfo,
    deleteStudent,
    addSong,
    renameSong,
    reorderSong,
    deleteSong,
    initializeShow,
    saveSetListSplitIndex,
  }),
    [
      singleArtist,
      setSingleArtist,
      currentEditingShow,
      setCurrentEditingShow,
      newShowStatus,
      setNewShowStatus,
      currentCastEdit,
      highlightedStudent,
      setHighlightedStudent,
      setCastEdit,
      discardCastEdit,
      assignCasting,
      clearAndCloseCasting,
      addStudent,
      updateStudentInfo,
      deleteStudent,
      addSong,
      renameSong,
      reorderSong,
      deleteSong,
      initializeShow,
      saveSetListSplitIndex,
    ]);

  return (
    <EditorContext.Provider value={ context }>
      { children }
    </EditorContext.Provider>
  );
};

export default EditorProvider;

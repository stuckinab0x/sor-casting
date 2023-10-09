import { FC, useState, createContext, useCallback, useContext, ReactNode, useMemo, SetStateAction } from 'react';
import EditorView from '../models/editor-view';
import Show from '../models/show';
import Student, { Casting, CastingInst, FivePMStartLesson, MainInstrument, TwoPMStartLesson } from '../models/student';
import Song from '../models/song';

type NewShowStatus = 'songsWereAdded' | 'castWasAdded' | undefined;
interface StudentInfoOptions {
  name: string;
  lesson?: FivePMStartLesson | TwoPMStartLesson;
  main: MainInstrument;
}

interface EditorContextProps {
  editorView: EditorView;
  setEditorView: React.Dispatch<SetStateAction<EditorView>>;
  singleArtist: boolean;
  setSingleArtist: React.Dispatch<SetStateAction<boolean>>;
  currentEditingShow: Show | null;
  setCurrentEditingShow: React.Dispatch<SetStateAction<Show | null>>;
  newShowStatus: NewShowStatus;
  setNewShowStatus: React.Dispatch<SetStateAction<NewShowStatus>>;
  currentCastEdit: Casting | null;
  setCastEdit: (songName: string, inst: CastingInst) => void;
  discardCastEdit: () => void;
  assignCasting: (studentName: string) => void;
  clearAndCloseCasting: () => void;
  updateStudentInfo: (studentName: string, studentInfo: StudentInfoOptions) => void;
  addSong: (songName: string, artist?: string) => void;
  renameSong: (oldName: string, newName: string, newArtist?: string) => void;
  deleteSong: (songName: string) => void;
  toolsMode: boolean;
  setToolsMode: (on: boolean) => void;
  initializeShow: (showName: string, singleArtist: boolean, startsAtTwo: boolean) => void;
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
  const [singleArtist, setSingleArtist] = useState(false);
  const [editorView, setEditorView] = useState<EditorView>('welcome');
  const [currentEditingShow, setCurrentEditingShow] = useState<Show | null>(null);
  const [newShowStatus, setNewShowStatus] = useState<NewShowStatus>();
  const [currentCastEdit, setCurrentCastEdit] = useState<Casting | null>(null);
  const [toolsMode, setToolsMode] = useState(false);

  const initializeShow = useCallback((showName: string, singleArtist: boolean, startsAtTwo: boolean) => {
    const newShow: Show = {
      name: showName,
      singleArtist,
      twoPmRehearsal: startsAtTwo,
      songs: [],
      cast:[],
    }
    setCurrentEditingShow(newShow);
  }, []);

  const setCastEdit = useCallback((songName: string, inst: CastingInst) => {
    setCurrentCastEdit({ songName, inst });
  }, []);

  const discardCastEdit = useCallback(() => setCurrentCastEdit(null), []);

  const unAssignCasting = useCallback(() => {
    if (!currentEditingShow || !currentCastEdit)
      return;
    const newShow = { ...currentEditingShow };
    const student = newShow.cast.find(x => !!x.castings.find(casting => casting.inst === currentCastEdit.inst && casting.songName === currentCastEdit.songName));
    if (student) {
      const removedCasting = student.castings.find(x => x.inst === currentCastEdit.inst && x.songName === currentCastEdit.songName);
      student.castings = student.castings.filter(x => x !== removedCasting);
      setCurrentEditingShow(newShow);
    }
  }, [currentEditingShow, currentCastEdit]);

  const clearAndCloseCasting = useCallback(() => {
    unAssignCasting();
    setCurrentCastEdit(null);
  }, [unAssignCasting]);

  const assignCasting = useCallback((studentName: string) => {
      unAssignCasting();
    if (!currentEditingShow || !currentCastEdit)
      return;
    const newShow = { ...currentEditingShow };
    const student = newShow.cast.find(x => x.name === studentName);
    if (!student)
      return;
    student.castings = [...student.castings, { songName: currentCastEdit?.songName, inst: currentCastEdit?.inst }];
    setCurrentEditingShow(newShow);
    setCurrentCastEdit(null);
  }, [currentEditingShow, currentCastEdit, unAssignCasting]);

  const updateStudentInfo = useCallback((studentName: string, studentInfo: StudentInfoOptions) => {
    if (!currentEditingShow)
      return;
    const newShow = { ...currentEditingShow };
    const student = newShow.cast.find(x => x.name === studentName);
    if (!student)
      return;
    student.name = studentInfo.name;
    student.lesson = studentInfo.lesson;
    student.main = studentInfo.main;   
    setCurrentEditingShow(newShow);
  }, [currentEditingShow])

  const addSong = useCallback((songName: string, artist?: string) => {
    if (!currentEditingShow)
      return;
    const newShow = { ...currentEditingShow };
    const song: Song = { name: songName };
    if (artist)
      song.artist = artist;
    newShow.songs = [...newShow.songs, song];
    setCurrentEditingShow(newShow);
  }, [currentEditingShow]);

  const renameSong = useCallback((oldName: string, newName: string, newArtist?: string) => {
    if (!currentEditingShow)
      return;
    const newShow = { ...currentEditingShow };
    const song = newShow.songs.find(x => x.name === oldName);
    if (!song)
      return;
    song.name = newName;
    if (!currentEditingShow.singleArtist)
      song.artist = newArtist;
    const affectedCastings = newShow.cast.reduce((prev: Casting[], curr: Student) => {
      return [...prev, ...curr.castings.filter(x => x.songName === oldName)];
    }, []);
    affectedCastings.forEach(x => { x.songName = newName });
    setCurrentEditingShow(newShow);
  }, [currentEditingShow]);

  const deleteSong = useCallback((songName: string) => {
    if (!currentEditingShow)
      return;
    const newShow = { ...currentEditingShow };
    const song = newShow.songs.find(x => x.name === songName);
    if (!song)
      return;
    newShow.songs = newShow.songs.filter(x => x.name !== songName);
    newShow.cast.forEach(x => x.castings = x.castings.filter(casting => casting.songName !== songName));
    setCurrentEditingShow(newShow);
  }, [currentEditingShow]);

  const context = useMemo(() => ({
    editorView,
    setEditorView,
    singleArtist,
    setSingleArtist,
    currentEditingShow,
    setCurrentEditingShow,
    newShowStatus,
    setNewShowStatus,
    currentCastEdit,
    setCastEdit,
    discardCastEdit,
    assignCasting,
    clearAndCloseCasting,
    updateStudentInfo,
    addSong,
    renameSong,
    deleteSong,
    toolsMode,
    setToolsMode,
    initializeShow,
  }),
    [
      editorView,
      setEditorView,
      singleArtist,
      setSingleArtist,
      currentEditingShow,
      setCurrentEditingShow,
      newShowStatus,
      setNewShowStatus,
      currentCastEdit,
      setCastEdit,
      discardCastEdit,
      assignCasting,
      clearAndCloseCasting,
      updateStudentInfo,
      addSong,
      renameSong,
      deleteSong,
      toolsMode,
      setToolsMode,
      initializeShow,
    ]);

  return (
    <EditorContext.Provider value={ context }>
      { children }
    </EditorContext.Provider>
  );
};

export default EditorProvider;

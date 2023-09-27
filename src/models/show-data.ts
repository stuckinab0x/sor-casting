export default interface ShowData {
  name: string;
  songs: Song[];
  cast: CastMember[];
  rehearsals: Rehearsal[];
}

interface Song {
  name: string;
  artist: string;
}

interface Casting {
  songName: string;
  inst: string;
}

interface CastMember {
  name: string;
  main: string;
  castings: Casting[]
  lesson: string;
}

interface Rehearsal {
  date: string;
  absent: Absence[];
  wereRun: string[];
  todoList: string[];
}

interface Absence {
  studentName: string;
  status: string;
}

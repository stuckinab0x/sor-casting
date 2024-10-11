import Student from './student';
import Song from './song';

export default interface Show {
  id: string;
  name: string;
  singleArtist: boolean;
  twoPmRehearsal: boolean;
  setSplitIndex: number;
  songs: Song[];
  cast: Student[];
}
import Student from './student';
import Song from './song';

export default interface Show {
  name: string;
  singleArtist: boolean;
  twoPmRehearsal: boolean;
  setSplitIndex: number;
  songs: Song[];
  cast: Student[];
}
import { v4 as uuidv4 } from 'uuid';

const tileColors = [
  '#3f6d55',
  '#f8b995',
  '#a1e39d',
  '#e07777',
  '#a4d4dc',
  '#be82be',
  '#d2d27a',
  '#e9a7b8',
  '#864646',
  '#b8d3f0',
  '#93a7ee',
  '#7587c7',
  '#eb9aef',
  '#8bc1c3',
  '#8fb9a1',
  '#e79d94',
  '#FFCAA6',
  '#DE9340',
  '#B5FFBF',
  '#FF9B80',
  '#9CC9EA',
  '#F2B7D4',
  '#BDFAFF',
  '#FF97B7',
  '#FFB460',
  '#95BDE8',
  '#FFA89E',
  '#99F1CB',
  '#FFECC0',
  '#A7A1F9',
  '#FFB88E',
  '#84DBC9',
  '#FF9C95',
  '#A1E7B8',
  '#FF9FD4',
  '#9EC9F3',
  '#E8D6E8',
  '#FF97B7',
  '#BCD7F0',
  '#FF8B65',
  '#9BD4CF',
  '#FFD47E',
  '#B1EFE5',
  '#F1A6BA',
  '#B5E3B5',
  '#FF87A3',
  '#9CC9EA',
  '#D9DCFF',
  '#FF85A3',
  '#CAEAB5',
  '#FFAB9F',
  '#A3C6F0',
  '#FFA0B0',
  '#C5DFF0',
  '#F9E1D0',
  '#C1FAA6',
  '#FF9C95',
  '#A5DFF3',
  '#FFBD80',
  '#E2F7F7',
  '#FF9780',
  '#A6E1D4',
];

export const up = async db => {
  const data = await db.collection('manager-data').find({}).toArray();

  const newData = data.reduce((prev, curr) => [
    ...prev,
    (
      {
        ...curr,
        shows: curr.shows.map(show => ({
          ...show,
          songs: show.songs.map((song, index) => ({
            name: song.name,
            artist: song.artist,
            color: song.color || tileColors[index],
            id: song.id || uuidv4(),
          })),
          id: show.id || uuidv4(),
        })),
      })], []);

  const operations = newData.map((x, i) => ({ replaceOne: { filter: { _id: newData[i]._id }, replacement: newData[i] } }));

  await db.collection('manager-data').bulkWrite(operations);

  await db.collection('manager-data').updateMany({}, [
    {
      $set: {
        shows: {
          $map: {
            input: '$shows',
            as: 'show',
            in: {
              id: '$$show.id',
              name: '$$show.name',
              singleArtist: '$$show.singleArtist',
              twoPmRehearsal: '$$show.twoPmRehearsal',
              setSplitIndex: '$$show.setSplitIndex',
              songs: '$$show.songs',
              rehearsals: {
                $map: {
                  input: '$$show.rehearsals',
                  as: 'rehearsal',
                  in: {
                    date: '$$rehearsal.date',
                    absent: '$$rehearsal.absent',
                    wereRun: {
                      $map: {
                        input: '$$rehearsal.wereRun',
                        as: 'runSong',
                        in: {
                          $reduce: {
                            input: '$$show.songs',
                            initialValue: null,
                            in: { $cond: [{ $eq: ['$$runSong', '$$this.name'] }, '$$this.id', '$$value'] },
                          },
                        },
                      },
                    },
                    todoList: {
                      $map: {
                        input: '$$rehearsal.todoList',
                        as: 'todoSong',
                        in: {
                          $reduce: {
                            input: '$$show.songs',
                            initialValue: null,
                            in: { $cond: [{ $eq: ['$$todoSong', '$$this.name'] }, '$$this.id', '$$value'] },
                          },
                        },
                      },
                    },
                  },
                },
              },
              cast: {
                $map: {
                  input: '$$show.cast',
                  as: 'castMember',
                  in: {
                    name: '$$castMember.name',
                    main: '$$castMember.main',
                    castings: {
                      $map: {
                        input: '$$castMember.castings',
                        as: 'casting',
                        in: {
                          songId: {
                            $reduce: {
                              input: '$$show.songs',
                              initialValue: null,
                              in: {
                                $cond: [
                                  {
                                    $eq: [
                                      '$$casting.songName',
                                      '$$this.name',
                                    ],
                                  },
                                  '$$this.id',
                                  '$$value',
                                ],
                              },
                            },
                          },
                          inst: '$$casting.inst',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);
};

export const down = async db => {
  await db.collection('manager-data').updateMany({}, { $unset: { 'shows.$[].id': '', 'shows.$[].songs.$[].id': '', 'shows.$[].songs.$[].color': '' } });
};

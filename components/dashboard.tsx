import { AcademicCapIcon, BookmarkIcon, ChartBarIcon, CpuChipIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon, PuzzlePieceIcon, SquaresPlusIcon } from '@heroicons/react/24/solid';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import MyCustomTip from './mycustomtip';
import { RootContext } from '@/context';

export function Dashboard() {

  const [user, setUser] = useContext(RootContext).user;
  const [load, setLoad] = useContext(RootContext).load;

  const router = useRouter();

  const createGame = async () => {
    const game = {
      members: [{ side: "w", user: user?.email }],
      moves: [],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      gameStatus: "waiting", //make an enum here
      bTime: {
        time: "60:00",
        stopped: true,
      },
      wTime: {
        time: "60:00",
        stopped: true,
      },
      started: new Date(),
    }

    setLoad(true);
    const createdPost = await axios.post('/api/create-game', game);
    const gameData = createdPost?.data;
    if (gameData) {
      setLoad(false);
      router.push(`/game/${gameData?._id}`)
    } else {
      throw new Error("something wenrt wortjng ")
      setLoad(false);
    }
  }
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex flex-col space-y-6 items-start w-fit'>

        <div className='flex justify-center items-center space-x-6 w-full'>
          {/* <Tippy content={
            <MyCustomTip text={"work in progress"} />
          }>
            <div className='w-full flex items-center justify-center rounded-xl p-6 py-4 font-bold text-amber-600 bg-amber-300'>
              <div className="flex items-center space-x-6">

                <BookmarkIcon className="w-8 h-8 text-amber-600 stroke-[2]" />

                <p className="text-[28px]">Rules</p>
              </div>

            </div>
          </Tippy>

          <Tippy content={
            <MyCustomTip text={"work in progress"} />
          }>

            <div className='w-full flex items-center justify-center rounded-xl p-6 py-4 font-bold text-blue-400 bg-blue-400/10'>
              <div className="flex items-center space-x-6">

                <AcademicCapIcon className="w-8 h-8 text-blue-600 stroke-[2]" />

                <p className="text-[28px]">Strats</p>
              </div>

            </div>

          </Tippy> */}
        </div>

        <div className='flex justify-center items-center space-x-6 w-full'>
          <div onClick={() => {
            createGame()
          }} className='w-full hover:brightness-[1.1] transition cursor-pointer hover:border-x-transparent hover:scale-[1.03] duration-400 ease-[cubic-bezier(.3,.48,.47,1.48)] flex items-center justify-center rounded-xl p-6 font-bold text-blue-600 bg-blue-300'>
            <div className="flex items-center space-x-6">

              <SquaresPlusIcon className="w-10 h-10 text-blue-600 stroke-[2]" />

              <p className="text-[28px]">Create Game</p>
            </div>
          </div>

        </div>
        <div className='flex justify-center items-center space-x-6'>
          <Tippy content={
            <MyCustomTip text={"work in progress"} />
          }>
            <div className='bg-blue-400/10 rounded-xl p-6 py-4 font-semibold text-blue-400'>
              <div className="flex items-center space-x-6">

                <PuzzlePieceIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

                <p className="text-[22px] text-slate-200">Puzzles</p>
              </div>
            </div>
          </Tippy>
          <Tippy content={
            <MyCustomTip text={"work in progress"} />
          }>
            <div className='bg-blue-400/10 rounded-xl p-6 py-4 font-semibold text-blue-400'>
              <div className="flex items-center space-x-6">

                <GlobeEuropeAfricaIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

                <p className="text-[22px] text-slate-200">Leaderboard</p>
              </div>
            </div>
          </Tippy>
          <Tippy content={
            <MyCustomTip text={"work in progress"} />
          }>
            <div className='bg-blue-400/10 rounded-xl p-6 py-4 font-semibold text-blue-400'>
              <div className="flex items-center space-x-6">

                <CpuChipIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

                <p className="text-[22px] text-slate-200">Bots</p>
              </div>
            </div>
          </Tippy>
        </div>
      </div>
    </div>
  );
}

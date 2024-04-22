"use client";
import { pusherClient } from "@/pusherConfig";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import path from "path";
import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { nanoid } from "nanoid";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { RootContext } from "@/app/layout";
import { ArrowDownIcon, ArrowsPointingOutIcon, ArrowsUpDownIcon, FlagIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BoltIcon, BoltSlashIcon, FlagIcon as FlagIconSolid, SpeakerWaveIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import Tippy from "@tippyjs/react";
import MyCustomTip from "@/components/mycustomtip";
import useSWR from "swr";
import WaitForRival from "@/components/waitForRival";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

enum playerEnum {
  Loader,
  Error,
  PlayerW,
  PlayerB,
  Spectator
}

export default function Game() {
  const pathname = useParams().id as string;
  const [game, setGame] = useState<any>({ main: new Chess() });
  const [moveList, setMoveList] = useState<any[]>([]);
  const [playerState, setPlayerState] = useState<playerEnum>(playerEnum.Loader);
  const [user, setUser] = useContext<any>(RootContext).user;
  const [opponent, setOpponent] = useState<any>();
  const [msg, setMsg] = useState<any>("");
  const [msgList, setMsgList] = useState<any>([])



  const fetcher = (url: any) => axios.post('/api/get-game', { _id: pathname }).then((data: any) => data)

  const { data, error, isLoading } = useSWR(`/api/get-game`, fetcher, {
    refreshInterval: 1000,
    dedupingInterval: 1000,
  });




  // const { data, error, isLoading } = useSWR('/api/user', fetcher)

  const addSessionID = (data: any, sessionID: number) => {
    return { data, sessionID }
  }



  useEffect(() => {
    setMoveList(data?.data?.moves);
  }, [data?.data?.moves]),

    useEffect(() => {
      if (data?.data?.members && data?.data?.members.length === 2 && user?.email && !opponent) {
        const opponentUser: any = data?.data?.members.find((member: any) => member.user !== user?.email).user;
        if (opponentUser) {
          axios.post('/api/get-user', { email: opponentUser }).then((data: any) => {
            if (data?.data) {
              console.log("OPPONENT", data?.data)
              setOpponent(data?.data)
            } else {

            }
          })
        }
      }
    }, [data?.data?.members])


  useEffect(() => {
    setGame({ main: new Chess(data?.data?.fen) });
  }, [data?.data?.fen]),


    useEffect(() => {

      if (!user) return;
      axios.post('/api/get-game', { _id: pathname }).then((data: any) => {
        if (data?.data) {
          // if(!user) return;/
          const gData = data?.data;
          const members = gData.members;
          console.log(members.length)
          // console.log(members)

          let over = false;

          members.forEach((member: any) => {
            console.log(member.user, user?.email)
            if (member.user === user?.email) {
              // console.log(member?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB)
              setPlayerState(member?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB);
              over = true;
              return;
            }
          })

          if (over) return;

          if (members.length >= 2) {
            setPlayerState(playerEnum.Spectator)
            return;
          }



          if (members.length === 1) {
            const otherMember = members[0];
            // if(!otherMember) return;

            // if(otherMember.user === user?.email) {
            //   setPlayerState(otherMember?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB);
            //   return;
            // }

            // if(!user) {
            //   return;
            // }

            if (otherMember.side === "w") {
              setPlayerState(playerEnum.PlayerB)
              console.log(user)
              axios.post('/api/update-game', {
                _id: pathname, update: {
                  members: [...members, {
                    user: user?.email,
                    side: "b"
                  }],
                  gameStatus: "playing",
                }
              }).then((data: any) => {
                console.log("YOU are added as W")
              })
            } else {
              setPlayerState(playerEnum.PlayerW)
              console.log(user)
              axios.post('/api/update-game', {
                _id: pathname, update: {
                  members: [...members, {
                    user: user?.email,
                    side: "w"
                  }],
                  gameStatus: "playing",
                }
              }).then((data: any) => {
                console.log("YOU are added as B")
              })
            }
          }
          // setPlayerState(playerEnum.PlayerW);

        } else {
          setPlayerState(playerEnum.Error)
        }
      }).catch(() => {
        setPlayerState(playerEnum.Error)
      })
    }, [user])

  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];

  const pieceComponents: any = {};
  pieces.forEach((piece) => {
    pieceComponents[piece] = ({ squareWidth }: any) => {
      return <img
        className="hover:ring-[6px] ring-black/20 duration-200 ease-in-out"
        src={`/matchstick1/${piece.toLowerCase()}.png`}
        style={{
          width: squareWidth,
          height: squareWidth,
          backgroundSize: "100%",
        }}
      />
    }
  });

  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    pusherClient.subscribe(pathname as string)

    pusherClient.bind('move', (data: any) => {
      if (data?.sessionID === pusherClient?.sessionID) {
        //it is the same user dont do anything
      } else {
        if (data?.data) {
          console.log('SAN GIVEN', data?.data?.san)
          const move_ = {
            from: data?.data?.from,
            to: data?.data?.to,
            promotion: data?.data?.promotion,
            san: data?.data?.san,
            color: data?.data?.color,
            piece: data?.data?.piece,
          }

          setMoveList((ml) => [...ml, move_])


          setGame({ main: new Chess(data?.data?.fen) })
        }
      }


    })

    pusherClient.bind('msg', (data: any) => {

      if (!data) return;
      setMsgList((ml: any) => [...ml, data])


    })

    return () => {
      pusherClient.unsubscribe(pathname as string)
    }
  }, []);

  const sendMove = async (text: any, roomId: string, channel: string) => {
    await axios.post('/api/msg', { text, roomId, channel })
  }
  const dropPiece = async (from: string, to: string, piece: undefined | null | string) => {
    if (playerState !== playerEnum.PlayerW && playerState !== playerEnum.PlayerB) return false;
    if (piece && piece[0] !== (playerState == playerEnum.PlayerW ? "w" : "b")) return false;

    const gameCopyable = game?.main;
    const move_ = {
      from,
      to,
      promotion: (piece as string)[1].toLowerCase() ?? "q",
    }

    const move = gameCopyable.move(move_);
    console.log(move)
    setGame({ main: gameCopyable })


    // console.log(addSessionID(move_, pusherClient?.sessionID), pathname, "move")

    if (!move) return false;


    const move__ = {
      from,
      to,
      promotion: (piece as string)[1].toLowerCase() ?? "q",
      san: move?.san,
      color: move?.color,
      piece: move?.piece,
    }

    // console

    setMoveList((ml) => [...ml, move__])


    await sendMove(addSessionID({ ...move_, fen: gameCopyable.fen(), san: move?.san, color: move?.color, piece: move?.piece }, pusherClient?.sessionID), pathname, "move");

    axios.post('/api/update-game', {
      _id: pathname, update: {
        moves: [...data?.data?.moves, move__],
        fen: gameCopyable.fen(),
      }
    }).then((data: any) => {
      console.log("added move LIST")
    })

    return true;
  }

  const [gameModule, setGameModule] = useState<any>(null);

  useEffect(() => {
    if (game?.main) {
      if (game.main?.isCheckmate()) {
        setGameModule({
          method: "checkmate",
          winnner: game.main.turn() === "w"? "b" : "w",
        });
      }

      if (game.main?.isDraw()) {
        setGameModule({
          method: "draw",
          winner: "-",
        });
      }

      if (game.main?.isInsufficientMaterial()) {
        setGameModule({
          method: "checkmate",
          winnner: "-",
        });
      }

      if (game?.main?.isStalemate()) {
        setGameModule({
          method: "checkmate",
          winnner: "-",
        });
      }
    }
  }, [game?.main])

  function determinePiece(piece: string, color: string) {
    const pieceMade = piece + color;
    // console.log(pieceMade)
    if (pieceMade == "pw") return "♟"
    if (pieceMade == "pb") return "♙"
    if (pieceMade == "bw") return "♝"
    if (pieceMade == "bb") return "♗"
    if (pieceMade == "qw") return "♛"
    if (pieceMade == "qb") return "♕"
    if (pieceMade == "kw") return "♚"
    if (pieceMade == "kb") return "♔"
    if (pieceMade == "nw") return "♞"
    if (pieceMade == "nb") return "♘"
    if (pieceMade == "rw") return "♜"
    if (pieceMade == "rb") return "♖"


    return ""
  }

  if (playerState == playerEnum.Loader) {
    return <Loading fit={true} />
  }

  if (playerState == playerEnum.Error) {
    return <Error fit={true} />
  }

  const submitMsg = async (e: any) => {
    e.preventDefault();
    setMsg("")



    await axios.post('/api/msg', {
      text: {
        user: user?.email,
        text: msg
      }, roomId: pathname, channel: "msg"
    })

  }

  return (
    <div className="w-full h-screen flex flex-grow-[1]">
      {showScroll && <div id="scroller" className="w-8 h-8 rounded-full bottom-0 bg-white z-[10] grid place-content-center absolute ml-4 mb-2 shadow-2xl animate-bounce">
        <ArrowDownIcon className="w-5 h-5 stroke-[3] text-blue-400" />

        <p className="absolute font-bold text-white w-[200px] space-x-1 ml-[38px] mt-[px] bg-slate-600 rounded-full p-1 justify-center flex">
          <span>Scroll down to chat</span>
          <XMarkIcon onClick={() => setShowScroll(false)} className="w-6 hover:scale-110 cursor-pointer h-6 stroke-[2.5] text-slate-400" />
        </p>
      </div>}
      <div className="w-[61%] h-full flex flex-col overflow-auto simpleScroll">

        <div className="w-full h-full bg-gray-900 p-6 grid place-content-center space-x-3">
          {gameModule && (
            <div className="w-screen h-screen bg-black/20 absolute inset-0 z-50 grid place-content-center">
              <div className="p-8 flex flex-col space-y-4 rounded-2xl bg-slate-600">
                <p className="text-white font-bold text-3xl flex items-center space-x-2">
                  <BoltIcon className="w-7 h-7"/>
                  <span>{gameModule.method}</span>
                </p>
                {gameModule.winner == "-" ? (<p className="font-semibold text-slate-300 text-2xl">damn no one won</p>) : <p className="font-semibold text-slate-300 text-2xl">{gameModule.winnner == "w" ? "white" : "black"} is the winner</p>}
                <XMarkIcon onClick={() => setGameModule(null)} className="h-8 cursor-pointer text-white stroke-[2.5] flex items-center justify-center p-2 rounded-full bg-black/20 w-full"/>
              </div>
            </div>
          )}
          <Chessboard boardOrientation={playerState == playerEnum.PlayerB ? "black" : "white"} position={game?.main?.fen()} onPieceDrop={dropPiece} boardWidth={500} customPieces={pieceComponents} customBoardStyle={{ borderRadius: '2px', boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} customLightSquareStyle={{ backgroundColor: "#f3f4f6" }} customDarkSquareStyle={{ backgroundColor: "#60a5fa" }} customNotationStyle={{ fontWeight: '800', fontFamily: "satoshi" }} />
          {/* <div className="w-full h-[500px] space-y-2 ridScrollbar overflow-y-scroll">
            {(moveList?.map((txt: any, index: any) => {
              console.log(txt)

              return <div key={index} className="font-semibold">{((index + 1 + 1) % 2 == 0) && (
                <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                  <div className="text-[13px] text-slate-400">{(index + 2) / 2}.</div>
                  <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                    {txt && <div key={txt?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-gray-400/20">
                      {determinePiece(txt?.piece, txt?.color)}
                      <span className="" style={{ fontSize: txt?.san?.length > 4 ? ("10px") : ("14px") }}>{txt?.san}</span>
                    </div>}




                    {(moveList[index + 1] && <div key={moveList[index + 1]?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-gray-400/20">
                      {determinePiece(moveList[index + 1]?.piece, moveList[index + 1]?.color)}
                      <span className="" style={{ fontSize: "14" + "px" }}>{(moveList[index + 1]?.san)}</span>
                    </div>)}



                  </div>
                </div>
              )}</div>
            }))}


            {moveList.length == 0 && (
              <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                <div className="text-[13px] text-slate-400">1.</div>
                <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                  <div className="w-[100%] min-w-[100%] max-w-[100%] bg-white/3 h-[20px] flex items-center text-slate-300 border-l-px] border-gray-400/20">

                    <span>not played</span>


                  </div>
                </div>
              </div>)


            }

          </div> */}
        </div>
        <div className="w-full h-full flex-col flex-grow-[1] ">

          <div className="w-full h-full flex flex-col flex-grow-[1]">



            <div className="flex p-4 border-b-2 border-white/5 space-x-2 justify-between">
              <div className="flex space-x-6 items-center">
                <SpeakerWaveIcon className="w-6 h-6 text-white" />
                <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowsPointingOutIcon className="w-6 h-6 text-white stroke-[2]" />
            </div>




            <div className="w-full h-full flex items-center justify-center space-x-4 p-4">
              {data?.data?.gameStatus == "playing" ? <>
                <Tippy content={<MyCustomTip text={"resign"} />}>
                  <div className="bg-red-500 space-x-4 p-4 items-center justify-center flex trans rounded-full trans cursor-pointer">
                    <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" />
                    <FlagIcon className="w-6 h-6 text-red-100 rotate-[15deg] stroke-[2.5]" />
                    <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" />

                  </div>
                </Tippy>
                <Tippy content={<MyCustomTip text={"draw"} />}>
                  <div className="bg-amber-300 space-x-4 p-4 items-center justify-center flex trans rounded-full trans cursor-pointer">
                    {/* <ArrowsUpDownIcon className="w-4 h-4 text-slate-300 rotate-[15deg] stroke-[2.5]" /> */}
                    <ArrowsUpDownIcon className="w-6 h-6 text-amber-600 stroke-[2.5]" />
                    {/* <ArrowsUpDownIcon className="w-4 h-4 text-slate-300 rotate-[15deg] stroke-[2.5]" /> */}

                  </div>
                </Tippy>
              </> : (
                <>
                  <WaitForRival />
                </>
              )}
            </div>
            <div className="w-full p-4 pt-0">
              <div className="w-full h-full max-h-full flex flex-col flex-grow-[1] p-4 space-y-4 border-2 border-white/5 rounded-t-xl"> <div className="w-full h-[150px] overflow-y-scroll simpleScroll space-y-2"> {msgList && msgList.map((msg: any, index: any) => (<div key={index} className="space-x-[8px] w-full h-fit"> <span className="font-semibold text-white">{msg?.user}:</span> <span className="font-semibold text-slate-400">{msg?.text}</span> </div>))} </div> <div className="w-full h-fit flex-grow-[1] rounded-full flex space-x-4 p-3 placeholder:font-semibold font-semibold bg-slate-500"> <ChatBubbleLeftEllipsisIcon className="w-6 h-6 stroke-[2] text-white" /> <form onSubmit={submitMsg}> <input onChange={(e) => setMsg(e?.target.value)} value={msg} className="bg-transparent focus:outline-none outline-none text-white w-full" placeholder="game chat" /> </form> </div> </div>
            </div>
          </div>

        </div>
      </div>
      <div className="w-[39%] h-full bg-[#4a5668]">
        <div className="w-full h-[39%] border-b-2  border-[#3d4756] flex flex-col flex-grow-[1]">
          <div className="p-2 flex w-full h-[45px] justify-center bg-white/5">
            {(playerState == playerEnum.PlayerB || playerState == playerEnum.PlayerW) && <div className="text-white font-bold flex space-x-4 items-center">
              <div className={`w-4 h-4 rounded-full animate-pulse ${playerState == playerEnum.PlayerW ? "bg-white" : "bg-black"}`}>
              </div>
              <span>{playerState == playerEnum.PlayerW ? "you play as White" : "you play as Black"}</span>

            </div>}
          </div>
          <div className="w-full h-fit flex flex-col">
            {data?.data?.gameStatus !== "playing" ? <div className="w-full h-fit grid place-content-center p-4 border-b-2 border-black/20">
              <WaitForRival />
            </div> : (
              <div className="flex flex-col w-full h-fit">
                <div className="flex w-full h-fit items-center justify-center space-x-3 bg-slate-700 p-4">
                  <span className="font-bold text-slate-200">playing</span>
                  <Image alt="opponent" width={40} className="rounded-full border-[3px] border-slate-500" height={40} src={opponent?.photoURL} />
                  <div className="flex flex-col">

                    <span className="text-white font-bold leading-4 flex space-x-3"><span className="text-blue-500">{opponent?.elo}</span><span>{opponent?.name}</span></span>
                    <span className="text-slate-400 font-semibold">{opponent?.email}</span>

                  </div>
                </div>

              </div>
            )}

          </div>

          <div className="w-full h-full p-4 flex flex-col grow-[1]">
            <div className="w-full h-full grid place-content-center">

              <div className="w-full h-fit rounded-full flex space-x-4 p-3 placeholder:font-semibold font-semibold bg-slate-500"> <ChatBubbleLeftEllipsisIcon className="w-6 h-6 stroke-[2] text-white" /> <form onSubmit={submitMsg}> <input onChange={(e) => setMsg(e?.target.value)} value={msg} className="bg-transparent focus:outline-none outline-none text-white w-full" placeholder="game chat" /> </form> </div>
            </div>

          </div>
        </div>
        <div className="w-full h-[61%] flex">
          <div className="w-[61%] h-full border-[#3d4756] border-r-2 p-4">
            <div className="w-full h-full simpleScroll space-y-2 overflow-y-scroll simpleScroll">
              {(moveList?.map((txt: any, index: any) => {

                return <div key={index} className="font-semibold">{((index + 1 + 1) % 2 == 0) && (
                  <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                    <div className="text-[13px] text-slate-400">{(index + 2) / 2}.</div>
                    <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                      {txt && <div key={txt?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-gray-400/20">
                        {determinePiece(txt?.piece, txt?.color)}
                        <span className="" style={{ fontSize: txt?.san?.length > 4 ? ("10px") : ("14px") }}>{txt?.san}</span>
                      </div>}




                      {((moveList && moveList[index + 1]) && <div key={moveList[index + 1]?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-gray-400/20">
                        {determinePiece(moveList[index + 1]?.piece, moveList[index + 1]?.color)}
                        <span className="" style={{ fontSize: "14" + "px" }}>{(moveList[index + 1]?.san)}</span>
                      </div>)}



                    </div>
                  </div>
                )}</div>
              }))}


              {moveList?.length == 0 && (
                <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                  <div className="text-[13px] text-slate-400">1.</div>
                  <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                    <div className="w-[100%] min-w-[100%] max-w-[100%] bg-white/3 h-[20px] flex items-center text-slate-300 border-l-px] border-gray-400/20">

                      <span>not played</span>


                    </div>
                  </div>
                </div>)


              }

            </div>
          </div>
          <div className="w-[39%] h-full"></div>
        </div>

      </div>


    </div>
  );
}

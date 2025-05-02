import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBar = useRef();
    const seekBg = useRef();

    const BASE_URL = import.meta.env.VITE_API_URL;

    const [songsData , setSongsData] = useState([])
    const [albumsData , setalbumsData] = useState([])


    const [track , setTrack] = useState(songsData[0])
    const [playStatus , setPlayStatus] = useState(false);
    const [time , setTime] = useState({
        currentTime : {
            second:0,
            minute:0
        },
        totalTime:{
            second:0,
            minute: 0
        }
    })

    const getSongsData = async () => {
        try {
            const res = await axios.get(`${url}/api/song/list`);
            setSongsData(res.data.songs)
            console.log(res.data.songs);
            setTrack(res.data.songs[0])
        } catch (error) {
            
        }
    }

    const getAlbumsData = async () => {
        try {
            const res = await axios.get(`${url}/api/album/list`);
            setalbumsData(res.data.albums)
        } catch (error) {
            
        }
    }

    useEffect(()=>{   
        getSongsData()
        getAlbumsData()
    },[])

    useEffect(()=>{
           setTimeout(()=>{
             audioRef.current.ontimeupdate =  () => {
                setTime({
                    currentTime : {
                        second:Math.floor(audioRef.current.currentTime%60),
                        minute:Math.floor(audioRef.current.currentTime/60)
                    },
                    totalTime:{
                        second:Math.floor(audioRef.current.duration%60),
                        minute:Math.floor(audioRef.current.duration/60)
                    }
                })
             }
           },1000)
    },[audioRef])

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    useEffect(()=>{
        setTimeout(()=>{
          audioRef.current.ontimeupdate = () => {
            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
            setTime({
                currentTime : {
                    second: Math.floor(audioRef.current.currentTime % 60),
                    minute: Math.floor(audioRef.current.currentTime / 60)
                },
                totalTime:{
                    second: Math.floor(audioRef.current.duration % 60),
                    minute: Math.floor(audioRef.current.duration / 60)
                }
            })
          } 
        },1000)
    },[audioRef])

    const playWithId = async (id) => {
        await songsData.map((item)=>{
            if(id === item._id){
                setTrack(item);
            }
        })
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        songsData.map(async(item,index) => {
            if(track._id ===item._id && index > 0) {
                await setTrack(songsData[index-1])
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const next = async () => {
        songsData.map(async(item,index) => {
            if(track._id ===item._id && index < songsData.length) {
                await setTrack(songsData[index+1])
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const seekSong = async(e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)

    }


    const contextValue = {
      songsData, albumsData, audioRef, seekSong, playWithId ,next , previous, seekBar, seekBg , track , setTrack , playStatus , setPlayStatus , time , setTime , play , pause
    }

    



    return (
        <PlayerContext.Provider value={contextValue} >
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;
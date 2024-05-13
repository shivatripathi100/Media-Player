import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ReactPlayer from 'react-player';
import { styled } from '@mui/system';
import PlayerControls from './Components/PlayerControls';
import screenfull from 'screenfull';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const PlayerWrapper = styled('div')({
  width: '100%',
  position: 'relative',
});

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function App() {
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    currentVideoIndex: 0,
    minimized: false, 
    loading: true,
  });

  const [timeDisplayFormat, setTimeDisplayFormat] = useState('normal');
  const [bookmarks, setBookmarks] = useState([]);

  const { playing, muted, volume, playbackRate, played, seeking, currentVideoIndex, minimized, loading } = state;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  const videos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  ];

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVolumeSeekUp = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handlePlaybackRateChange = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
  };

  const handleProgress = (changeState) => {
    if (count > 2) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, 'fraction');
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(timeDisplayFormat === 'normal' ? 'remaining' : 'normal');
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dataUri = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    const bookmarksCopy = [...bookmarks];
    bookmarksCopy.push({
      time: playerRef.current.getCurrentTime(),
      display: format(playerRef.current.getCurrentTime()),
      image: dataUri,
    });
    setBookmarks(bookmarksCopy);
  };

  const handleNextVideo = () => {
    setState(prevState => ({
      ...prevState,
      currentVideoIndex: (prevState.currentVideoIndex + 1) % videos.length,
      
    }));
  };

  const handlePreviousVideo = () => {
    setState(prevState => ({
      ...prevState,
      currentVideoIndex: (prevState.currentVideoIndex - 1 + videos.length) % videos.length,
    }));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!state.seeking && playing) {
        setState((prevState) => ({
          ...prevState,
          played: playerRef.current.getCurrentTime() / playerRef.current.getDuration(),
        }));
      }
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [playing, state.seeking]);

  const toggleMinimize = () => {
    setState({ ...state, minimized: !minimized });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.keyCode) {
        case 32:
          handlePlayPause();
          break;
        case 38: 
          handleVolumeChange(null, Math.min(volume * 100 + 10, 100));
          break;
        case 40: 
          handleVolumeChange(null, Math.max(volume * 100 - 10, 0));
          break;
        case 39: 
          handleFastForward();
          break;
        case 37: 
          handleRewind();
          break;
        case 77: 
          handleMute();
          break;
        case 70: 
          toggleFullScreen();
          break;
        case 27: 
          if (screenfull.isFullscreen) {
            toggleFullScreen();
          }
          break;
        case 78:
          handleNextVideo();
          break;
        case 80: 
          handlePreviousVideo();
          break;
        case 87: 
          toggleMinimize(); 
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlayPause, handleVolumeChange, handleFastForward, handleRewind, handleMute, toggleFullScreen, handleNextVideo, handlePreviousVideo, toggleMinimize]);

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
  const duration = playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime =
    timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  return (
    <>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6'>React Media Player</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth='md'>
        {minimized ? ( 
          <PlayerWrapper ref={playerContainerRef} onMouseMove={handleMouseMove} style={{ position: 'fixed', bottom: 0, right: 0, width: 300 }}>
            <ReactPlayer
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              url={videos[currentVideoIndex]}
              muted={muted}
              playing={playing}
              volume={volume}
              playbackRate={playbackRate}
              onProgress={handleProgress}
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                  },
                },
              }}
              onBuffer={() => setState({ ...state, loading: true })} 
              onBufferEnd={() => setState({ ...state, loading: false })} 
            />
            {loading && ( 
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <CircularProgress color="secondary" />
              </div>
            )}
          </PlayerWrapper>
        ) : (
          <PlayerWrapper ref={playerContainerRef} onMouseMove={handleMouseMove}>
            <ReactPlayer
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              url={videos[currentVideoIndex]} 
              muted={muted}
              playing={playing}
              volume={volume}
              playbackRate={playbackRate}
              onProgress={handleProgress}
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                  },
                },
              }}
              onBuffer={() => setState({ ...state, loading: true })} 
              onBufferEnd={() => setState({ ...state, loading: false })} 
            />

            <PlayerControls
              ref={controlsRef}
              onPlayPause={handlePlayPause}
              playing={playing}
              onRewind={handleRewind}
              onFastForward={handleFastForward}
              muted={muted}
              onMute={handleMute}
              onVolumeChange={handleVolumeChange}
              onVolumeSeekUp={handleVolumeSeekUp}
              volume={volume}
              playbackRate={playbackRate}
              onPlaybackRateChange={handlePlaybackRateChange}
              onToggleFullScreen={toggleFullScreen}
              played={played}
              onSeek={handleSeekChange}
              onSeekMouseDown={handleSeekMouseDown}
              onSeekMouseUp={handleSeekMouseUp}
              elapsedTime={elapsedTime}
              totalDuration={totalDuration}
              onChangeDisplayFormat={handleChangeDisplayFormat}
              onBookmark={addBookmark}
              onNextVideo={handleNextVideo} 
              onPreviousVideo={handlePreviousVideo} 
              onToggleMinimize={toggleMinimize}
              loading={loading}
            />
          </PlayerWrapper>
        )}

        <Grid container style={{ marginTop: 20 }} spacing={3}>
          {bookmarks.map((bookmark, index) => (
            <Grid key={index} item>
              <Paper
                onClick={() => {
                  playerRef.current.seekTo(bookmark.time);
                }}
                elevation={3}
              >
                <img crossOrigin='anonymous' src={bookmark.image} alt='bookmark' />
                <Typography variant='body2' align='center'>
                  Bookmark at {bookmark.display}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Container>
    </>
  );
}

export default App;
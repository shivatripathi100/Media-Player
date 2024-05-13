import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/system";
import Grid from '@mui/material/Grid';
import Bookmark from '@mui/icons-material/Bookmark';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullScreenIcon from '@mui/icons-material/FullScreen';
import Popover from '@mui/material/Popover';
import VolumeOff from '@mui/icons-material/VolumeOff';
import MinimizeIcon from '@mui/icons-material/Minimize'; 
import CircularProgress from '@mui/material/CircularProgress';

const ControlWrapper = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 1
});

const ControlIcons = styled(IconButton)({
  color: '#777',
  fontSize: 50,
  transform: 'scale(0.9)',
  '&:hover': {
    color: '#fff',
    transform: 'scale(1)'
  },
});

const ControlVideoIcons = styled(IconButton)({
  color: '#777',
  fontSize: 50,
  transform: 'scale(0.9)',
  '&:hover': {
    color: '#fff',
    transform: 'scale(1)'
  },
});

const BottomIcons = styled(IconButton)({
  color: '#999',
  '&:hover': {
    colors: '#fff'
  },
});

const VolumeSlider = styled(Slider)({
  width: 100,
});

const PlayControls = React.forwardRef(({
  onPlayPause,
  playing,
  onRewind,
  onFastForward,
  muted,
  onMute,
  onVolumeChange,
  onVolumeSeekUp,
  volume,
  onPlaybackRateChange,
  playbackRate,
  onToggleFullScreen,
  played,
  onSeek,
  onSeekMouseDown,
  onSeekMouseUp,
  elapsedTime,
  totalDuration,
  onChangeDisplayFormat,
  onBookmark,
  onNextVideo,
  onPreviousVideo,
  onToggleMinimize,
  loading
}, ref) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [seekValue, setSeekValue] = useState(played * 100);
  const [volumeValue, setVolumeValue] = useState(volume * 100);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  return (
    <ControlWrapper ref={ref}>
      {/* Top Controls */}
      <Grid
        container direction='row'
        alignItems='center'
        justify='space-between'
        style={{ padding: 16 }}>
        <Grid item>
          <Typography variant='h5' style={{ color: '#fff' }}>
            Video Title
          </Typography>
        </Grid>

        <Grid item>
          <Button
            onClick={onBookmark}
            variant='contained'
            color='primary'
            startIcon={<Bookmark />}
            style={{ marginLeft: '400%' }}
          >
            Bookmark
          </Button>
        </Grid>
      </Grid>

      {/* Middle Controls */}
      <Grid
        container
        direction='row'
        alignItems='center'
        justify='center'
        style={{ marginLeft: '37%' }}
      >
        

        <ControlIcons onClick={onRewind} aria-label='rewind'>
          <FastRewindIcon fontSize='inherit' />
        </ControlIcons>

        <ControlIcons onClick={onPlayPause} aria-label='play/pause'>
          {playing ? (
            <PauseIcon fontSize='inherit' />
          ) : (
            <PlayArrowIcon fontSize='inherit' />
          )}
        </ControlIcons>

        <ControlIcons onClick={onFastForward} aria-label='fast forward'>
          <FastForwardIcon fontSize='inherit' />
        </ControlIcons>

        
      </Grid>

      {/* Bottom controls */}
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        style={{ padding: 16 }}
      >
        <Grid item xs={12}>
          <Slider
            min={0}
            max={100}
            value={played * 100} 
            onChange={onSeek}
            onMouseDown={onSeekMouseDown}
            onChangeCommitted={onSeekMouseUp}	
          />
        </Grid>

        <Grid item>
          <Grid container alignItems='center' direction='row'>
            <BottomIcons onClick={onPlayPause}>
              {playing ? (
                <PauseIcon fontSize='inherit' />
              ) : (
                <PlayArrowIcon fontSize='inherit' />
              )}
            </BottomIcons>

            <BottomIcons onClick={onMute}>
              {muted ? <VolumeOff fontSize='large' /> : <VolumeUpIcon fontSize='large' />}
            </BottomIcons>

            <VolumeSlider
              min={0}
              max={100}
              value={volumeValue}
              onChange={(event, newValue) => {
                setVolumeValue(newValue);
                onVolumeChange(event, newValue);
              }}
              onChangeCommitted={(event, newValue) => onVolumeSeekUp(event, newValue)}
            />
            <Button onClick={onChangeDisplayFormat}>
              <Typography
                variant='text'
                style={{ color: '#fff', marginLeft: 16 }}
              >
                {elapsedTime}/{totalDuration}
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Button onClick={handlePopover} variant='text'>
            <Typography>{playbackRate}X</Typography>
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Grid container direction='column'></Grid>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 4.0].map(rate => (
              <Button key={rate} onClick={() => onPlaybackRateChange(rate)} variant='text'>
                <Typography color={rate === playbackRate ? "secondary" : "default"}>{rate}</Typography>
              </Button>
            ))}
          </Popover>
          
        </Grid>
        
        
        {/* Minimize button */}
        <BottomIcons onClick={onToggleMinimize}>
          <MinimizeIcon fontSize='large' />
        </BottomIcons>
        
        <BottomIcons onClick={onPreviousVideo} aria-label='next'>
          <SkipPreviousIcon fontSize='inherit' />
        </BottomIcons>

        <BottomIcons onClick={onNextVideo} aria-label='next'>
          <SkipNextIcon fontSize='inherit' />
        </BottomIcons>

        <BottomIcons onClick={onToggleFullScreen}>
            <FullScreenIcon fontSize='large' />
          </BottomIcons>
        
        {/* Loading overlay */}

            {loading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <CircularProgress color="secondary" />
            </div>
            )}

      </Grid>
    </ControlWrapper>
  );
});

export default PlayControls;

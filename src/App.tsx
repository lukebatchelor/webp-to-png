import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import './App.css';

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: theme.palette.success.main,
  },
  outputImage: {
    maxWidth: '100%',
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    textAlign: 'center',
    minHeight: '20vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  logo: {
    backgroundColor: '#31419a',
  },
}));

export function App() {
  const classes = useStyles();
  const [imgStr, setImgStr] = useState<string>('');
  const [file, setFile] = useState<File>();
  const imgRef = useRef<HTMLImageElement>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fr = new FileReader();
    fr.onload = () => {
      setImgStr(fr.result as string);
      setFile(file);
    };
    fr.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/webp' });

  const download = () => {
    if (!imgRef.current) return;

    try {
      // convert the image to png by writing it to a canvas and reading it back
      const canvas = document.createElement('canvas');
      canvas.height = imgRef.current.naturalHeight;
      canvas.width = imgRef.current.naturalWidth;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(imgRef.current, 0, 0);
      const imgUrl = canvas.toDataURL('png');

      // LB: Keeping this in here for posterity. This method of downloading does not work from inside a PWA
      // // download the image by clicking the invisible link
      // anchor.href = imgUrl;
      // anchor.download = 'image.png';
      // anchor.click();

      const popup = window.open();
      const link = document.createElement('a');
      link.setAttribute('href', imgUrl);
      link.setAttribute('download', `image-${Date.now()}.png`);
      popup?.document.body.appendChild(link);
      link.click();
      popup?.close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" align="center">
            Webp to PNG Converter
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mb={16} />
      <Typography align="center">A super simple app for solving a very simple problem</Typography>
      <Box />
      <Paper {...getRootProps()} className={classes.paper}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" justifyItems="center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="body1">Drop the files here ...</Typography>
          ) : (
            <>
              <Typography variant="body1">Drag 'n' drop some files here, or click to select files</Typography>
              <AttachFileIcon fontSize="small" style={{ marginTop: '20px' }} />
            </>
          )}
        </Box>
      </Paper>
      <Box />
      <Box display="flex" justifyContent="center">
        {imgStr && <img src={imgStr} ref={imgRef} className={classes.outputImage} />}
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        {imgStr && (
          <Button variant="contained" color="primary" onClick={download}>
            Download as .png
          </Button>
        )}
      </Box>
    </Container>
  );
}

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

import CityCard from './components/CityCard/index';
import Map from './components/Map/index';

const key = '31ac3664dd7f57bf862f772e0328d755'
const url1 = 'https://api.openweathermap.org/data/2.5/onecall'
const url2 = 'https://api.openweathermap.org/data/2.5/weather'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {

  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const [places, setPlaces] = useState([]);

  const [mapOpen, setMapOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [newCityText, setNewCityText] = useState('');
  const [newCity, setNewCity] = useState('');

  const classes = useStyles();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

  }, []);

  useEffect(() => {
    const getWeather = async() => {
      const params = '?lat=' + latitude
                  + '&lon=' + longitude
                  + '&appid=' + key
                  + '&exclude=minutely,alerts'
                  + '&units=metric';

      await fetch(url1 + params)
          .then(response => response.text())
          .then(async (result) => {
            let firstResult = JSON.parse(result);
            await fetch(url2 + params)
                .then(response => response.text())
                .then(newResult => {
                  const secondResult = JSON.parse(newResult);
                  firstResult['location'] = secondResult.name + ", " + secondResult.sys.country;
                })

            setPlaces(prevPlaces => [firstResult, ...prevPlaces]);
          })
    }

    if (latitude !== null && longitude !== null){
      getWeather();
    }
  }, [latitude, longitude]);

  useEffect(() => {

    const getNewCity = async() => {
      const params = '?q=' + newCity
                  + '&appid=' + key;

      await fetch(url2 + params)
          .then(response => response.text())
          .then(async (result) => {
            let firstResult = JSON.parse(result);

            if (firstResult.cod === "404"){
              alert('Not a valid city.');
            }

            else {
              const params = '?lat=' + firstResult.coord.lat
                          + '&lon=' + firstResult.coord.lon
                          + '&appid=' + key
                          + '&exclude=minutely,alerts'
                          + '&units=metric';

              await fetch(url1 + params)
                  .then(response => response.text())
                  .then(newResult => {
                    const secondResult = JSON.parse(newResult);
                    secondResult['location'] = firstResult.name + ", " + firstResult.sys.country;
                    setPlaces(prevPlaces => [secondResult, ...prevPlaces]);
                  })
            }

          })
    }
    if (newCity !== ''){
      getNewCity();
      setNewCity('');
    }
  }, [newCity]);

  const handleAddCity = () => {
    setNewCity(newCityText);
    setNewCityText('');
    setShowDialog(false);
  }

  const handleAddButtonClick = () => {
    setShowDialog(true);
  }

  const handleMapOpen = event => {
    setShowDialog(false);
    setMapOpen(true);
    event.preventDefault();
  }

  const checkEnter = event => {
    if (event.keyCode === 13){
      handleAddCity();
    }
  }

  return (
    <>
      { mapOpen ?
        <Map
          className={classes.map}
          longitude={longitude}
          latitude={latitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setMapOpen={setMapOpen}
        />
          :
        <Container maxWidth="sm">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Forecasts
              </Typography>
              <IconButton
                onClick={handleAddButtonClick}
                color="inherit"
              >
                <Tooltip title="Add Location">
                  <AddIcon />
                </Tooltip>
              </IconButton>
            </Toolbar>
          </AppBar>

          <Typography variant="caption">
            <i>Please add locations from the top bar to get forecasts.</i>
          </Typography><br/>

          <Typography variant="caption">
            <i>The app automatically detects your current location if you enable location on your browser.</i>
          </Typography>

          { places.length === 0 && <CityCard data={{}} /> }

          { places.map((place, index) => (
            <CityCard
              data={place}
              key={index}
            />
          )) }
        </Container>
      }

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="add-location-dialog"
      >
        <DialogTitle id="add-location-dialog-title">Add Location</DialogTitle>

        <DialogContent>
          <DialogContentText>
            To add a location, please enter a city.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="City"
            type="email"
            value={newCityText}
            onKeyUp={checkEnter}
            onChange={event => setNewCityText(event.target.value)}
            fullWidth
          />
          <Typography variant="caption">
            <i>Or, click <Link href="#" onClick={handleMapOpen}>here</Link> to add from a map.</i>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCity} color="primary">
            Add City
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

mapboxgl.accessToken = 'pk.eyJ1IjoicGFuYXNzdWJlZGkiLCJhIjoiY2txbTJpaWlhMGplcTJ2cDJsZmNibzlrdSJ9._JlerSTa-hOp2aU46OLcWw';

function Map({longitude, latitude, setLatitude, setLongitude, setMapOpen }) {

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(longitude);
  const [lat, setLat] = useState(latitude);

  const addLocation = () => {
    setLatitude(lat);
    setLongitude(lng);
    setMapOpen(false);
  }

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 10
    });

  }, [lng, lat]);

  useEffect(() => {
    if (!map.current) return;

    map.current.on('click', event => {
      setLng(event.lngLat.lng.toFixed(4));
      setLat(event.lngLat.lat.toFixed(4));
    })
  })

  return (
    <Container>
      <Paper
        square
        ref={mapContainer}
        className="map-container"
      />
      <Grid container justify="space-between">
        <Grid item>
          <Typography>
            Longitude: { lng }, Latitude: { lat }
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="inherit"
            onClick={addLocation}
          >Add Place</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Map;

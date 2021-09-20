import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Chip from '@material-ui/core/Chip';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import Avatar from '@material-ui/core/Avatar';

const MONTHS = [
  "JAN", "FEB", "MAR",
  "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP",
  "OCT", "NOV", "DEC"
]

const useStyles = makeStyles((theme) => ({
  card: {
    border: '1px solid #ccc',
    flexGrow: 1,
    margin: "10px 0",
    padding: "10px"
  },
  temp: {
    fontSize: '300%'
  },
  weather: {
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  location: {
    fontSize: '80%',
    textTransform: 'uppercase',
    marginTop:'5px'
  },
  accordion: {
    marginTop:'10px'
  }
}));

function CityCard({ data }){

  if (Object.keys(data).length === 0){

  }

  const classes = useStyles();

  const getDateTime = dt => {
    const date = new Date(parseInt(dt)*1000);
    return date.getDate() + " " + MONTHS[date.getMonth()] + ' at ' + date.getHours() + ":" + date.getMinutes();
  }

  const getDailyTable = dailyData => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
          </TableCell>
          <TableCell>
          </TableCell>
          <TableCell>
            <strong>Min</strong>
          </TableCell>
          <TableCell>
            <strong>Max</strong>
          </TableCell>
          <TableCell>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { dailyData.map((forecast, index) => (
          <TableRow key={index}>
            <TableCell>
              <Avatar>
                <img
                  src={"http://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png"}
                  alt="weather icon"
                />
              </Avatar>
            </TableCell>
            <TableCell>
              { new Date(forecast.dt*1000).getDate() + " " + MONTHS[new Date(forecast.dt*1000).getMonth()] }
            </TableCell>
            <TableCell>
              { forecast.temp.min }&deg;
            </TableCell>
            <TableCell>
              { forecast.temp.max }&deg;
            </TableCell>
            <TableCell>
              <Chip size="small" label={forecast.weather[0].description} className={classes.weather} />
            </TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  )

  const getHourlyTable = hourlyData => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
          </TableCell>
          <TableCell>
          </TableCell>
          <TableCell>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { hourlyData.map((forecast, index) => {

            if (new Date(forecast.dt*1000) < new Date()){
              return <></>
            }

            else if (new Date(forecast.dt*1000).getDate() > new Date().getDate()) {
              return <></>
            }

            else {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar>
                        <img
                          src={"http://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png"}
                          alt="weather icon"
                        />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      { new Date(forecast.dt*1000).getHours() + ":00" }
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={forecast.weather[0].description} className={classes.weather} />
                    </TableCell>
                  </TableRow>
              )
            }
          } ) }
      </TableBody>
    </Table>
  )

  return (
    <Paper
      elevation={1}
      className={classes.card}
      square
    >

      { Object.keys(data).length === 0
        ?
      <>
        <Box justify="center">
          No location added.
        </Box>
      </>

        :
      <>
        <Grid container justify="space-between">
          <Grid item>
            <Box className={classes.temp}>
              { data.current.temp }&deg;
            </Box>
            <Box className={classes.datetime}>
              { getDateTime(data.current.dt) }
            </Box>
            <Box className={classes.datetime}>
              { data.location }
            </Box>
          </Grid>
          <Grid item>
            <Box className={classes.weatherIcon}>
              <img
                src={"http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"}
                alt="weather icon"
              />
            </Box>
            <Box className={classes.weather}>
              <Chip
                size="small"
                label={ data.current.weather[0].description }
              />
            </Box>
          </Grid>
        </Grid>

        <Accordion square className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Hourly Forecast</Typography>
          </AccordionSummary>
          <AccordionDetails>
            { getHourlyTable(data.hourly) }
          </AccordionDetails>
        </Accordion>

        <Accordion square className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Daily Forecast</Typography>
          </AccordionSummary>
          <AccordionDetails>
            { getDailyTable(data.daily) }
          </AccordionDetails>
        </Accordion>
      </>}
    </Paper>
  )
}

export default CityCard;

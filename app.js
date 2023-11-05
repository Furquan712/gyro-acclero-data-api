const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create separate CSV files for gyrometer and accelerometer
const gyrometerCsvFile = 'gyrometer.csv';
const accelerometerCsvFile = 'accelerometer.csv';

// Helper function to validate data
function validateData(data) {
    console.log(data);
  return data && data.x !== undefined && data.y !== undefined && data.z !== undefined;
  
}
 

// Define a route to handle POST requests with gyrometer data
app.post('/api/gyrometer', (req, res) => {
  const gyrometer = req.body;

  if (validateData(gyrometer)) {
    // Create a CSV string from the received data
    const csvData = `${gyrometer.x},${gyrometer.y},${gyrometer.z}\n`;

    // Append the data to the gyrometer CSV file
    fs.appendFile(gyrometerCsvFile, csvData, (err) => {
      if (err) {
        console.error('Error writing to gyrometer CSV file:', err);
        res.status(500).send('Error writing to gyrometer CSV file');
      } else {
        console.log('Gyrometer data saved to CSV file');
        res.status(201).send('Gyrometer data saved to CSV file');
      }
    });
  } else {
    res.status(400).send('Invalid or incomplete gyrometer data');
  }
});

// Define a route to handle POST requests with accelerometer data
app.post('/api/accelerometer', (req, res) => {
  const accelerometer = req.body;

  if (validateData(accelerometer)) {
    // Create a CSV string from the received data
    const csvData = `${accelerometer.x},${accelerometer.y},${accelerometer.z}\n`;

    // Append the data to the accelerometer CSV file
    fs.appendFile(accelerometerCsvFile, csvData, (err) => {
      if (err) {
        console.error('Error writing to accelerometer CSV file:', err);
        res.status(500).send('Error writing to accelerometer CSV file');
      } else {
        console.log('Accelerometer data saved to CSV file');
        res.status(201).send('Accelerometer data saved to CSV file');
      }
    });
  } else {
    res.status(400).send('Invalid or incomplete accelerometer data');
  }
});

// Define a route to get gyrometer data in JSON format
app.get('/api/gyrometer', (req, res) => {
  fs.readFile(gyrometerCsvFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading gyrometer CSV file:', err);
      res.status(500).json({ status: false, data: null, message: 'Error reading gyrometer CSV file' });
    } else {
      const rows = data.trim().split('\n');
      const csvData = rows.map((row) => {
        const [x, y, z] = row.split(',');
        return { x, y, z };
      });

      res.status(200).json({ status: true, data: csvData });
    }
  });
});

// Define a route to get accelerometer data in JSON format
app.get('/api/accelerometer', (req, res) => {
  fs.readFile(accelerometerCsvFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading accelerometer CSV file:', err);
      res.status(500).json({ status: false, data: null, message: 'Error reading accelerometer CSV file' });
    } else {
      const rows = data.trim().split('\n');
      const csvData = rows.map((row) => {
        const [x, y, z] = row.split(',');
        return { x, y, z };
      });

      res.status(200).json({ status: true, data: csvData });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create the CSV files if they don't exist
fs.access(gyrometerCsvFile, (err) => {
  if (err) {
    fs.writeFile(gyrometerCsvFile, 'x,y,z\n', (err) => {
      if (err) {
        console.error('Error creating gyrometer CSV file:', err);
      } else {
        console.log('Gyrometer CSV file created.');
      }
    });
  }
});

fs.access(accelerometerCsvFile, (err) => {
  if (err) {
    fs.writeFile(accelerometerCsvFile, 'x,y,z\n', (err) => {
      if (err) {
        console.error('Error creating accelerometer CSV file:', err);
      } else {
        console.log('Accelerometer CSV file created.');
      }
    });
  }
});

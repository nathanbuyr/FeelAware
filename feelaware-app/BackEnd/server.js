require('dotenv').config();
const { OpenAI } = require('openai');
const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

// Allow communication between front-end and back-end
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Body Parsing
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@feelawaredb.mubb5ey.mongodb.net/?retryWrites=true&w=majority&appName=FeelAwareDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Define Schema for Mood Entry
const moodSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mood: { type: String, required: true },
  reflection: { type: String, default: '' },
});

// Data model for Mood Entries
const MoodEntry = mongoose.model('MoodEntry', moodSchema);

// POST route to save a new mood entry
app.post('/api/moods', async (req, res) => {
  try {
    const { date, mood } = req.body;
    const newMoodEntry = new MoodEntry({ date, mood });
    await newMoodEntry.save();
    res.status(201).json({ message: 'Mood entry created successfully', entry: newMoodEntry });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({ error: 'Failed to create mood entry' });
  }
});

app.post('/api/moods', async (req, res) => {
  try {
    const { date, mood } = req.body; // Get date and mood from the request body
    const newMoodEntry = new MoodEntry({ date, mood }); // Create a new mood entry
    await newMoodEntry.save(); // Save the entry to MongoDB
    res.status(201).json({ message: 'Mood entry created successfully', entry: newMoodEntry }); // Send success response
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({ error: 'Failed to create mood entry' }); // Send error response
  }
});


// GET route to fetch all mood entries
app.get('/api/moods', async (req, res) => {
  try {
    const entries = await MoodEntry.find({});
    res.json(entries);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

// PUT route to update a mood entry by ID
app.put('/api/moods/:id', async (req, res) => {
  try {
    const moodId = req.params.id;
    const { reflection } = req.body;
    const updatedEntry = await MoodEntry.findByIdAndUpdate(
      moodId,
      { reflection },
      { new: true }
    );
    if (updatedEntry) {
      res.status(200).json({ message: 'Mood entry updated successfully', entry: updatedEntry });
    } else {
      res.status(404).json({ error: 'Mood entry not found' });
    }
  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(500).json({ error: 'Failed to update mood entry' });
  }
});

// DELETE route to delete a mood entry by ID
app.delete('/api/moods/:id', async (req, res) => {
  try {
    const moodId = req.params.id;
    const deletedEntry = await MoodEntry.findByIdAndDelete(moodId);
    if (deletedEntry) {
      res.status(200).send({ message: 'Mood entry deleted successfully', entry: deletedEntry });
    } else {
      res.status(404).send({ error: 'Mood entry not found' });
    }
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    res.status(500).send({ error: 'Failed to delete mood entry' });
  }
});

// OpenAI v4 Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/decide-mood', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a mood detector. The user will describe their day, and you will reply with just the mood in one word, like "Happy", "Sad", etc.' },
        { role: 'user', content: prompt }
      ],
    });

    const mood = response.choices[0].message.content;
    res.json({ mood });
  } catch (error) {
    console.error('Error deciding mood:', error);
    res.status(500).json({ error: 'Failed to decide mood' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

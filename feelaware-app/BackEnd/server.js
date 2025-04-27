require('dotenv').config();
const { OpenAI } = require('openai');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://admin:admin@feelawaredb.mubb5ey.mongodb.net/?retryWrites=true&w=majority&appName=FeelAwareDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Mood Schema
const moodSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mood: { type: String, required: true },
  reflection: { type: String, default: '' },
  image: { type: String, default: '' }, // To store the image URL
});

const MoodEntry = mongoose.model('MoodEntry', moodSchema);

// Body Parsing Middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Image upload setup with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Folder for images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File naming to avoid duplicates
  },
});

const upload = multer({ storage: storage });

// POST route to create a new mood entry
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

// PUT route to update a mood entry
app.put('/api/moods/:id', async (req, res) => {
  try {
    const { reflection, image } = req.body;
    const updatedEntry = await MoodEntry.findByIdAndUpdate(
      req.params.id,
      { reflection, image }, // Update reflection and image
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

// DELETE route to delete a mood entry
app.delete('/api/moods/:id', async (req, res) => {
  try {
    const deletedMood = await MoodEntry.findByIdAndDelete(req.params.id);
    if (deletedMood) {
      res.status(200).json({ message: 'Mood entry deleted successfully', mood: deletedMood });
    } else {
      res.status(404).json({ error: 'Mood entry not found' });
    }
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    res.status(500).json({ error: 'Failed to delete mood entry' });
  }
});

// POST route to decide the mood using OpenAI
app.post('/api/decide-mood', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a mood detector. The user will describe their day, and you will reply with just the mood in one word, like "Happy", "Sad", etc., Make sure you add a corresponding emoji to go along with the chosen feeling' },
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

// POST route to handle image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`; // URL to access the uploaded image
  res.json({ imageUrl }); // Send back the image URL
});

// Serve uploaded images statically (for development)
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

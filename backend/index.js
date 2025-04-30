const express = require("express");
require("dotenv").config();
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const Team = require('./src/models/Team');
const Task = require('./src/models/Task');
const Idea = require('./src/models/Ideas');
const Resource = require('./src/models/Resource');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./src/middlewares/auth');
const app = express();

app.use(cors(
  {
    origin: ['http://localhost:5173', 'https://de-view.vercel.app'],
    credentials: true,
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

connectDB().then(()=>{
    console.log("Database Connection Established");
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("Server is listening");
    });
})
.catch((err)=>{
    console.error("Database Connection Failed", err);
});


app.get("/", (req, res) => {
    res.send("Hello this is backend"); 
});

//sign up
app.post('/signup', async (req, res) => { 
    const { email, username, password } = req.body;
    try {
      // Check for existing user
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ title: "User already exists" });
      }
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create and save new user
      const user = new User({ email, username, password: hashedPassword });
      await user.save();
      res.status(200).send({ message: "Signup successful" });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).send({ message: "Failed to create user" });
    } 
  });

  //login
  app.post('/login',async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send({ title: "User not Found" });
      }
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ title: "Invalid Password" });
      }
      // Login successful, Adding JWT Authentication
  
      //1. Create JWT Token
      const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET);
  
      //2. Add the token to cookie and send the reponse back to the user
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
      
      // req.session.user = user;
      res.send({ message: "Login successful" , teamCode:user.teamCode});
    } catch (error) {
      res.status(500).send({ message: "Failed to login" });
    }
   
  });

  //update team code for a user upon joining a team
  app.patch('/user/teamCode', userAuth, async (req, res) => {
  const { teamCode } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.teamCode = teamCode;
    const team = await Team.findOne({ teamCode });
    if (!team) {
      // Create a new team if it doesn't exist
      const newTeam = new Team({ teamCode, members: [user.username] });
      await newTeam.save();
    } else {
      // Add the user to the team 
      team.members.push(user.username);
      await team.save();
    }
    await user.save();
    res.status(200).send({ message: "Team code updated successfully" });
  } catch (err) {
    console.error("Error updating team code:", err);
    res.status(500).send({ message: "Failed to update team code" });
  }
});

//get the team members
app.get('/team', userAuth, async (req, res) => {
  try {
    const user = req.user; 
    const teamCode = user.teamCode;

    if (!teamCode) {
      return res.status(400).send({ message: 'User is not in any team' });
    }

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }
    res.status(200).json({ members: team.members });

  } catch (err) {
    console.error('Error fetching team info:', err);
    res.status(500).send({ message: 'Failed to fetch team info' });
  }
});

//get the tasks
app.get("/tasks", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const teamCode = user.teamCode;
    const tasks = await Task.find({ teamCode });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST new task
app.post("/tasks",userAuth, async (req, res) => {
  try {
    const { title, desc, assignedTo, priority, status, dueDate } = req.body;
   
    const task = new Task({
      teamCode: req.user.teamCode,
      title:title,
      desc:desc,
      assignedTo:assignedTo,
      priority: priority,
      status: status,
      dueDate: dueDate
    });

    await task.save();
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create task" });
  }
});

// PATCH update task field
app.patch("/tasks/:id", userAuth, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json({ task: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update task" });
  }
});

// DELETE task
app.delete("/tasks/:id", userAuth, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted", task: deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

//post github repo url
app.post('/repoUrl', userAuth, async (req, res) => {
  const { gitRepoUrl } = req.body;
  try {
    const teamCode = req.user.teamCode;
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).send({ message: 'Team not found' });
    }
    team.gitRepoUrl = gitRepoUrl;
    await team.save();
    res.status(200).send({ message: "GitHub repo URL saved successfully" });
  } catch (err) {
    console.error("Error saving GitHub repo URL:", err);
    res.status(500).send({ message: "Failed to save GitHub repo URL" });
  }
}); 

//get github repo url
app.get("/repoUrl", userAuth, async (req, res) => {
  try {
    const teamCode = req.user.teamCode;
    const team = await Team.findOne({ teamCode });
    res.json({ gitRepoUrl: team.gitRepoUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//fetch github repo stats
function extractRepoInfo(url) {
  try {
      const path = new URL(url).pathname.split('/').filter(Boolean);
      return { owner: path[0], repo: path[1] };
  } catch (err) {
      return null;
  }
}

const fetchAllPRs = async (url) => {
  let page = 1;
  let allPRs = [];
  let fetched;

  do {
    const res = await axios.get(`${url}&per_page=100&page=${page}`);
    fetched = res.data;
    allPRs = allPRs.concat(fetched);
    page++;
  } while (fetched.length === 100);

  return allPRs;
};

app.get('/repoStats',userAuth, async (req, res) => {
  try {
    const teamCode = req.user.teamCode;
    const team = await Team.findOne({ teamCode });
    const repoUrl = team.gitRepoUrl;

      const { owner, repo } = extractRepoInfo(repoUrl);
      if (!owner || !repo) return res.status(400).json({ message: 'Invalid repo URL.' });

      const [repoRes, commitsRes, allPRs, langsRes, contribRes] = await Promise.all([
          axios.get(`https://api.github.com/repos/${owner}/${repo}`),
          axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`),
          fetchAllPRs(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`),
          axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`),
          axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`)
      ]);

      const openPRs = allPRs.filter(pr => pr.state === 'open');
      const closedPRs = allPRs.filter(pr => pr.state === 'closed');
      const latestCommit = commitsRes.data[0];

      const stats = {
          name: repoRes.data.name,
          commitsCount: contribRes.data.reduce((sum, c) => sum + c.contributions, 0),
          openPRs: openPRs.length,
          closedPRs: closedPRs.length,
          latestCommit: {
              message: latestCommit.commit.message,
              author: latestCommit.commit.author.name
          },
          languages: Object.keys(langsRes.data),
          deployedUrl: repoRes.data.homepage || 'N/A',
          contributors: contribRes.data.map(c => c.login).slice(0, 5),
          createdAt: new Date(repoRes.data.created_at).toLocaleDateString(),
          defaultBranch: repoRes.data.default_branch
      };

      res.json(stats);

  } catch (error) {
      console.error('Error fetching GitHub repo data:', error);
      res.status(500).json({ message: 'Failed to fetch repo stats.' });
  }
});

//generate ideas and save ideas
app.post('/idea', userAuth, async (req, res) => {
  let formData = req.body;
  const prompt = `
You are an AI project ideator. Based on the following details, suggest a creative software project idea:
- Theme: ${formData.theme}
- Team Size: ${formData.teamSize}
- Duration: ${formData.duration}
- Deadline: ${formData.deadline}
- Skills: ${formData.skills.join(', ')}
- Complexity: ${formData.complexity}
- Tech Stack: ${formData.techStack}
- Deployment required: ${formData.deployment}
- Outputs expected: ${formData.outputs.join(', ')}
- References preferred: ${formData.references.join(', ')}
- Other References: ${formData.otherReference}

Please suggest one innovative project idea stating the problem statement, the solution, tech stack to be used, modules in the project and step by step process for the project according to deadline for every week, link some references to find more about this idea, already existings website on provided idea with appropriate formatting and emojis like giving the heading in bold and capital.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          "HTTP-Referer": "http://de-view.vercel.app",
          "X-Title": "DeView-Ideator"
        }
      }
    );
    formData["teamCode"] = req.user.teamCode;
    const generatedIdea = response.data.choices[0].message.content;
    formData["generatedIdea"] = generatedIdea;
    const newIdea = new Idea(formData);

    await newIdea.save();
    res.json(newIdea);

  } catch (error) {
    console.error('Error generating or saving idea:', error.message);
    res.status(500).json({ error: 'Failed to generate or save idea' })
  }
});

//fetch ideas
app.get('/ideas', userAuth, async (req, res) => {
  const { teamCode } = req.user;
  try {
    const ideas = await Idea.find({ teamCode });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

//delete an idea
app.delete('/idea/:id', async (req, res) => {
  try {
    const deletedIdea = await Idea.findByIdAndDelete(req.params.id);
    if (!deletedIdea) return res.status(404).send('Idea not found');
    res.status(200).json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).send('Server error');
  }
});

// POST a new resource
app.post('/resources', userAuth, async (req, res) => {
  const { message } = req.body;
  const sender = req.user.username; // Assuming `username` is part of the user object
  const teamCode = req.user.teamCode;

  try {
      let resource = await Resource.findOne({ teamCode });

      if (!resource) {
          resource = new Resource({ teamCode, resources: [] });
      }

      resource.resources.push({ sender, message });
      await resource.save();

      res.status(201).json(resource.resources[resource.resources.length - 1]); // Return the newly added resource
  } catch (error) {
      console.error('Error saving resource:', error);
      res.status(500).json({ error: 'Failed to save resource' });
  }
});

// GET all resources for a team
app.get('/resources', userAuth, async (req, res) => {
  const teamCode = req.user.teamCode;

  try {
      const resource = await Resource.findOne({ teamCode });
      if (!resource) return res.json({ resources: [] });

      res.json(resource.resources);
  } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// DELETE a specific resource
app.delete('/resources/:id', userAuth, async (req, res) => {
  const teamCode = req.user.teamCode;
  const resourceId = req.params.id;

  try {
      const resource = await Resource.findOne({ teamCode });
      if (!resource) return res.status(404).json({ error: 'Resource not found' });

      resource.resources = resource.resources.filter((_, index) => index.toString() !== resourceId);
      await resource.save();

      res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
  }
});

//log out
app.post('/logout', (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.send({ message: "Logged out successfully" });
});
  



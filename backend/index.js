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
const sgMail = require('@sendgrid/mail');
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
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    const creator = req.user.username;
    const assignee = await User.findOne({username: assignedTo});
    await task.save();
    const msg = {
      to: assignee.email,
      from: process.env.VERIFIED_SENDER_EMAIL,
      subject: '✏️Task Assigned | DeView',
      html: `
      <div style="max-width: 650px; margin: 40px auto; padding: 25px; background: linear-gradient(135deg, #E0FFFF, pink); border-radius: 40px; box-shadow: 0 18px 20px rgba(0, 0, 0, 0.1); font-family: 'Poppins, Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c3e50;">
      <h1 style="font-size: 30px; margin-bottom: 20px; color: #2c3e50; text-align: center; border-bottom: 2px solid #dfe6e9; padding-bottom: 10px;">
        ${task.title}
      </h1>

      <p style="margin: 12px 0; font-size: 16px;">
        <strong>Description:</strong>
        <span style="color: #6c5ce7;">${desc}</span>
      </p>

      <p style="margin: 12px 0; font-size: 16px;">
        <strong>Assigned By:</strong>
        <span style="color: red;">${creator}</span>
      </p>

      <p style="margin: 12px 0; font-size: 16px;">
        <strong>Priority:</strong>
        <span style="background-color: #f39c12; color: white; padding: 4px 10px; border-radius: 12px; font-size: 14px; margin-left: 8px;">
          ${priority}
        </span>
      </p>

      <p style="margin: 12px 0; font-size: 16px;">
        <strong>Status:</strong>
        <span style="background-color: #3498db; color: white; padding: 4px 10px; border-radius: 12px; font-size: 14px; margin-left: 8px;">
          To Do
        </span>
      </p>

      <p style="margin: 12px 0; font-size: 16px;">
        <strong>Due Date:</strong>
        <span style="color:rgb(124, 124, 124); font-weight: bold;">${dueDate}</span>
      </p>
    </div>
      `,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
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

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'DeView',
    Accept: 'application/vnd.github+json'
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
    const res = await axiosInstance(`${url}&per_page=100&page=${page}`);
    fetched = res.data;
    allPRs = allPRs.concat(fetched);
    page++;
    console.log('Rate Limit Remaining:', res.headers['x-ratelimit-remaining']);
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
          axiosInstance(`https://api.github.com/repos/${owner}/${repo}`),
          axiosInstance(`https://api.github.com/repos/${owner}/${repo}/commits`),
          fetchAllPRs(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`),
          axiosInstance(`https://api.github.com/repos/${owner}/${repo}/languages`),
          axiosInstance(`https://api.github.com/repos/${owner}/${repo}/contributors`),
      ]);

      const recentCommits = commitsRes.data.slice(0, 10);
      const recentFiles = {};
      const recentFilesList = new Set();

      for (const commit of recentCommits) {
        const commitData = await axiosInstance(commit.url);
        const files = commitData.data.files || [];
        files.forEach(f => {
          recentFiles[f.filename] = (recentFiles[f.filename] || 0) + f.changes;
          if (recentFilesList.size < 5) {
            recentFilesList.add(f.filename);
          }
        });
      }
      const sortedFiles = Object.entries(recentFiles)
        .map(([filename, changes]) => ({ filename, changes }))
        .sort((a, b) => b.changes - a.changes)
        .slice(0, 5);

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
          defaultBranch: repoRes.data.default_branch,
          recentMostFiles: Array.from(recentFilesList),
          sortedFiles
      };

      res.json(stats);

  } catch (error) {
      console.error('Error fetching GitHub repo data:', error.response?.status || error.message);
      console.error(error.response?.status, error.response?.data);
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

//save project documentation
app.post('/documentation', userAuth, async (req, res) => {
  const { teamCode } = req.user;
  const { projectDesc } = req.body;
  try {
    const team = await Team.findOne({ teamCode });
    team.projectDesc = projectDesc;
    await team.save();
    res.status(200).json({ message: 'Documentation updated successfully', projectDesc: team.projectDesc });
  } catch (error) {
    console.error('Error updating documentation:', error);
    res.status(500).json({ error: 'Failed to update documentation' });
  }
});

//get project documentation
app.get('/documentation', userAuth, async (req, res) => {
  const { teamCode } = req.user;
  try {
    const team = await Team.findOne({ teamCode });
    if (!team || !team.projectDesc) {
      return res.status(404).json({ error: 'Documentation not found' });
    }
    res.json({ projectDesc: team.projectDesc });
  } catch (error) {
    console.error('Error fetching documentation:', error);
    res.status(500).json({ error: 'Failed to fetch documentation' });
  }
});

//get social media handles by username array
app.post('/getSocialMediaHandles', userAuth, async (req, res) => {
  const { usernames } = req.body;
  try {
    const socialMediaHandles = await Promise.all(usernames.map(async (username) => {
      const user = await User.findOne({ username });
      return user ? user.socialMediaHandles : null;
    }));
    res.json(socialMediaHandles);
  } catch (error) {
    console.error('Error fetching social media handles:', error);
    res.status(500).json({ error: 'Failed to fetch social media handles' });
  }
});

//patch user details- socila media handles
app.patch('/userDetails', userAuth, async (req, res) => {
  const { member } = req.body;
  try {
    const user = await User.findOne({ username: member.username });
    user.socialMediaHandles = [member.github, member.linkedin, member.discord];
    await user.save();
    res.status(200).json({ message: 'User details updated successfully' });
  }
  catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// Fetch commit data from GitHub API
app.get("/commits", userAuth, async (req, res) => {
    try {
      const teamCode = req.user.teamCode;
      const team = await Team.findOne({ teamCode });
      const repoUrl = team.gitRepoUrl;
      const { owner, repo } = extractRepoInfo(repoUrl);
        // const response = await (axiosInstance(`https://api.github.com/repos/${owner}/${repo}/commits`));

        // // Map the data to extract author and timestamp
        // const commits = response.data.map((commit) => ({
        //     author: commit.commit.author.name,
        //     timestamp: commit.commit.author.date,
        // }));

      let allCommits = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await axiosInstance.get(
          `https://api.github.com/repos/${owner}/${repo}/commits`,
          {
            params: {
              per_page: 100,
              page: page,
            },
          }
        );
        
        const commits = response.data.map((commit) => ({
          author: commit.author?.login || commit.commit.author.name,
          timestamp: commit.commit.author.date,
        }));
      
        allCommits = [...allCommits, ...commits];
        
        if (response.data.length < 100) {
          hasMore = false; // No more pages
        } else {
          page++;
        }
      }

        // res.status(200).json(allCommits);
      const heatmapData = {};

      allCommits.forEach(({ author, timestamp }) => {
        // Convert timestamp to IST (UTC+5:30)
        const date = new Date(timestamp);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
        const istDate = new Date(date.getTime() + istOffset);
        const hour = istDate.getHours();

        if (!heatmapData[author]) {
          heatmapData[author] = Array(24).fill(0);
        }

        heatmapData[author][hour]++;
      });

      // Format for frontend
      const formatted = [];
      Object.entries(heatmapData).forEach(([author, hours]) => {
        hours.forEach((count, hour) => {
          formatted.push({ author, hour, count });
        });
      });

      res.status(200).json(formatted);
    } catch (error) {
        console.error("Error fetching commits:", error);
        res.status(500).json({ error: "Failed to fetch commit data" });
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
  



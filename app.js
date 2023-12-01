const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const multer = require('multer');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
   extended: true
}));


var firstName, lastName, age, phoneNumber, email,profilePicture,filename, skillList, schoolName, schoolDegree, schoolDate, collegeDate, collegeDegree, collegeName, higherEducationDate, higherEducationDegree, higherEducationName, aboutMe, hobbies, skills, workCompany, workDuration,  workPosition;


app.get('/', (req, res) => {
   res.render('Homes');
});

app.get('/build', (req, res) => {
  res.render('form');
});

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './public/uploads/');
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage: storage });



app.post('/form', upload.single('profilePicture'), (req, res) => {
   console.log(req.file.originalname);
   if (!req.file) {
      return res.status(400).send('No file uploaded.');
   }
   firstName = req.body.firstName;
   lastName = req.body.lastName;
   age = req.body.age;
   phoneNumber = req.body.phoneNumber;
   email = req.body.email;
   profilePicture =req.file.originalname;
   schoolName = req.body.schoolName;
   schoolDegree = req.body.schoolDegree;
   schoolDate = req.body.schoolDate;
   collegeName = req.body.collegeName;
   collegeDegree = req.body.collegeDegree;
   collegeDate = req.body.collegeDate;
   higherEducationName = req.body.higherEducationName;
   higherEducationDegree = req.body.higherEducationDegree;
   higherEducationDate = req.body.higherEducationDate;
   aboutMe = req.body.aboutMe;
   hobbies = req.body.hobbies;
   skills = req.body.skills;
   workPosition = req.body.workPosition;
   workCompany = req.body.workCompany;
   workDuration = req.body.workDuration;

   
   skillList = skills.split(',').map((skill) => {
      const parts = skill.split('-');
      return {
         name: parts[0],
         proficiency: parts[1]
      };
   });

 
   const resumeData = {
      name: `${firstName} ${lastName}`,
      age,
      phoneNumber,
      email,
       profilePicture: `/uploads/${profilePicture}`,
      education: [{
            degree: schoolDegree,
            institution: schoolName,
            date: schoolDate
         },
         {
            degree: collegeDegree,
            institution: collegeName,
            date: collegeDate
         },
         {
            degree: higherEducationDegree,
            institution: higherEducationName,
            date: higherEducationDate
         },
      ],
      workExperience: [{
         position: workPosition,
         company: workCompany,
         date: workDuration
      }, ],
      aboutMe,
      interests: hobbies.split(','),
      skills: skillList,
   };

   
   res.render('resume', resumeData);
});


app.post('/generate-pdf', async (req, res) => {
   

   const query = new URLSearchParams({
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      profilePicture,
      schoolName,
      schoolDegree,
      schoolDate,
      collegeName,
      collegeDegree,
      collegeDate,
      higherEducationName,
      higherEducationDegree,
      higherEducationDate,
      aboutMe,
      hobbies,
      skills,
      workPosition,
      workCompany,
      workDuration,
   }).toString();

   // Launch a headless browser
   const browser = await puppeteer.launch();
      console.log(browser);
   // Create a new page
   const page = await browser.newPage();
   console.log(page);

   
   await page.goto(`http://localhost:3000/form?${query}`);

  

   await page.emulateMediaType('screen');

   
   const pdfBuffer = await page.pdf({
      format: 'A4', 
      margin: {
         top: '20px',
         right: '20px',
         bottom: '20px',
         left: '20px'
      }, 
      printBackground: true,
   });

   await browser.close();

   
   res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
   res.setHeader('Content-Type', 'application/pdf');

   res.send(pdfBuffer);
});

app.get('/form', (req, res) => {

   const {
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      profilePicture,
      schoolName,
      schoolDegree,
      schoolDate,
      collegeName,
      collegeDegree,
      collegeDate,
      higherEducationName,
      higherEducationDegree,
      higherEducationDate,
      aboutMe,
      hobbies,
      skills,
      workPosition,
      workCompany,
      workDuration,
   } = req.query;

   skillList = skills.split(',').map((skill) => {
      const parts = skill.split('-');
      return {
         name: parts[0],
         proficiency: parts[1]
      };
   });
  
   const resumeData = {
      name: `${firstName} ${lastName}`,
      age,
      phoneNumber,
      email,
      profilePicture: `/uploads/${profilePicture}`,
      education: [{
            degree: schoolDegree,
            institution: schoolName,
            date: schoolDate
         },
         {
            degree: collegeDegree,
            institution: collegeName,
            date: collegeDate
         },
         {
            degree: higherEducationDegree,
            institution: higherEducationName,
            date: higherEducationDate
         },
      ],
      workExperience: [{
         position: workPosition,
         company: workCompany,
         date: workDuration
      }, ],
      aboutMe,
      interests: hobbies.split(','),
      skills: skillList,
   };

   
   res.render('resume', resumeData);
});


app.listen(3000, () => {
   console.log('Server is running on port 3000');
});
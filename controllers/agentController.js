const agents = require('../models/agentModel')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const XLSX = require('xlsx')
const tasks = require('../models/task')
// add Agents
exports.addAgentController = async (req,res)=>{
    console.log('inside register');
    const {name,email,phone,password} = req.body
    console.log(name,email,phone,password);
    
    try{
        const existingUser = await agents.findOne({email})
        if(existingUser){
            res.status(406).json("Email alrady exist...")
        }else{
            const newUser = new agents({
                name,email,phone,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(err){
        res.status(401).json(err)
    }
}

exports.addFileController = async (req,res)=>{
    try{
    console.log("inside addFileController");
    const file = req.file
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    const ext = path.extname(file.originalname).toLowerCase()
    console.log(ext);
    
    let records = []

    // read and parse files
    if (ext === '.csv') {
        const fileContent = file.buffer;
        await new Promise((resolve, reject) => {
          parse(fileContent, { columns: true, trim: true }, (err, output) => {
            if (err) reject(err);
            else {
              records = output;
              resolve();
            }
          });
        });
      } else if (ext === '.xlsx' || ext === '.xls') {
        console.log("xlsx or xls");
        
        const workbook = XLSX.read(file.buffer, { type: 'buffer' })
        console.log(workbook);
        
        const sheetName = workbook.SheetNames[0];
        console.log(sheetName);
        
        const worksheet = workbook.Sheets[sheetName];
        console.log(worksheet);
        
        records = XLSX.utils.sheet_to_json(worksheet);
        const cleanRecord = (records) => {
            const cleaned = {};
            Object.keys(records).forEach((key) => {
              const trimmedKey = key.trim();
              cleaned[trimmedKey] = typeof records[key] === 'string' ? records[key].trim() : records[key];
            });
            return cleaned;
          };
          
          const cleanedRecords = records.map(cleanRecord);
        console.log("cleaned records");
        
        // console.log(cleanedRecords);
        
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
    const validRecords = records.filter(
        (r) => r.firstname && r.phone && r.notes
      )
    //   console.log(validRecords);
      
      if (validRecords.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty data' });
      }
    const Agents = await agents.find()
    console.log(Agents);
    
    //Distribute tasks
    const distributed = Array.from({ length: Agents.length }, () => []);
    validRecords.forEach((record, i) => {
      const agentIndex = i % Agents.length;
      distributed[agentIndex].push(record);
    });
    console.log(validRecords);
    

    //Save tasks to DB
    const allTasks = distributed.flatMap((tasks, i) =>
        tasks.map((task) => ({
          agentId: Agents[i]._id,
          firstname: task.firstname,
          phone: task.phone,
          notes: task.notes,
        }))
      )
      console.log(allTasks);
      await tasks.deleteMany({});
      await tasks.insertMany(allTasks);

      //Delete file after processing
    // fs.unlinkSync(file.path);
    const agentsWithTasks = await agents.find().populate("tasks")
    console.log(agentsWithTasks);
    
    res.status(200).json({ message: 'File processed and tasks assigned',agents: agentsWithTasks, });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
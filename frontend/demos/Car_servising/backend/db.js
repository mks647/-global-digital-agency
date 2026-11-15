const Database=require("better-sqlite3"),path=require("path"),fs=require("fs");
const dir=path.join(__dirname,"data");fs.mkdirSync(dir,{recursive:true});
const db=new Database(path.join(dir,"enquiries.sqlite"));db.pragma("journal_mode=WAL");
db.exec(`CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS enquiries(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,vehicle TEXT,package TEXT,message TEXT,status TEXT DEFAULT 'New',created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
module.exports=db;

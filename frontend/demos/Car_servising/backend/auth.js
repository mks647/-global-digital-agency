const bcrypt=require("bcryptjs"),db=require("./db");
function requireAdmin(req,res,next){if(!req.session.adminId)return res.status(401).json({message:"Please log in."});next();}
async function seedAdmin(){const u=process.env.ADMIN_USERNAME,p=process.env.ADMIN_PASSWORD;if(!u||!p||p.length<14)throw Error("Set ADMIN_USERNAME and 14+ character ADMIN_PASSWORD in .env");if(db.prepare("SELECT id FROM admins WHERE username=?").get(u))throw Error("Admin already exists; refusing to overwrite.");db.prepare("INSERT INTO admins(username,password_hash) VALUES(?,?)").run(u,await bcrypt.hash(p,12));console.log("Admin created. Keep credentials private.");}
module.exports={requireAdmin,seedAdmin};

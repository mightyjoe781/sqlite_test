var sqlite3 = require('sqlite3').verbose();
var express = require('express')
var app = express();
var db = new sqlite3.Database('./database/employee.db');


//----- DB Handle -----------

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get('/', function(req,res){
  res.send("<h3>Welcome to the Sample SQLite3 testing with NodeJS</h3><p>There are 6 ops</p><ul><li>WRITE : /add/id/name</li><li>READ: /view/name</li><li>READ: /view/id</li><li>DUMP: /all</li><li>UPDATE: /update/id/name</li><li>DELETE: /del/id</li></ul>");
});

//---------- CRUD ------------
//--------WRITE----------
app.get('/add/:id/:name', function(req,res){
	db.serialize(()=>{
		db.run('INSERT INTO emp (id,name) VALUES (?,?)',[req.params.id, req.params.name], function(err){
			if(err){
				return console.log(err.messages);
			}
			console.log("Employee Added"+ " emp id= "+req.params.id+" name = "+req.params.name);
			res.redirect("/all");
		});
	});
});

//--------------READ-----------
app.get('/view/:id',function(req,res){
	db.serialize(()=>{
		db.each('SELECT id ID, name NAME FROM emp WHERE id = ?',[req.params.id],function(err,row){
			if(err){
				res.send("error while displaying");
				return console.error(err.message);
			}
			res.send(` ID: ${row.ID}, Name: ${row.NAME}`);
			console.log("successs while displaying");
		});
	});
});
//---------------READ (name) -----------
app.get('/view/:name',function(req,res){
	db.serialize(()=>{
		db.each('SELECT id ID, name NAME FROM emp WHERE id = ?',[req.params.name],function(err,row){
			if(err){
				res.send("error while displaying");
				return console.error(err.message);
			}
			res.send(` ID: ${row.ID}, Name: ${row.NAME}`);
			console.log("successs while displaying");
		});
	});
});
//------------ALL DB --------------
app.get('/all',function(req,res){
	var records = []
	db.serialize(()=>{
		db.all('SELECT id ID, name NAME FROM emp ORDER BY id',[],(err,rows)=>{
			if(err){
				console.log(err.message);
			}
			console.log(rows);
			rows.forEach((row)=>{
				res.write(` ID: ${row.ID}, Name: ${row.NAME} \n`);
			})
			res.end();
		});
	});
});
//----------- UPDATE ------------
app.get('/update/:id/:name', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE emp SET name = ? WHERE id = ?', [req.params.name,req.params.id], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});
//----------- DELETE ------------
app.get('/del/:id', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM emp WHERE id = ?', req.params.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });});

//-------------LISTNER------------
var port 	 = 31000
var hostname = '127.0.0.1'
app.listen(port,hostname,function(){
	console.log("server started");
});

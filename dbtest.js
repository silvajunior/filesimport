const { Pool, Client } = require('pg')

const fs = require('fs')
const readline = require('readline');

function monitor () {
  const files = fs.readdirSync('./files')
  const Folder = './files/';
  console.log(`${files.length} file(s) found!`) 
  const path = './files/';

  fs.readdirSync(Folder).forEach(file => {
    console.log(file);
    var oldPath = 'files/'+file;
    var newPath = 'imported/'+file;
    
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'test',
      password: '',
      port: 5432,
    })
    
    var copyFrom = require('pg-copy-streams').from
    
    pool.connect(function (err, client, done) {
      var stream = client.query(copyFrom('COPY newtable FROM STDIN'))
      var fileStream = fs.createReadStream(newPath)
      fileStream.on('error', done)
      stream.on('error', done)
      stream.on('finish', done)
      fileStream.pipe(stream)
    })
    
    try {
          fs.renameSync(oldPath, newPath, function (err) {
            if (err) throw err
            console.log('Moved.')
          })
       
        } catch(err) {
          console.error(err)
        } 
  });

}

setInterval(monitor, 2000)

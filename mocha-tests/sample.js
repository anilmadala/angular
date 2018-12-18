const Pool = require('threads').Pool;
 
//const pool = new Pool();
// Alternatively: new Pool(<number of threads to spawn>)
var pool = new Pool(20);
 
// Run a script
const jobA = pool
  .run('concurrent-test')
  .send({ do : 'something' });
 
// Run the same script, but with a different parameter
const jobB = pool
  .send({ do : 'something else' });
 
//
 
pool
  .on('done', function(job, message) {
    console.log('Job done:', job);
  })
  .on('error', function(job, error) {
    console.error('Job errored:', job);
  })
  .on('finished', function() {
    console.log('Everything done, shutting down the thread pool.');
    pool.killAll();
  });
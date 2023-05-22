let records = [{ 
  id: 1, 
  username: 'jack', 
  password: "$2a$10$cYkitAxTti012c1ly7Yj3OcPjd0z91RZUe8JS2xph53eSN7WRlNUa", 
  displayName: 'Jack Smith', 
  emails: [ { value: 'jack@example.com' } ] 
}];

exports.findById = function(id, cb) {
process.nextTick(() => {
  let idx = id - 1;
  if (records[idx]) {
    cb(null, records[idx]);
  } else {
    cb(new Error('User ' + id + ' does not exist'));
  }
});
}

exports.findByUsername = function(username, cb) {
//tell the JS engine to process a function asynchronously (after the current function), but as soon as possible, not queue it.
process.nextTick(() => {
  for (let i = 0, len = records.length; i < len; i++) {
    let record = records[i];
    if (record.username === username) {
      return cb(null, record);
    }
  }
  return cb(null, null);
});
}
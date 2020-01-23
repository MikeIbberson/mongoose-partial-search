<h1>🔎 Mongoose partial search plugin</h1>

<p>
  <img src="https://github.com/MikeIbberson/mongoose-partial-search/workflows/Node%20CI/badge.svg" alt="Status" />
<a href='https://coveralls.io/github/MikeIbberson/mongoose-partial-search?branch=master'><img src='https://coveralls.io/repos/github/MikeIbberson/mongoose-partial-search/badge.svg?branch=master' alt='Coverage Status' /></a>
<img src='https://bettercodehub.com/edge/badge/MikeIbberson/mongoose-partial-search?branch=master'>
</p> 

<p>This packages adds a <code>searchBuilder</code> static method to the <a href="https://mongoosejs.com/docs/schematypes.html">Mongoose</a> model that returns a case-insensitive, regex-powered query to drop into your find functions.</p>


``` Javascript
  const plugin = require('mongoose-partial-search');
  const mongoose = require('mongoose');

  const Schema = new mongoose.Schema({
    name: {
      type: String,
      searchable: true,
    }
  });

  Schema.plugin(plugin);
  
  const Model = mongoose.model('foo', Schema);
  const query = Model.searchBuilder('bar');

  // then, use the query however you like.
```

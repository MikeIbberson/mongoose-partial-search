<h1>🔎 Mongoose partial search plugin</h1>
<p>This packages adds a <code>searchBuilder</code> static method to the <a href="https://mongoosejs.com/docs/schematypes.html">Mongoose</a> model.</p> This method returns a case-insensitive, regex-powered query to drop into your find functions.</p>


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
  
  Const Model = mongoose.model('TRY_IT', Schema);
  const query = Model.searchBuilder('Henry');

  // then, use the query however you like.
```
# jQuery.InputRule

A lightweight, chainable jQuery plugin for reusable input validation and transformation.

## 🔧 Installation

Include jQuery and the plugin:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="dist/jquery.inputrule.min.js"></script>
```

## 🚀 Usage
```js
$('#namaText')
  .InputRuleChain()
  .required()
  .alphabet(true)
  .number(false)
  .noSpecialChar(false)
  .maxlength(50)
  .then((val) => {
    console.log('Valid input:', val);
  });
```

## ✅ Supported Rules
- required()
- minlength(n)
- maxlength(n)
- alphabet(true/false)
- number(true/false)
- alphanumeric(true/false)
- noSpecialChar(true/false)
- email(true)
- regex(regex)
- match(selector)
- then(callback)

## 📄 License
MIT


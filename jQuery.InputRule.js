(function ($) {
  function InputRuleChain($input) {
    this.$input = $input;
    this._rules = {};
    this._afterInput = null;
  }

  InputRuleChain.prototype.required = function (val = true) {
    this._rules.required = val;
    return this;
  };

  InputRuleChain.prototype.minlength = function (val) {
    this._rules.minlength = val;
    return this;
  };

  InputRuleChain.prototype.maxlength = function (val) {
    this._rules.maxlength = val;
    this.$input.attr('maxlength', val);
    return this;
  };

  InputRuleChain.prototype.alphabet = function (val = true) {
    this._rules.alphabet = val;
    return this;
  };

  InputRuleChain.prototype.number = function (val = true) {
    this._rules.number = val;
    return this;
  };

  InputRuleChain.prototype.alphanumeric = function (val = true) {
    this._rules.alphanumeric = val;
    return this;
  };

  InputRuleChain.prototype.noSpecialChar = function (val = true) {
    this._rules.noSpecialChar = val;
    return this;
  };

  InputRuleChain.prototype.regex = function (val) {
    this._rules.regex = val;
    return this;
  };

  InputRuleChain.prototype.match = function (selector) {
    this._rules.match = selector;
    return this;
  };

  InputRuleChain.prototype.email = function (val = true) {
    this._rules.email = val;
    return this;
  };

  InputRuleChain.prototype.then = function (callback) {
    this._afterInput = callback;

    this.$input.on('input', () => {
      let val = this.$input.val();

      // --- 1. Sanitasi Input
      if (this._rules.alphanumeric === true) {
        val = val.replace(/[^a-zA-Z0-9\s]/g, '');
      } else {
        if (this._rules.alphabet === true) {
          val = val.replace(/[^a-zA-Z\s]/g, '');
        } else if (this._rules.alphabet === false) {
          val = val.replace(/[a-zA-Z]/g, '');
        }

        if (this._rules.number === true) {
          val = val.replace(/[^0-9]/g, '');
        } else if (this._rules.number === false) {
          val = val.replace(/[0-9]/g, '');
        }
      }

      if (this._rules.noSpecialChar === false) {
        val = val.replace(/[^a-zA-Z0-9\s]/g, '');
      }

      this.$input.val(val);

      // --- 2. Validasi
      const error = this.validate(val);
      if (!error && typeof this._afterInput === 'function') {
        this._afterInput.call(this.$input[0], val);
      }
    });

    return this;
  };

  InputRuleChain.prototype.validate = function (val = null) {
    if (val === null) val = this.$input.val();
    const name = this.$input.attr('name') || this.$input.attr('id') || 'Field';

    if (this._rules.required && val.trim() === '')
      return `${name} wajib diisi.`;

    if (this._rules.minlength && val.length < this._rules.minlength)
      return `${name} minimal ${this._rules.minlength} karakter.`;

    if (this._rules.maxlength && val.length > this._rules.maxlength)
      return `${name} maksimal ${this._rules.maxlength} karakter.`;

    if (this._rules.regex && !(new RegExp(this._rules.regex).test(val)))
      return `${name} tidak sesuai format.`;

    if (this._rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return `Format email tidak valid.`;

    if (this._rules.match) {
      const otherVal = $(this._rules.match).val();
      if (val !== otherVal) return `${name} tidak cocok.`;
    }

    return null; // valid
  };

  // jQuery interface
  $.fn.InputRuleChain = function () {
    return new InputRuleChain(this);
  };
})(jQuery);

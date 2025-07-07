(function ($) {
  function InputRuleChain($input) {
    this.$input = $input;
    this._rules = {};
    this._trim = false;
    this._onInvalid = null;
    this._onValid = null;
    this._afterInput = null;
    this._useDefaultErrorView = false;

    // Internal unique ID fallback
    this._inputId = $input.attr('id');
    if (!this._inputId) {
      this._inputId = 'input-' + Math.random().toString(36).substr(2, 5);
      $input.attr('id', this._inputId);
    }
  }

  // === Chainable Rules ===
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

  InputRuleChain.prototype.trim = function (val = true) {
    this._trim = val;
    return this;
  };

  // === Error Hooks & Default UI ===
  InputRuleChain.prototype.onInvalid = function (callback) {
    this._onInvalid = callback;
    return this;
  };

  InputRuleChain.prototype.onValid = function (callback) {
    this._onValid = callback;
    return this;
  };

  InputRuleChain.prototype.useDefaultErrorView = function (val = true) {
    this._useDefaultErrorView = val;
    return this;
  };

  // === Validation + View Trigger ===
  InputRuleChain.prototype.then = function (callback) {
    this._afterInput = callback;

    this.$input.on('input', () => {
      let val = this.$input.val();
      if (this._trim) val = val.trim();

      // Transform input
      if (this._rules.alphanumeric === true) {
        val = val.replace(/[^a-zA-Z0-9\s]/g, '');
      } else {
        if (this._rules.alphabet === true) val = val.replace(/[^a-zA-Z\s]/g, '');
        else if (this._rules.alphabet === false) val = val.replace(/[a-zA-Z]/g, '');

        if (this._rules.number === true) val = val.replace(/[^0-9]/g, '');
        else if (this._rules.number === false) val = val.replace(/[0-9]/g, '');
      }

      if (this._rules.noSpecialChar === false) {
        val = val.replace(/[^a-zA-Z0-9\s]/g, '');
      }

      this.$input.val(val);
      const error = this.validate(val);

      // Handle Error View
      if (error) {
        if (typeof this._onInvalid === 'function') {
          this._onInvalid.call(this, this.$input[0], error);
        } else if (this._useDefaultErrorView) {
          this.applyDefaultErrorView(error);
        }
      } else {
        if (typeof this._onValid === 'function') {
          this._onValid.call(this, this.$input[0]);
        } else if (this._useDefaultErrorView) {
          this.clearDefaultErrorView();
        }

        if (typeof this._afterInput === 'function') {
          this._afterInput.call(this.$input[0], val);
        }
      }
    });

    return this;
  };

  InputRuleChain.prototype.validate = function (val = null) {
    if (val === null) val = this.$input.val();
    if (this._trim) val = val.trim();

    const name = this.$input.attr('name') || this._inputId || 'Field';

    if (this._rules.required && val === '') return `${name} wajib diisi.`;
    if (this._rules.minlength && val.length < this._rules.minlength) return `${name} minimal ${this._rules.minlength} karakter.`;
    if (this._rules.maxlength && val.length > this._rules.maxlength) return `${name} maksimal ${this._rules.maxlength} karakter.`;
    if (this._rules.regex && !(new RegExp(this._rules.regex).test(val))) return `${name} tidak sesuai format.`;
    if (this._rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return `Format email tidak valid.`;

    if (this._rules.match) {
      const otherVal = $(this._rules.match).val();
      if (val !== otherVal) return `${name} tidak cocok.`;
    }

    return null;
  };

  InputRuleChain.prototype.applyDefaultErrorView = function (message) {
    this.$input.addClass('input-error');

    const errorId = this._inputId + "-error";
    let $error = $("#" + errorId);

    if ($error.length === 0) {
      $error = $('<div class="input-error-message"></div>').attr('id', errorId);
      this.$input.after($error);
    }

    $error.text(message).show();
  };

  InputRuleChain.prototype.clearDefaultErrorView = function () {
    this.$input.removeClass('input-error');

    const errorId = this._inputId + "-error";
    $("#" + errorId).hide();
  };

  // === jQuery Wrapper ===
  $.fn.InputRuleChain = function () {
    return new InputRuleChain(this);
  };
})(jQuery);
